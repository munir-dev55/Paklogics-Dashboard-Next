"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthPath, isAuthenticated } from "@/lib/auth-session";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const signedIn = isAuthenticated();
    const authPage = isAuthPath(pathname);

    if (!signedIn && !authPage) {
      setAllowed(false);
      router.replace("/auth/signin");
      return;
    }

    if (signedIn && authPage) {
      setAllowed(false);
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
