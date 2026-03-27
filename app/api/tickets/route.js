import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createTicket, listTicketsByUser } from "@/lib/store";
import { ticketSchema } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const tickets = await listTicketsByUser(user._id);
  return NextResponse.json({ tickets });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ticketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ticket details." }, { status: 400 });
  }

  await connectToDatabase();
  const ticket = await createTicket({
    userId: user._id,
    subject: parsed.data.subject,
    status: "open",
    messages: [
      {
        _id: crypto.randomUUID(),
        senderRole: "user",
        message: parsed.data.message,
        createdAt: new Date().toISOString()
      }
    ]
  });

  return NextResponse.json({ success: true, ticket });
}
