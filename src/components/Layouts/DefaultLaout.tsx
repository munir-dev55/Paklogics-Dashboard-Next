"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { isAuthPath } from "@/lib/auth-session";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = isAuthPath(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAuthPage) {
    return (
      <main>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="w-full px-4 py-4 md:px-5 md:py-6 2xl:px-10 2xl:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
