"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { dashboardService } from "@/services/dashboard.service";
import type { InvoicePeriod } from "@/types/dashboard";

export function useDashboard(invoicePeriod: InvoicePeriod = "monthly") {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(invoicePeriod),
    queryFn: () => dashboardService.get(invoicePeriod),
    placeholderData: keepPreviousData,
  });
}
