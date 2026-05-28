import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      bio: users.bio,
      region: users.region,
      location: users.location,
    })
    .from(users)
    .where(eq(users.id, Number(session.user.id)))
    .then((r) => r[0]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, bio, avatar, region, location } = body;

  const db = getDb();
  const [updated] = await db
    .update(users)
    .set({
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(region !== undefined && { region }),
      ...(location !== undefined && { location }),
    })
    .where(eq(users.id, Number(session.user.id)))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      bio: users.bio,
      region: users.region,
      location: users.location,
    });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
