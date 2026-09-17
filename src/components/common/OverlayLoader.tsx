"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
    />
  );
}

function Overlay({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/20 backdrop-blur-md dark:bg-black/40">
      <Spinner />
    </div>,
    document.body,
  );
}

export function OverlayLoaderProvider({ children }: { children: ReactNode }) {
  const fetching = useIsFetching({
    predicate: (query) => {
      if (query.state.fetchStatus !== "fetching") return false;

      const isListWithData =
        Array.isArray(query.queryKey) &&
        query.queryKey[1] === "list" &&
        query.state.data !== undefined;

      if (isListWithData) {
        return false;
      }

      return true;
    },
  });

  const mutating = useIsMutating();

  return (
    <>
      {children}
      <Overlay visible={fetching + mutating > 0} />
    </>
  );
}
