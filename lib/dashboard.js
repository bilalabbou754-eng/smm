import { fetchProviderBalance } from "@/lib/apiClient";
import {
  countOrdersByUser,
  getUserById,
  listRecentOrdersByUser,
  listRecentTicketsByUser
} from "@/lib/store";

export async function getDashboardMetrics(userId) {
  const [orders, tickets, user, providerBalance] = await Promise.all([
    listRecentOrdersByUser(userId, 5),
    listRecentTicketsByUser(userId, 5),
    getUserById(userId),
    fetchProviderBalance().catch(() => ({ balance: 0 }))
  ]);

  const totalOrders = await countOrdersByUser(userId);

  return {
    balance: user?.balance || 0,
    providerBalance: providerBalance?.balance || 0,
    totalOrders,
    openTickets: tickets.filter((ticket) => ticket.status !== "closed").length,
    recentOrders: orders,
    recentTickets: tickets
  };
}
