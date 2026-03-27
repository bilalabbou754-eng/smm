import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { listRecentOrders, listRecentTickets, listUsers } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();
  const [users, orders, tickets] = await Promise.all([
    listUsers(30),
    listRecentOrders(30),
    listRecentTickets(30)
  ]);

  return NextResponse.json({
    stats: {
      totalUsers: users.length,
      totalOrders: orders.length,
      openTickets: tickets.filter((ticket) => ticket.status !== "closed").length
    },
    users,
    orders,
    tickets
  });
}
