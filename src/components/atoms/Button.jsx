import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-red-600 text-white hover:from-red-600 hover:to-primary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25",
    secondary: "bg-surface text-white border border-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02]",
    accent: "bg-gradient-to-r from-accent to-cyan-400 text-black hover:from-cyan-400 hover:to-accent hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25",
    ghost: "text-gray-300 hover:text-white hover:bg-surface/50",
    danger: "bg-gradient-to-r from-error to-red-500 text-white hover:from-red-500 hover:to-error hover:scale-[1.02] hover:shadow-lg hover:shadow-error/25"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "hover:scale-100 hover:shadow-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;