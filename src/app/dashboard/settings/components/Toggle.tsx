import React from "react";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({
  enabled,
  onToggle,
  label,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#900022] focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${enabled ? "bg-[#900022]" : "bg-gray-300"}`}
      aria-label={label}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
