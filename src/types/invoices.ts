import type { Pagination } from "@/types/api";
import type { InvoiceUiStatus } from "@/types/enums";

export type InvoicesListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceUiStatus | "";
};

export type AdminInvoice = {
  id: string;
  invoiceNumber: string;
  caseId: string | null;
  caseNumber: string | null;
  caseTitle: string | null;
  billedTo: string | null;
  status: InvoiceUiStatus;
  invoiceStatus: string;
  paymentStatus: string;
  dueDate: string | null;
  amount: number;
  createdAt: string;
};

export type InvoicesListResult = {
  invoices: AdminInvoice[];
  pagination: Pagination;
  summary: {
    totalBilled: number;
    paid: number;
    unpaidBalance: number;
  };
};

export type InvoiceDetails = {
  id: string;
  invoiceNumber: string;
  invoiceType: string | null;
  invoiceStatus: string;
  paymentStatus: string;
  amountDue: number | string;
  subtotal: number | string | null;
  dueDate: string | null;
  invoiceDate: string | null;
  specialInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  case: {
    id: string;
    caseNumber: string;
    title: string;
  } | null;
  payerCaseParty: {
    id: string;
    organizationName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
};
