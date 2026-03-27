import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function TicketsPanel({ tickets }) {
  return (
    <div className="space-y-5">
      {tickets.map((ticket) => (
        <Card key={ticket._id}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">{ticket.subject}</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Updated {formatDate(ticket.updatedAt)}</p>
            </div>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {ticket.status}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {ticket.messages.map((message) => (
              <div key={message._id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{message.senderRole}</p>
                <p className="mt-2 text-sm leading-7">{message.message}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
