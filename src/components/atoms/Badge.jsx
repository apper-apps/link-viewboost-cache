import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-gray-300 border-gray-600",
    success: "bg-success/10 text-success border-success/30 shadow-success/20",
    error: "bg-error/10 text-error border-error/30 shadow-error/20",
    warning: "bg-warning/10 text-warning border-warning/30 shadow-warning/20",
    info: "bg-info/10 text-info border-info/30 shadow-info/20",
    active: "bg-accent/10 text-accent border-accent/30 shadow-accent/20"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-full shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;