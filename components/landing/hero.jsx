import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="grid-pattern relative overflow-hidden px-6 pb-20 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Fast. Secure. Automated.
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">
            Scale social growth with a premium SMM panel built for speed.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Launch campaigns for Instagram, TikTok, YouTube, Telegram, and more from one polished dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register">
              <Button className="min-w-36">Start Now</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" className="min-w-36">
                How It Works
              </Button>
            </a>
          </div>
        </div>
        <Card className="relative overflow-hidden p-0">
          <div className="border-b border-white/5 px-6 py-5">
            <p className="text-sm text-[var(--muted)]">Live Campaign Snapshot</p>
          </div>
          <div className="space-y-4 p-6">
            {[
              ["Instagram Followers", "12,500", "Completed"],
              ["TikTok Likes", "8,000", "In progress"],
              ["YouTube Views", "50,000", "Pending"]
            ].map(([title, amount, status]) => (
              <div key={title} className="rounded-3xl border border-white/5 bg-black/30 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)]">{title}</p>
                    <p className="mt-2 text-2xl font-bold">{amount}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
