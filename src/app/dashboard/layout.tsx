import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { RoleProvider } from "@/contexts/RoleContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleProvider>
  );
}
