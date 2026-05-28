import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { verificationCodes } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = getDb();

    // Rate limit: 60s cooldown
    const recent = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          gt(verificationCodes.createdAt, new Date(Date.now() - 60_000)),
        ),
      )
      .then((rows) => rows[0]);

    if (recent) {
      return NextResponse.json(
        { error: "请 60 秒后再试 / Please wait 60 seconds" },
        { status: 429 },
      );
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Invalidate previous unused codes for this email
    await db
      .update(verificationCodes)
      .set({ used: true })
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.used, false),
        ),
      );

    await db.insert(verificationCodes).values({ email, code, expiresAt });

    if (resend) {
      const { data, error: sendError } = await resend.emails.send({
        from: "AI Travel <delivered@resend.dev>",
        to: email,
        subject: "您的验证码 / Your Verification Code",
        html: `
          <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px;">
            <h2 style="margin-bottom:16px;">AI Travel Planner</h2>
            <p style="color:#555;font-size:14px;">您的验证码 / Your verification code:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:24px;background:#f5f5f5;border-radius:12px;margin:16px 0;">
              ${code}
            </div>
            <p style="color:#999;font-size:12px;">有效期 10 分钟 / Valid for 10 minutes</p>
          </div>
        `,
      });

      if (sendError) {
        console.error("Resend error:", sendError);
        return NextResponse.json(
          { error: "Failed to send email", detail: sendError.message },
          { status: 500 },
        );
      }
    }

    // Dev mode: return code in response so user can see it
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json({ success: true, ...(isDev && { code }) });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 },
    );
  }
}
