import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getDashboardMetrics } from "@/lib/dashboard";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metrics = await getDashboardMetrics(user._id);
  return NextResponse.json({ user, metrics });
}
