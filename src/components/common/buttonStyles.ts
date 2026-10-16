import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "light" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-md active:bg-brand-700 focus-visible:ring-brand-500",
  secondary: "bg-ink-900 text-white shadow-sm hover:bg-ink-800 focus-visible:ring-ink-700",
  outline: "border border-ink-300 bg-white text-ink-800 hover:border-ink-400 hover:bg-ink-50 focus-visible:ring-ink-400",
  ghost: "text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-300",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",
  // For use on dark bands (hero, CTA): solid white and frosted-glass.
  light: "bg-white text-ink-900 shadow-sm hover:bg-brand-50 focus-visible:ring-white focus-visible:ring-offset-ink-900",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-ink-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-lg px-3 py-1.5 text-sm",
  md: "gap-2 rounded-lg px-4 py-2.5 text-sm",
  lg: "gap-2 rounded-xl px-6 py-3.5 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}
