import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-[var(--border)] bg-black/30 px-4 py-3 text-white outline-none focus:border-[var(--accent)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
