import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { fetchServices } from "@/lib/apiClient";
import { listServices, upsertServices } from "@/lib/store";

function applyMarkup(rate) {
  const markup = Number(process.env.SMM_PRICING_MARKUP_PERCENT || 0);
  return Number(rate) * (1 + markup / 100);
}

export async function GET() {
  await connectToDatabase();

  let services = await listServices();

  if (!services.length) {
    try {
      const providerServices = await fetchServices();
      await upsertServices(
        providerServices.map((service) => ({
          providerId: String(service.service),
          name: service.name,
          category: service.category,
          rate: applyMarkup(service.rate),
          min: service.min,
          max: service.max,
          refill: Boolean(service.refill),
          cancel: Boolean(service.cancel)
        }))
      );
      services = await listServices();
    } catch {
      services = [];
    }
  }

  return NextResponse.json({ services });
}
