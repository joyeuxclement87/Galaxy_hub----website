"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={cn(
          "group inline-flex items-center justify-center font-sans font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          variant === "primary" &&
            "bg-ocean-deeper text-white rounded-btn h-12 px-6 py-0 text-sm font-bold uppercase tracking-[0.12em] shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover hover:translate-y-0 active:scale-[0.98]",
          variant === "secondary" &&
            "rounded-btn h-12 px-6 py-0 text-sm font-bold uppercase tracking-[0.12em] border border-ocean/20 bg-white text-ocean-deeper hover:border-ocean/30 hover:bg-ocean/[0.03] hover:translate-y-0 active:scale-[0.98]",
          variant === "ghost" &&
            "rounded-btn h-12 px-6 py-0 text-sm font-bold uppercase tracking-[0.12em] text-ocean hover:text-ocean-dark hover:bg-ocean/[0.05] active:scale-[0.98]",
          variant === "icon" &&
            "h-12 w-12 rounded-btn text-ocean/50 hover:bg-ocean/6 hover:text-ocean",
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
