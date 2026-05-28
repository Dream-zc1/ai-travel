import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD not configured" },
        { status: 500 },
      );
    }

    const db = getDb();
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .then((rows) => rows[0]);

    if (existingAdmin) {
      return NextResponse.json({ status: "already_exists", email: existingAdmin.email });
    }

    // Upgrade if user with this email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .then((rows) => rows[0]);

    if (existingUser) {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, existingUser.id));
      return NextResponse.json({ status: "upgraded", email: adminEmail });
    }

    // Create new admin user
    const hashedPassword = await hash(adminPassword, 12);
    await db.insert(users).values({
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    return NextResponse.json({ status: "created", email: adminEmail }, { status: 201 });
  } catch (error) {
    console.error("Setup admin error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
