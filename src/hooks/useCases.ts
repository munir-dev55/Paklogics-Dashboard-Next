"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { casesService } from "@/services/cases.service";
import type { AdminCase, CaseDetails, CasesListParams, CasesListResult } from "@/types/cases";

export function useCases(params: CasesListParams) {
  return useQuery({
    queryKey: queryKeys.cases.list(params),
    queryFn: () => casesService.list(params),
    placeholderData: keepPreviousData,
  });
}

function detailsFromListCase(record: AdminCase): CaseDetails {
  const [firstName = "", lastName = ""] = (record.caseManager?.name ?? "").split(" ");

  return {
    id: record.id,
    caseNumber: record.caseNumber,
    title: record.title,
    caseType: null,
    lifecycleStatus: record.status,
    closedAt: record.closedAt,
    closureSummary: null,
    jurisdiction: null,
    isInternational: false,
    caseValue: null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    caseManager: record.caseManager
      ? {
          id: record.caseManager.id,
          firstName,
          lastName,
          email: record.caseManager.email,
        }
      : null,
  };
}

export function useCase(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: () => casesService.getById(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: () => {
      const lists = queryClient.getQueriesData<CasesListResult>({
        queryKey: ["cases", "list"],
      });

      for (const [, data] of lists) {
        const match = data?.cases.find((record) => record.id === id);
        if (match) {
          return detailsFromListCase(match);
        }
      }

      return undefined;
    },
  });
}
