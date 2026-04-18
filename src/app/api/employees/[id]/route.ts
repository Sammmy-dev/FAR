import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { EmployeeUpdateSchema, FINANCIAL_FIELDS } from "@/lib/validations";
import { FINANCIAL_SELECT } from "@/models/Employee";
import { deleteImage } from "@/lib/cloudinary";

interface Params {
  params: { id: string };
}

// GET /api/employees/[id] — admin only
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";
  const query = Employee.findById(params.id).populate("clientId", "name");
  const employee = await (isSuperAdmin
    ? query.select(FINANCIAL_SELECT)
    : query
  ).lean();

  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

// PATCH /api/employees/[id] — admin only
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Enforce: STAFF cannot touch financial fields
  if (session.user.role !== "SUPER_ADMIN") {
    for (const field of FINANCIAL_FIELDS) {
      delete body[field];
    }
  }

  const parsed = EmployeeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();

  // Clean up old photo from Cloudinary when replacing
  if (parsed.data.photoPublicId) {
    const existing = await Employee.findById(params.id)
      .select("photoPublicId")
      .lean();
    if (
      existing?.photoPublicId &&
      existing.photoPublicId !== parsed.data.photoPublicId
    ) {
      await deleteImage(existing.photoPublicId);
    }
  }

  const employee = await Employee.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

// DELETE /api/employees/[id] — admin only
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const employee = await Employee.findByIdAndDelete(params.id).lean();
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Clean up Cloudinary photo
  if (employee.photoPublicId) {
    await deleteImage(employee.photoPublicId);
  }

  return NextResponse.json({ success: true });
}
