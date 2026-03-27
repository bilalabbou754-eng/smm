import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { updateUserBalance } from "@/lib/store";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const amount = Number(body.amount || 0);

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }

  await connectToDatabase();
  await updateUserBalance(user._id, amount);

  return NextResponse.json({
    success: true,
    message: "Funds added to wallet. Replace this mock flow with Stripe or your payment gateway."
  });
}
