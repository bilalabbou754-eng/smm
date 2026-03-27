import { DashboardHeader } from "@/components/dashboard/header";
import { OrderForm } from "@/components/dashboard/order-form";
import { Card } from "@/components/ui/card";
import { listServices } from "@/lib/store";

export default async function NewOrderPage() {
  const services = await listServices();

  return (
    <div>
      <DashboardHeader title="New Order" subtitle="Select a service and submit it directly to your provider." />
      {services.length ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <OrderForm services={services} />
          <Card>
            <h2 className="text-xl font-semibold">Order Rules</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <li>Use a valid URL or username based on the selected service.</li>
              <li>Stay inside the provider min and max quantity limits.</li>
              <li>Order status updates can be refreshed from the orders page.</li>
            </ul>
          </Card>
        </div>
      ) : (
        <Card>
          <p className="text-lg font-semibold">No services synced yet.</p>
          <p className="mt-3 text-sm text-[var(--muted)]">Call the services API route once your provider credentials are configured to populate the catalog.</p>
        </Card>
      )}
    </div>
  );
}
