import type { StockStatus } from '@/types/product';

interface StatusBadgeProps {
  status: StockStatus;
}

const statusStyles: Record<StockStatus, { bg: string; text: string }> = {
  'In Stock': { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  'Low Stock': { bg: 'bg-[#FEF3C7]', text: 'text-[#991B1B]' },
  'Out of Stock': { bg: 'bg-[#F3F4F6]', text: 'text-[#1F2937]' },
  'Medium': { bg: 'bg-[#FEF3C7]', text: 'text-[#854D0E]' }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = statusStyles[status];
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold leading-4 ${bg} ${text}`}>
      {status}
    </span>
  );
}