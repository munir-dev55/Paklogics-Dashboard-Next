import { apiClient } from "@/lib/api-client";
import { withQuery } from "@/lib/query-string";
import type {
  InvoiceDetails,
  InvoicesListParams,
  InvoicesListResult,
} from "@/types/invoices";

export const invoicesService = {
  list(params: InvoicesListParams) {
    return apiClient<InvoicesListResult>(withQuery("/admin/invoices", params));
  },

  getById(id: string) {
    return apiClient<InvoiceDetails>(`/billing/invoices/${id}`);
  },
};
