import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// POST /api/upload — admin only
// Accepts multipart/form-data with a field named "file"
// Returns { url, publicId }
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
      { status: 400 }
    );
  }

  // 5 MB limit
  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Determine folder from ?folder= query param (defaults to "far/uploads")
  const url = new URL(req.url);
  const folder = url.searchParams.get("folder") ?? "far/uploads";

  const result = await uploadImage(buffer, folder);
  return NextResponse.json(result, { status: 201 });
}
