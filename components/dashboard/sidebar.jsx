"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingCart, PackageSearch, Wallet, LifeBuoy, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/new-order", label: "New Order", icon: ShoppingCart },
  { href: "/dashboard/orders", label: "Orders", icon: PackageSearch },
  { href: "/dashboard/funds", label: "Add Funds", icon: Wallet },
  { href: "/dashboard/tickets", label: "Tickets", icon: LifeBuoy },
  { href: "/admin", label: "Admin", icon: Shield }
];

export function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="glass-panel flex h-fit flex-col rounded-[28px] p-5">
      <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">SMM Panel Pro</p>
      <nav className="mt-6 space-y-2">
        {links
          .filter((link) => (link.href === "/admin" ? role === "admin" : true))
          .map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  pathname === link.href ? "bg-[var(--accent)] text-black" : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
      </nav>
      <button onClick={logout} className="mt-6 rounded-2xl border border-[var(--border)] px-4 py-3 text-left text-sm text-[var(--muted)] hover:text-white">
        Logout
      </button>
    </aside>
  );
}
