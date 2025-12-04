"use client";
import React from "react";
import { PRIMARY_COLOR } from "@/lib/constants";

import { InputProps } from "../types";

export type { InputProps };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-lg 
        border border-gray-300 
        bg-background px-4 py-2 text-sm 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-[${PRIMARY_COLOR}] 
        focus-visible:ring-offset-0 
        focus-visible:border-transparent 
        placeholder:text-muted-foreground 
        disabled:cursor-not-allowed disabled:opacity-50 
        shadow-sm 
        ${className}
      `}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";
export default Input;