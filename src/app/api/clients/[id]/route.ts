import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { ClientUpdateSchema } from "@/lib/validations";
import { deleteImage } from "@/lib/cloudinary";

interface Params {
  params: { id: string };
}

// GET /api/clients/[id] — admin only
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const client = await Client.findById(params.id).lean();
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(client);
}

// PATCH /api/clients/[id] — admin only
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ClientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();

  // If a new logo is being set, delete the old Cloudinary asset
  if (parsed.data.logoPublicId) {
    const existing = await Client.findById(params.id).select("logoPublicId").lean();
    if (existing?.logoPublicId && existing.logoPublicId !== parsed.data.logoPublicId) {
      await deleteImage(existing.logoPublicId);
    }
  }

  const client = await Client.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(client);
}

// DELETE /api/clients/[id] — admin only
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const client = await Client.findByIdAndDelete(params.id).lean();
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Clean up Cloudinary logo asset
  if (client.logoPublicId) {
    await deleteImage(client.logoPublicId);
  }

  return NextResponse.json({ success: true });
}
