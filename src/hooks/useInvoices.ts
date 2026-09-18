"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { invoicesService } from "@/services/invoices.service";
import type {
  AdminInvoice,
  InvoiceDetails,
  InvoicesListParams,
  InvoicesListResult,
} from "@/types/invoices";

export function useInvoices(params: InvoicesListParams) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: () => invoicesService.list(params),
    placeholderData: keepPreviousData,
  });
}

function detailsFromListInvoice(record: AdminInvoice): InvoiceDetails {
  return {
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    invoiceType: null,
    invoiceStatus: record.invoiceStatus,
    paymentStatus: record.paymentStatus,
    amountDue: record.amount,
    subtotal: record.amount,
    dueDate: record.dueDate,
    invoiceDate: record.createdAt,
    specialInstructions: null,
    createdAt: record.createdAt,
    updatedAt: record.createdAt,
    case:
      record.caseId && record.caseNumber
        ? {
            id: record.caseId,
            caseNumber: record.caseNumber,
            title: record.caseTitle ?? "",
          }
        : null,
    payerCaseParty: record.billedTo
      ? {
          id: "",
          organizationName: record.billedTo,
          firstName: null,
          lastName: null,
          email: null,
        }
      : null,
  };
}

export function useInvoice(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoicesService.getById(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: () => {
      const lists = queryClient.getQueriesData<InvoicesListResult>({
        queryKey: ["invoices", "list"],
      });

      for (const [, data] of lists) {
        const match = data?.invoices.find((record) => record.id === id);
        if (match) {
          return detailsFromListInvoice(match);
        }
      }

      return undefined;
    },
  });
}
