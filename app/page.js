import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import {
  FAQSection,
  HowItWorksSection,
  PricingSection,
  ServicesSection,
  TestimonialsSection
} from "@/components/landing/sections";
import { countServices } from "@/lib/store";

export default async function HomePage() {
  let serviceCount = 1200;

  try {
    serviceCount = await countServices();
  } catch {
    serviceCount = 1200;
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <PricingSection serviceCount={serviceCount} />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
