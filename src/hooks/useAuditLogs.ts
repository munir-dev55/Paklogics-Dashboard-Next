"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { auditLogsService } from "@/services/audit-logs.service";
import type { AuditLogsListParams } from "@/types/audit-logs";

export function useAuditLogs(params: AuditLogsListParams) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: () => auditLogsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: queryKeys.auditLogs.detail(id),
    queryFn: () => auditLogsService.getById(id),
    enabled: Boolean(id),
    staleTime: 0,
  });
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: (params: Omit<AuditLogsListParams, "page" | "limit">) =>
      auditLogsService.exportCsv(params),
  });
}
