import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 transition-all duration-200",
        "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-gray-800",
        "hover:border-gray-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;