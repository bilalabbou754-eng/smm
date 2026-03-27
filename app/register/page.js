import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <AuthForm mode="register" />
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already registered?{" "}
          <Link href="/login" className="text-[var(--accent)]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
