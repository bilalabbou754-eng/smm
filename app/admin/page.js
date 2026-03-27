import { DashboardHeader } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { listRecentOrders, listRecentTickets, listUsers } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    return (
      <Card>
        <p className="text-xl font-semibold">Admin access required.</p>
      </Card>
    );
  }

  const [users, orders, tickets] = await Promise.all([
    listUsers(20),
    listRecentOrders(20),
    listRecentTickets(20)
  ]);

  return (
    <div>
      <DashboardHeader title="Admin Panel" subtitle="Monitor users, orders, and support activity." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--muted)]">Users</p>
          <p className="mt-3 text-4xl font-black">{users.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Recent Orders</p>
          <p className="mt-3 text-4xl font-black">{orders.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Open Tickets</p>
          <p className="mt-3 text-4xl font-black">{tickets.filter((ticket) => ticket.status !== "closed").length}</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold">Latest Users</h2>
          <div className="mt-5 space-y-4">
            {users.map((user) => (
              <div key={user._id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="font-medium">{user.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{formatCurrency(user.balance)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Latest Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="font-medium">{order.serviceName}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{order.status}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{formatDate(order.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Latest Tickets</h2>
          <div className="mt-5 space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="font-medium">{ticket.subject}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{ticket.status}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{formatDate(ticket.updatedAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
