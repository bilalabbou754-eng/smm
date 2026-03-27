"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FundsForm() {
  const [amount, setAmount] = useState(50);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/funds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();
    setMessage(data.error || data.message);
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Top up wallet</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">This is wired as a mock balance flow. Swap in Stripe Checkout or Payment Intents when ready.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input type="number" min="1" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        <Button type="submit">Add Funds</Button>
      </form>
      {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
    </Card>
  );
}
