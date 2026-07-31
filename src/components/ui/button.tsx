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
          "group inline-flex items-center justify-center font-sans font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          variant === "primary" &&
            "bg-ocean-deeper text-white rounded-btn h-11 px-7 py-0 text-[11px] font-bold uppercase tracking-[0.12em] shadow-btn hover:bg-ocean-dark hover:shadow-btn-hover hover:-translate-y-0.5 active:translate-y-0",
          variant === "secondary" &&
            "rounded-btn h-11 px-7 py-0 text-[11px] font-bold uppercase tracking-[0.12em] border border-ocean/15 bg-white/60 backdrop-blur-sm text-ocean-deeper hover:border-ocean/30 hover:bg-white hover:shadow-sm hover:-translate-y-0.5",
          variant === "ghost" &&
            "bg-transparent text-ocean hover:text-ocean-dark rounded-btn h-11 px-7 py-0 text-[11px] font-bold uppercase tracking-[0.12em] hover:-translate-y-0.5",
          variant === "icon" &&
            "h-10 w-10 rounded-btn text-ocean/50 hover:bg-ocean/6 hover:text-ocean",
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
