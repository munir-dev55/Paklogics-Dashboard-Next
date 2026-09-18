import type { UsersListParams } from "@/types/users";
import type { CasesListParams } from "@/types/cases";
import type { InvoicesListParams } from "@/types/invoices";
import type { AuditLogsListParams } from "@/types/audit-logs";
import type { InvoicePeriod } from "@/types/dashboard";

export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (params: UsersListParams) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  cases: {
    all: ["cases"] as const,
    list: (params: CasesListParams) => ["cases", "list", params] as const,
    detail: (id: string) => ["cases", "detail", id] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (params: InvoicesListParams) => ["invoices", "list", params] as const,
    detail: (id: string) => ["invoices", "detail", id] as const,
  },
  auditLogs: {
    all: ["auditLogs"] as const,
    list: (params: AuditLogsListParams) =>
      ["auditLogs", "list", params] as const,
    detail: (id: string) => ["auditLogs", "detail", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: (invoicePeriod: InvoicePeriod) =>
      ["dashboard", "overview", invoicePeriod] as const,
  },
};
