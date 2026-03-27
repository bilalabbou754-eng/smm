import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          No account yet?{" "}
          <Link href="/register" className="text-[var(--accent)]">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
