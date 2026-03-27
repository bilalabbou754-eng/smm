import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const services = ["Instagram", "TikTok", "YouTube", "Facebook", "Telegram", "Spotify"];
const faqs = [
  ["How fast are orders processed?", "Most orders are submitted instantly and updated automatically from the provider API."],
  ["Can I use my own API provider?", "Yes. Update the environment variables and the service layer will point to your provider."],
  ["Is the panel mobile friendly?", "Yes. The landing page and dashboard are fully responsive for phones, tablets, and desktops."]
];

export function ServicesSection() {
  return (
    <section id="services" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Services</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Coverage across the platforms your clients care about.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Card key={service}>
              <p className="text-sm text-[var(--muted)]">Channel {index + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold">{service}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                Premium engagement, audience growth, and retention services with API-based fulfilment.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection({ serviceCount = 1200 }) {
  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Pricing Preview</p>
          <h2 className="mt-4 text-3xl font-bold">Transparent rates with room for markup.</h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">
            Sync live provider services or curate your own pricing. Show dynamic previews on the landing page or inside the order form.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Starter", formatCurrency(1.9), "per 1k"],
              ["Growth", formatCurrency(4.5), "per 1k"],
              ["Premium", formatCurrency(8.75), "per 1k"]
            ].map(([label, price, note]) => (
              <div key={label} className="rounded-3xl border border-white/5 bg-black/25 p-4">
                <p className="text-sm text-[var(--muted)]">{label}</p>
                <p className="mt-2 text-2xl font-bold">{price}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{note}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-[var(--accent-soft)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Provider Ready</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--border)] bg-black/30 p-6">
              <p className="text-sm text-[var(--muted)]">Live Services</p>
              <p className="mt-2 text-4xl font-black">{serviceCount}+</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-black/30 p-6">
              <p className="text-sm text-[var(--muted)]">Built-in Margin</p>
              <p className="mt-2 text-4xl font-black">Flexible</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">How It Works</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["1. Create account", "Register, log in, and secure your session with JWT-based auth."],
            ["2. Add funds", "Use the mock wallet now and swap in Stripe when you are ready."],
            ["3. Submit orders", "Pick a service, enter the link, and track fulfilment from the dashboard."]
          ].map(([title, copy]) => (
            <Card key={title}>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{copy}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Testimonials</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            "Our order flow feels enterprise-ready now.",
            "The dashboard made client fulfilment much easier to manage.",
            "The design looks premium and the API sync saved us hours."
          ].map((quote, index) => (
            <Card key={quote}>
              <p className="text-lg leading-8">{quote}</p>
              <p className="mt-6 text-sm text-[var(--muted)]">Client #{index + 1}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm uppercase tracking-[0.24em] text-[var(--accent)]">FAQ</p>
        <div className="mt-8 space-y-4">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h3 className="text-lg font-semibold">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
