import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

// Magic bytes for each allowed format
const MAGIC_BYTES: Record<string, (buf: Buffer) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/webp": (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  "image/avif": (b) =>
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 &&
    (b[8] === 0x61 || b[8] === 0x6d), // "ftyp" followed by "avif"/"avis"
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // MIME validation
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  // Server-side size validation
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_SIZE / 1024 / 1024}MB)` },
      { status: 400 },
    );
  }

  // Read file buffer for magic number check
  const buffer = Buffer.from(await file.arrayBuffer());
  const checkMagic = MAGIC_BYTES[file.type];
  if (!checkMagic || !checkMagic(buffer)) {
    return NextResponse.json(
      { error: "File content does not match expected image format" },
      { status: 400 },
    );
  }

  // Generate unique filename
  const ext = file.type.split("/")[1] || "jpg";
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  // Ensure upload directory exists
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Write to disk
  const filepath = join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

  return NextResponse.json({ url });
}
