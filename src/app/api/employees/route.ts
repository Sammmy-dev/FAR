import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { EmployeeSchema, FINANCIAL_FIELDS } from "@/lib/validations";
import { FINANCIAL_SELECT } from "@/models/Employee";

// GET /api/employees — admin only
// SUPER_ADMIN gets financial fields; STAFF does not
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";
  const baseQuery = Employee.find()
    .populate("clientId", "name")
    .sort({ createdAt: -1 });

  const employees = await (isSuperAdmin
    ? baseQuery.select(FINANCIAL_SELECT)
    : baseQuery
  ).lean();

  return NextResponse.json(employees);
}

// POST /api/employees — admin only
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Strip financial fields if caller is not SUPER_ADMIN
  if (session.user.role !== "SUPER_ADMIN") {
    for (const field of FINANCIAL_FIELDS) {
      delete body[field];
    }
  }

  const parsed = EmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const employee = await Employee.create(parsed.data);
  return NextResponse.json(employee, { status: 201 });
}
