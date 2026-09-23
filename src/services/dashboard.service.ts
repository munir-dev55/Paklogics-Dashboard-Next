import { STATIC_DASHBOARDS, staticDelay } from "@/data/static-data";
import type { InvoicePeriod } from "@/types/dashboard";

export const dashboardService = {
  get(invoicePeriod: InvoicePeriod = "monthly") {
    return staticDelay(STATIC_DASHBOARDS[invoicePeriod]);
  },
};
