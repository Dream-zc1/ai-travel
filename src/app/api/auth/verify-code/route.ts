import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { verificationCodes } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 },
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
