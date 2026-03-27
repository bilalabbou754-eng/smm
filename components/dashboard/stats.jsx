import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function StatCards({ metrics }) {
  const items = [
    ["Wallet Balance", formatCurrency(metrics.balance)],
    ["Provider Balance", formatCurrency(metrics.providerBalance)],
    ["Total Orders", String(metrics.totalOrders)],
    ["Open Tickets", String(metrics.openTickets)]
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label}>
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-4 text-3xl font-black">{value}</p>
        </Card>
      ))}
    </div>
  );
}
