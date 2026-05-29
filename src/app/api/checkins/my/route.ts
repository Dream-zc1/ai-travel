import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { placeCheckins } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select({
      id: placeCheckins.id,
      placeName: placeCheckins.placeName,
      lat: placeCheckins.lat,
      lng: placeCheckins.lng,
      imageUrl: placeCheckins.imageUrl,
      comment: placeCheckins.comment,
      createdAt: placeCheckins.createdAt,
    })
    .from(placeCheckins)
    .where(eq(placeCheckins.userId, session.user.id))
    .orderBy(desc(placeCheckins.createdAt));

  return NextResponse.json(rows);
}
