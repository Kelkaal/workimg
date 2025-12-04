"use client";
import React from "react";
import { PRIMARY_COLOR } from "@/lib/constants";

import { ButtonProps } from "../types";

export type { ButtonProps };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    let styles = `px-5 py-2.5 sm:px-6 sm:py-3 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base`;

    if (variant === "primary") {
      styles += ` bg-[${PRIMARY_COLOR}] text-white hover:bg-opacity-90`;
    } else if (variant === "secondary") {
      styles += ` bg-white text-[${PRIMARY_COLOR}] border border-[${PRIMARY_COLOR}] hover:bg-gray-50`;
    } 
    return (
      <button ref={ref} className={`${styles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;