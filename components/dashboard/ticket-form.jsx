"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TicketForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setMessage(data.error || "Ticket opened successfully.");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Open a new ticket</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input name="subject" placeholder="Subject" required />
        <Textarea name="message" rows={5} placeholder="Describe your issue" required />
        <Button type="submit">Create Ticket</Button>
      </form>
      {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
    </Card>
  );
}
