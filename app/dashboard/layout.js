import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar role={user?.role} />
        <section>{children}</section>
      </div>
    </main>
  );
}
