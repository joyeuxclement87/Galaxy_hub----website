"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "primary" &&
            "bg-gradient-to-b from-ocean to-ocean-dark text-ivory hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(11,84,151,0.2)] rounded-btn px-8 py-3.5 text-base active:translate-y-0 shadow-premium",
          variant === "secondary" &&
            "bg-transparent border border-ocean/25 text-ocean hover:bg-ocean hover:text-ivory hover:border-ocean rounded-btn px-8 py-3.5 text-base active:scale-[0.98]",
          variant === "ghost" &&
            "bg-transparent text-ocean hover:bg-ocean/5 px-4 py-2",
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
