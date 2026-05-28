import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { pinnedPlaces } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const db = getDb();
  await db
    .delete(pinnedPlaces)
    .where(
      and(
        eq(pinnedPlaces.id, Number(id)),
        eq(pinnedPlaces.userId, session.user.id),
      ),
    );

  return NextResponse.json({ success: true });
}
