import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "navy" | "green" | "red" | "blue" | "outline";
}

export function Badge({
  className,
  variant = "navy",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-amber-100 text-amber-900 border border-amber-300 font-medium",
    navy: "bg-navy-900 text-gold-300 font-medium",
    green: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    red: "bg-red-100 text-red-800 border border-red-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
    outline: "border border-slate-300 text-slate-700 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
