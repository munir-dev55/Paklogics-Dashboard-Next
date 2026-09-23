import { STATIC_INVOICES, staticDelay } from "@/data/static-data";
import { includesSearch, paginate } from "@/data/static-utils";
import type { InvoicesListParams, InvoicesListResult } from "@/types/invoices";

export const invoicesService = {
  list(params: InvoicesListParams) {
    const all = STATIC_INVOICES.map((record) => {
      const status = record.paymentStatus === "PAID"
        ? "PAID" as const
        : record.paymentStatus === "OVERDUE" ? "OVERDUE" as const : "OUTSTANDING" as const;
      return {
        id: record.id, invoiceNumber: record.invoiceNumber,
        caseId: record.case?.id ?? null, caseNumber: record.case?.caseNumber ?? null,
        caseTitle: record.case?.title ?? null,
        billedTo: record.payerCaseParty?.organizationName ?? null,
        status, invoiceStatus: record.invoiceStatus, paymentStatus: record.paymentStatus,
        dueDate: record.dueDate, amount: Number(record.amountDue), createdAt: record.createdAt,
      };
    });
    const filtered = all.filter((record) =>
      (!params.status || record.status === params.status) &&
      includesSearch([record.invoiceNumber, record.caseNumber, record.caseTitle, record.billedTo], params.search),
    );
    const page = paginate(filtered, params.page, params.limit);
    const totalBilled = all.reduce((sum, record) => sum + record.amount, 0);
    const paid = all.filter((record) => record.status === "PAID")
      .reduce((sum, record) => sum + record.amount, 0);
    return staticDelay<InvoicesListResult>({
      invoices: page.records, pagination: page.pagination,
      summary: { totalBilled, paid, unpaidBalance: totalBilled - paid },
    });
  },

  getById(id: string) {
    const record = STATIC_INVOICES.find((item) => item.id === id);
    return record ? staticDelay(record) : Promise.reject(new Error("Invoice not found."));
  },
};
