import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200",
        variant === "primary" && "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]",
        variant === "secondary" && "border border-[var(--border)] bg-white/5 text-white hover:bg-white/10",
        variant === "ghost" && "text-[var(--muted)] hover:text-white",
        className
      )}
      {...props}
    />
  );
}
