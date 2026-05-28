import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { pinnedPlaces } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const places = await db
    .select()
    .from(pinnedPlaces)
    .where(eq(pinnedPlaces.userId, session.user.id))
    .orderBy(desc(pinnedPlaces.createdAt));

  return NextResponse.json(places);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, lat, lng, photo } = await req.json();

    if (!name || lat == null || lng == null) {
      return NextResponse.json(
        { error: "Name, lat, and lng required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const [place] = await db
      .insert(pinnedPlaces)
      .values({
        userId: session.user.id,
        name,
        lat: String(lat),
        lng: String(lng),
        photo: photo || null,
      })
      .returning();

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error("Add place error:", error);
    return NextResponse.json(
      { error: "Failed to add place" },
      { status: 500 },
    );
  }
}
