import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "yellow";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  accent: "bg-accent text-accent-foreground hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  yellow: "bg-pixel-yellow text-foreground hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-[8px]",
  md: "px-5 py-2.5 text-[10px]",
  lg: "px-7 py-3.5 text-xs",
};

const PixelButton = ({ variant = "primary", size = "md", className, children, ...props }: PixelButtonProps) => (
  <button
    className={cn(
      "font-pixel pixel-border cursor-pointer transition-all duration-100 uppercase tracking-wider",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default PixelButton;
