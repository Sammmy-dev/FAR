import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import EmployeesTable from "@/components/admin/EmployeesTable";
import type { IEmployee } from "@/types";

export const metadata: Metadata = { title: "Manage Employees" };

async function getEmployees(isSuperAdmin: boolean): Promise<IEmployee[]> {
  await connectDB();
  let query = Employee.find().populate("clientId", "name").sort({ createdAt: -1 });

  if (isSuperAdmin) {
    query = query.select(
      "+salary +farFee +bankName +accountNumber +accountName"
    ) as typeof query;
  }

  const employees = await query.lean();
  return JSON.parse(JSON.stringify(employees));
}

export default async function AdminEmployeesPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
  const employees = await getEmployees(isSuperAdmin);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Employees</h1>
        <Link
          href="/dashboard/employees/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + New Employee
        </Link>
      </div>
      <EmployeesTable employees={employees} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
