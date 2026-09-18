"use client";

import Link from "next/link";
import Card from "@/components/shared/Card";
import { dateLabel, money } from "@/components/shared/formatters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import { getErrorMessage } from "@/lib/api-error";
import { useInvoice } from "@/hooks/useInvoices";
import {
  invoiceStatusLabel,
  type InvoiceUiStatus,
} from "@/types/enums";

const tones: Record<InvoiceUiStatus, StatusTone> = {
  OUTSTANDING: "primary",
  PAID: "success",
  OVERDUE: "error",
};

function resolveUiStatus(
  paymentStatus: string,
  dueDate: string | null,
): InvoiceUiStatus {
  if (paymentStatus === "PAID") return "PAID";
  if (dueDate && new Date(dueDate).getTime() < Date.now()) return "OVERDUE";
  return "OUTSTANDING";
}

function billedToLabel(
  payer: {
    organizationName: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null,
) {
  if (!payer) return "—";
  if (payer.organizationName) return payer.organizationName;
  const name = `${payer.firstName ?? ""} ${payer.lastName ?? ""}`.trim();
  return name || "—";
}

function amountValue(value: number | string | null | undefined) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return money(Number.isFinite(numeric) ? (numeric as number) : 0);
}

export default function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
  const { data: record, isLoading, isError, error } = useInvoice(invoiceId);

  if (isLoading) {
    return <Card className="min-h-[240px] p-6" />;
  }

  if (isError || !record) {
    return (
      <Card className="p-6">
        <p className="text-error">
          {getErrorMessage(error, "Invoice not found.")}
        </p>
        <Link
          href="/billing-invoices"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to invoices
        </Link>
      </Card>
    );
  }

  const status = resolveUiStatus(record.paymentStatus, record.dueDate);

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-dark-5">Invoice ID</p>
          <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
            {record.invoiceNumber}
          </h2>
        </div>
        <StatusBadge label={invoiceStatusLabel(status)} tone={tones[status]} />
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        <Detail label="Case" value={record.case?.title || "—"} />
        <Detail label="Case ID" value={record.case?.caseNumber || "—"} />
        <Detail label="Billed to" value={billedToLabel(record.payerCaseParty)} />
        <Detail label="Status" value={invoiceStatusLabel(status)} />
        <Detail
          label="Due date"
          value={record.dueDate ? dateLabel(record.dueDate) : "—"}
        />
        <Detail label="Amount (USD)" value={amountValue(record.amountDue)} />
        <Detail label="Invoice status" value={record.invoiceStatus || "—"} />
        <Detail label="Payment status" value={record.paymentStatus || "—"} />
      </dl>
      <Link
        href="/billing-invoices"
        className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to invoices
      </Link>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-dark-5">{label}</dt>
      <dd className="mt-1 font-medium text-dark dark:text-white">{value}</dd>
    </div>
  );
}
