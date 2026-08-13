"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
}

/** Shared base classes applied to every button variant. */
export const btnBase =
  "group inline-flex items-center justify-center font-sans font-semibold transition-all duration-[200ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

/** Variant-specific class strings — use these on <Link> or <a> elements for consistent styling. */
export const btnVariants = {
  primary:
    "bg-ocean-deeper text-white rounded-[13px] h-[48px] min-h-[44px] px-6 py-0 text-[15px] font-semibold shadow-btn hover:bg-ocean-dark hover:brightness-[1.05] hover:-translate-y-[1px] hover:shadow-btn-glow active:translate-y-0 active:scale-[0.98]",
  secondary:
    "rounded-[13px] h-[48px] min-h-[44px] px-6 py-0 text-[15px] font-semibold border border-ocean/20 bg-transparent text-ocean-deeper hover:bg-ocean/[0.06] hover:border-ocean/40 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(11,84,151,0.08)] active:translate-y-0 active:scale-[0.98]",
  ghost:
    "rounded-[13px] h-[48px] min-h-[44px] px-6 py-0 text-[15px] font-semibold text-ocean hover:text-ocean-dark hover:bg-ocean/[0.05] active:scale-[0.98]",
  icon:
    "h-11 w-11 min-h-[44px] min-w-[44px] rounded-[13px] text-ocean/50 hover:bg-ocean/[0.06] hover:text-ocean",
  /** White variant — for use on dark/image backgrounds */
  primaryWhite:
    "bg-white text-ocean-deeper rounded-[13px] h-[48px] min-h-[44px] px-6 py-0 text-[15px] font-semibold shadow-btn hover:bg-white hover:brightness-[0.97] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.98]",
  /** Ghost on dark bg (white text, white border) */
  ghostWhite:
    "rounded-[13px] h-[48px] min-h-[44px] px-6 py-0 text-[15px] font-semibold border border-white/20 text-white hover:bg-white/[0.10] hover:border-white/30 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={cn(
          btnBase,
          variant === "primary" && btnVariants.primary,
          variant === "secondary" && btnVariants.secondary,
          variant === "ghost" && btnVariants.ghost,
          variant === "icon" && btnVariants.icon,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
