import { apiClient } from "@/lib/api-client";
import { withQuery } from "@/lib/query-string";
import type { AdminDashboard, InvoicePeriod } from "@/types/dashboard";

export const dashboardService = {
  get(invoicePeriod: InvoicePeriod = "monthly") {
    return apiClient<AdminDashboard>(
      withQuery("/admin/dashboard", { invoicePeriod }),
    );
  },
};
