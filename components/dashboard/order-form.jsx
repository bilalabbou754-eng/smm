"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export function OrderForm({ services }) {
  const [selectedId, setSelectedId] = useState(services[0]?.providerId || "");
  const [quantity, setQuantity] = useState(1000);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => services.find((item) => item.providerId === selectedId), [services, selectedId]);
  const charge = service ? (service.rate / 1000) * quantity : 0;

  async function submitOrder(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId: selectedId, quantity, link })
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.error || "Order submitted successfully.");
  }

  return (
    <Card>
      <form className="space-y-5" onSubmit={submitOrder}>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Service</label>
          <Select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {services.map((item) => (
              <option key={item.providerId} value={item.providerId}>
                {item.category} - {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Link / Username</label>
          <Input value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://instagram.com/your-post" required />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Quantity</label>
          <Input
            type="number"
            min={service?.min || 1}
            max={service?.max || 100000}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            required
          />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] p-4">
          <p className="text-sm text-[var(--muted)]">Estimated charge</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(charge)}</p>
        </div>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit Order"}
        </Button>
      </form>
    </Card>
  );
}
