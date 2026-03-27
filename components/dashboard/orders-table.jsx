import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export function OrdersTable({ orders }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/5 text-[var(--muted)]">
            <tr>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4">Charge</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-white/5 last:border-b-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{order.serviceName}</p>
                  <p className="text-xs text-[var(--muted)]">{order.providerOrderId}</p>
                </td>
                <td className="px-5 py-4">{order.quantity}</td>
                <td className="px-5 py-4">{formatCurrency(order.charge)}</td>
                <td className="px-5 py-4">{order.status}</td>
                <td className="px-5 py-4 text-[var(--muted)]">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
