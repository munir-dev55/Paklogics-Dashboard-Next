"use client";

import DataTable, {
  RecordIdentity,
  type TableColumn,
} from "@/components/shared/DataTable";
import RecordFilters from "@/components/shared/RecordFilters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import SummaryCards from "@/components/shared/SummaryCards";
import useRecordFilters from "@/components/shared/useRecordFilters";
import { money, dateLabel } from "@/components/shared/formatters";
import { invoices, statuses, type InvoiceRecord } from "./data";

const tones: Record<InvoiceRecord["status"], StatusTone> = {
  Outstanding: "primary",
  Paid: "success",
  Overdue: "error",
};
const columns: TableColumn<InvoiceRecord>[] = [
  {
    key: "invoice",
    header: "Invoice / Case",
    render: (record) => (
      <RecordIdentity
        id={record.id}
        name={record.name}
        secondary={record.caseId}
      />
    ),
  },
  { key: "owner", header: "Billed to", render: (record) => record.owner },
  {
    key: "status",
    header: "Status",
    render: (record) => (
      <StatusBadge label={record.status} tone={tones[record.status]} />
    ),
  },
  {
    key: "date",
    header: "Due date",
    render: (record) => dateLabel(record.date),
    className: "whitespace-nowrap",
  },
  {
    key: "amount",
    header: "Amount",
    render: (record) => money(record.amount),
    className: "font-medium text-dark dark:text-white",
  },
];
const stats = [
  {
    label: "Total billed",
    value: money(invoices.reduce((sum, record) => sum + record.amount, 0)),
  },
  {
    label: "Paid",
    value: money(
      invoices
        .filter((record) => record.status === "Paid")
        .reduce((sum, record) => sum + record.amount, 0),
    ),
  },
  {
    label: "Unpaid balance",
    value: money(
      invoices
        .filter((record) => record.status !== "Paid")
        .reduce((sum, record) => sum + record.amount, 0),
    ),
  },
];

export default function BillingInvoices() {
  const filters = useRecordFilters(invoices, (record) => [
    record.id,
    record.caseId,
    record.name,
    record.owner,
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p>View billing and invoice information.</p>
        </div>
      </div>
      <SummaryCards items={stats} />
      <DataTable
        label="Invoices"
        caption="Sample billing and invoice information"
        records={filters.filtered}
        columns={columns}
        total={invoices.length}
        pageSize={3}
        detailsBasePath="/billing-invoices"
        toolbar={
          <RecordFilters
            label="Search invoices"
            placeholder="Invoice, case, or billed to…"
            statuses={statuses}
            {...filters}
          />
        }
      />
    </div>
  );
}
