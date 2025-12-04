"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  deltaType?: "increase" | "decrease" | "neutral";
  deltaColor?: string; // Custom delta color override
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  iconColor,
  iconBg,
  deltaType = "neutral",
  deltaColor,
}: StatCardProps) {
  const hasDelta = delta !== undefined;

  const deltaColorClass = deltaColor || {
    increase: "text-green-600 bg-green-50",
    decrease: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  }[deltaType];

  return (
    <div className="rounded-2xl bg-white pb-2 pt-4 px-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={2} />
        </div>

        {hasDelta && (
          <div
            className={`px-2 py-1 rounded-md text-xs font-semibold ${deltaColorClass}`}
          >
            {delta}
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
