import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { verificationCodes } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 },
      );
    }

    // Rate limit: max 10 verify attempts per IP per 10 min
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";
    const ipLimit = checkRateLimit(`verify-code:${ip}`, 10, 10 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "尝试次数过多，请稍后再试" },
        { status: 429 },
      );
    }

    const db = getDb();

    const record = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          eq(verificationCodes.used, false),
          gt(verificationCodes.expiresAt, new Date()),
        ),
      )
      .then((rows) => rows[0]);

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 },
      );
    }

    // Mark as used
    await db
      .update(verificationCodes)
      .set({ used: true })
      .where(eq(verificationCodes.id, record.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 },
    );
  }
}
