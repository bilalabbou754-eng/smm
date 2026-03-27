import { DashboardHeader } from "@/components/dashboard/header";
import { FundsForm } from "@/components/dashboard/funds-form";

export default function FundsPage() {
  return (
    <div>
      <DashboardHeader title="Add Funds" subtitle="Wallet top-up flow ready for Stripe integration." />
      <FundsForm />
    </div>
  );
}
