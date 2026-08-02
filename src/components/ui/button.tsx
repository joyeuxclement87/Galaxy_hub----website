"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
}

/** Shared base classes applied to every button variant. */
export const btnBase =
  "group inline-flex items-center justify-center font-sans font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

/** Variant-specific class strings — use these on <Link> or <a> elements for consistent styling. */
export const btnVariants = {
  primary:
    "bg-ocean-deeper text-white rounded-btn h-11 min-h-[44px] px-6 py-0 text-sm font-bold shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover active:scale-[0.98]",
  secondary:
    "rounded-btn h-11 min-h-[44px] px-6 py-0 text-sm font-bold border border-ocean/20 bg-white text-ocean-deeper hover:border-ocean/30 hover:bg-ocean/[0.03] active:scale-[0.98]",
  ghost:
    "rounded-btn h-11 min-h-[44px] px-6 py-0 text-sm font-bold text-ocean hover:text-ocean-dark hover:bg-ocean/[0.05] active:scale-[0.98]",
  icon:
    "h-11 w-11 min-h-[44px] min-w-[44px] rounded-btn text-ocean/50 hover:bg-ocean/6 hover:text-ocean",
  /** White variant — for use on dark/image backgrounds */
  primaryWhite:
    "bg-white text-ocean-deeper rounded-btn h-11 min-h-[44px] px-6 py-0 text-sm font-bold shadow-btn hover:bg-white/90 hover:shadow-btn-hover active:scale-[0.98]",
  /** Ghost on dark bg (white text, white border) */
  ghostWhite:
    "rounded-btn h-11 min-h-[44px] px-6 py-0 text-sm font-bold border border-white/20 text-white hover:bg-white/10 active:scale-[0.98]",
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
