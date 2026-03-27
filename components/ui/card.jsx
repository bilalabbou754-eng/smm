import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("glass-panel rounded-[28px] p-6", className)} {...props} />;
}
