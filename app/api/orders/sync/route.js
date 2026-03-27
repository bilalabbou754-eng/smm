import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { fetchProviderOrderStatus } from "@/lib/apiClient";
import { listOrdersForSync, updateOrderStatus } from "@/lib/store";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const orders = await listOrdersForSync(user._id, 15);

  await Promise.all(
    orders.map(async (order) => {
      try {
        const status = await fetchProviderOrderStatus(order.providerOrderId);
        await updateOrderStatus(order._id, status.status || order.status);
      } catch {
        return null;
      }
    })
  );

  return NextResponse.json({ success: true });
}
