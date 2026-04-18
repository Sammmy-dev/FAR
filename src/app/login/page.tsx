import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded bg-surface-lowest p-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-neutral-900">FAR Admin</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to manage your platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
