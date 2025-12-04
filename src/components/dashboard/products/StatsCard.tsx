import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  titleColor?: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor, iconBgColor, titleColor }: StatsCardProps) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg hover:scale-101 transition-all duration-300 ease-in-out border border-gray-200 hover:border-gray-300 rounded-lg p-4 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className={`text-sm mb-6 leading-5 truncate ${titleColor || 'text-[#6B7280]'}`}>{title}</p>
        <p className="text-2xl font-bold text-[#111827] leading-8 truncate">{value}</p>
      </div>
      <div className={`flex-shrink-0 rounded-lg p-2 ${iconBgColor}`}>
        <Icon className={`w-5 h-5  ${iconColor}`} strokeWidth={2} />
      </div>
    </div>
  );
}