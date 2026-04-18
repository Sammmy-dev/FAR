import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { ClientSchema } from "@/lib/validations";

// GET /api/clients — admin only
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const clients = await Client.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(clients);
}

// POST /api/clients — admin only
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const client = await Client.create(parsed.data);
  return NextResponse.json(client, { status: 201 });
}
