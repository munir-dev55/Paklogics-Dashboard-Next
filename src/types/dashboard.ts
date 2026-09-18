export type InvoicePeriod = "monthly" | "yearly";

export type DashboardKpis = {
  totalUsers: number;
  blockedUsers: number;
  totalCases: number;
  totalInvoices: number;
};

export type DashboardInvoiceSeriesPoint = {
  label: string;
  receivedAmount: number;
  dueAmount: number;
};

export type DashboardInvoicesOverview = {
  period: InvoicePeriod;
  series: DashboardInvoiceSeriesPoint[];
  receivedAmount: number;
  dueAmount: number;
};

export type AdminDashboard = {
  kpis: DashboardKpis;
  invoicesOverview: DashboardInvoicesOverview;
};
