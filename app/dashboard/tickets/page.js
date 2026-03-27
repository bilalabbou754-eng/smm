import { DashboardHeader } from "@/components/dashboard/header";
import { TicketForm } from "@/components/dashboard/ticket-form";
import { TicketsPanel } from "@/components/dashboard/tickets-panel";
import { getCurrentUser } from "@/lib/session";
import { listTicketsByUser } from "@/lib/store";

export default async function TicketsPage() {
  const user = await getCurrentUser();
  const tickets = await listTicketsByUser(user._id);

  return (
    <div>
      <DashboardHeader title="Support Tickets" subtitle="Open tickets and keep all replies inside the dashboard." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <TicketForm />
        <TicketsPanel tickets={tickets} />
      </div>
    </div>
  );
}
