import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { StatCards } from "@/components/dashboard/stats";
import { getCurrentUser } from "@/lib/session";
import { getDashboardMetrics } from "@/lib/dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const metrics = await getDashboardMetrics(user._id);

  return (
    <div>
      <DashboardHeader title={`Welcome back, ${user.name}`} subtitle="Your social growth operations hub." />
      <StatCards metrics={metrics} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OrdersTable orders={metrics.recentOrders} />
        <Card>
          <h2 className="text-xl font-semibold">Recent Ticket Activity</h2>
          <div className="mt-4 space-y-4">
            {metrics.recentTickets.map((ticket) => (
              <div key={ticket._id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="font-medium">{ticket.subject}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{ticket.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
