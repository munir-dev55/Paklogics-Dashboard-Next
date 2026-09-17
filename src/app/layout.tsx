"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import QueryProvider from "@/lib/query-provider";
import { OverlayLoaderProvider } from "@/components/common/OverlayLoader";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <OverlayLoaderProvider>
            <AuthGuard>{children}</AuthGuard>
            <Toaster richColors position="top-right" />
          </OverlayLoaderProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
