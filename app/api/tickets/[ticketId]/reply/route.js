import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { appendTicketReply, getTicketByIdForUser } from "@/lib/store";
import { ticketReplySchema } from "@/lib/validators";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ticketReplySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  await connectToDatabase();
  const ticket = await getTicketByIdForUser(params.ticketId, user._id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  const updatedTicket = await appendTicketReply(params.ticketId, {
    senderRole: "user",
    message: parsed.data.message,
    status: "open"
  });

  return NextResponse.json({ success: true, ticket: updatedTicket });
}
