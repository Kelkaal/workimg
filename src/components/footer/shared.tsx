import React from "react";

export const PRIMARY_MAROON = "#800020";
export const DARK_BG = "#111827";
export const INPUT_BG = "#1F2937";

export const SocialIcon = ({ children }: { children: React.ReactNode }) => {
  <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-600 transition-colors cursor-pointer">
    {children}
  </div>
};