'use client';

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const waitlistPages = ['/waitlist/success', '/waitlist/error'];
  const dashboardPaths = ['/dashboard', '/settings', '/report', '/products', '/categories'];

  const isWaitlistPage = waitlistPages.includes(path);
  const isDashboardPage = dashboardPaths.includes(path);

  if (isDashboardPage) return <DashboardLayout>{children}</DashboardLayout>;
  if (isWaitlistPage) return children;
  return { children };
}