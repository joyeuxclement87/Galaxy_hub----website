import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Primary: Ocean background, Ivory text, Large pill shape, Hover: Lift 4px, slight glow, smooth transition
          variant === "primary" &&
            "bg-ocean text-ivory hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(11,84,151,0.2)] rounded-btn px-8 py-3.5 text-base active:translate-y-0",
          // Secondary: Transparent, Ocean border, Ocean text, Hover: Ocean fill, Ivory text
          variant === "secondary" &&
            "bg-transparent border border-ocean text-ocean hover:bg-ocean hover:text-ivory rounded-btn px-8 py-3.5 text-base active:scale-98",
          // Ghost: Text only, Underline animation
          variant === "ghost" &&
            "bg-transparent text-ocean hover:opacity-80 px-4 py-2 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-ocean after:transition-all after:duration-300 hover:after:w-[80%]",
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
