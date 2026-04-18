import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Client from "@/models/Client";
import EmployeeForm from "@/components/admin/EmployeeForm";
import type { IEmployee, IClient } from "@/types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: "Edit Employee" };

async function getData(id: string, isSuperAdmin: boolean) {
  await connectDB();
  let query = Employee.findById(id);
  if (isSuperAdmin) {
    query = query.select(
      "+salary +farFee +bankName +accountNumber +accountName"
    ) as typeof query;
  }
  const [employee, clients] = await Promise.all([
    query.lean(),
    Client.find().select("name").sort({ name: 1 }).lean(),
  ]);
  return {
    employee: employee ? (JSON.parse(JSON.stringify(employee)) as IEmployee) : null,
    clients: JSON.parse(JSON.stringify(clients)) as IClient[],
  };
}

export default async function EditEmployeePage({ params }: Props) {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
  const { employee, clients } = await getData(params.id, isSuperAdmin);
  if (!employee) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        Edit Employee
      </h1>
      <EmployeeForm clients={clients} employee={employee} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
