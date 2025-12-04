import React from "react";
// import { IconType } from "react-icons";
// import { LucideIcon } from "lucide-react";

import { IconCardProps } from "./types";

export type { IconCardProps };

const IconCard: React.FC<IconCardProps> = ({
  icon: Icon,
  title,
  description,
  isBenefit = false,
}) => {
  return (
    <div
      className={`rounded-xl p-5 sm:p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full
        ${isBenefit
          ? "bg-[#FFF5F7] border border-[#F7D9DD]"
          : "bg-white border border-gray-200"
        }
      `}
    >
      <div
        className={`inline-flex p-3 rounded-lg mb-3 sm:mb-4 
          ${isBenefit ? "bg-[#800020]" : "bg-[#F7D9DD]"}
        `}
      >
        <Icon
          size={22}
          strokeWidth={2}
          className={isBenefit ? "text-white" : "text-[#800020]"}
        />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default IconCard;