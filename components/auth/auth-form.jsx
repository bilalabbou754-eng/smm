"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function AuthForm({ mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-lg">
      <h1 className="text-3xl font-bold">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {isRegister ? "Launch your SMM panel workspace in minutes." : "Access your dashboard and manage campaigns."}
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {isRegister ? <Input name="name" placeholder="Full name" required /> : null}
        <Input type="email" name="email" placeholder="Email address" required />
        <Input type="password" name="password" placeholder="Password" required />
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </Button>
      </form>
    </Card>
  );
}
