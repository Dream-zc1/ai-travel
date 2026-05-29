import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { placeCheckins, users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const radiusKm = parseFloat(searchParams.get("radius_km") || "1");
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const db = getDb();

  // Approximate: 1° lat ≈ 111km, 1° lng ≈ 111*cos(lat) km
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const rows = await db
    .select({
      id: placeCheckins.id,
      userId: placeCheckins.userId,
      placeName: placeCheckins.placeName,
      comment: placeCheckins.comment,
      imageUrl: placeCheckins.imageUrl,
      createdAt: placeCheckins.createdAt,
      userName: users.name,
      userAvatar: users.avatar,
    })
    .from(placeCheckins)
    .leftJoin(users, sql`${placeCheckins.userId} = CAST(${users.id} AS TEXT)`)
    .where(
      sql`${placeCheckins.lat} BETWEEN ${lat - latDelta} AND ${lat + latDelta}
          AND ${placeCheckins.lng} BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}`,
    )
    .orderBy(desc(placeCheckins.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { placeName, lat, lng, comment, imageUrl } = await req.json();
  if (!placeName || lat === undefined || lng === undefined) {
    return NextResponse.json({ error: "placeName, lat, lng required" }, { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .insert(placeCheckins)
    .values({
      userId: session.user.id,
      placeName,
      lat: String(lat),
      lng: String(lng),
      comment: comment || null,
      imageUrl: imageUrl || null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
