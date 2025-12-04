import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

import { Metadata } from "next";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { UserProvider } from "@/contexts/UserContext";

export const metadata: Metadata = {
  title: "Inventrix",
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        <UserProvider>
          <SidebarProvider>
            <CategoryProvider>{children}</CategoryProvider>
          </SidebarProvider>
        </UserProvider>
        <Toaster position="top-right" richColors closeButton duration={5000} />
      </body>
    </html>
  );
}
