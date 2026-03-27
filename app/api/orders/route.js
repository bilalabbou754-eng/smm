import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createProviderOrder } from "@/lib/apiClient";
import { createOrder, getServiceByProviderId, getUserById, listOrdersByUser, updateUserBalance } from "@/lib/store";
import { orderSchema } from "@/lib/validators";

export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const orders = await listOrdersByUser(user._id, query);
  return NextResponse.json({ orders });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
  }

  await connectToDatabase();
  const service = await getServiceByProviderId(parsed.data.serviceId);

  if (!service) {
    return NextResponse.json({ error: "Service not found. Sync services first." }, { status: 404 });
  }

  const charge = (service.rate / 1000) * parsed.data.quantity;
  const currentUser = await getUserById(user._id);

  if ((currentUser?.balance || 0) < charge) {
    return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
  }

  const providerOrder = await createProviderOrder({
    service: parsed.data.serviceId,
    link: parsed.data.link,
    quantity: parsed.data.quantity
  });

  await updateUserBalance(user._id, -charge);

  const order = await createOrder({
    userId: user._id,
    providerOrderId: String(providerOrder.order || providerOrder.id),
    serviceId: service.providerId,
    serviceName: service.name,
    link: parsed.data.link,
    quantity: parsed.data.quantity,
    charge,
    status: "Pending"
  });

  return NextResponse.json({ success: true, order });
}
