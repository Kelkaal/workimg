"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { CategoryProvider } from "@/contexts/CategoryContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CategoryProvider>
        {children}
      </CategoryProvider>
    </SidebarProvider>
  );
}
