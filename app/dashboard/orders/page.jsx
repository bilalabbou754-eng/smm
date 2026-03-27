"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");

  async function loadOrders(search = "") {
    const response = await fetch(`/api/orders?query=${encodeURIComponent(search)}`);
    const data = await response.json();
    setOrders(data.orders || []);
  }

  async function syncOrders() {
    await fetch("/api/orders/sync", { method: "POST" });
    await loadOrders(query);
  }

  useEffect(() => {
    loadOrders(query);
  }, [query]);

  return (
    <div>
      <DashboardHeader title="Orders" subtitle="Track, filter, and refresh order fulfilment." />
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by service, status, or order ID" />
        <Button onClick={syncOrders}>Refresh Status</Button>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
