"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable, {
  RecordIdentity,
  type TableColumn,
} from "@/components/shared/DataTable";
import FilterSelect, { ClearFiltersIcon } from "@/components/shared/FilterSelect";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import SummaryCards from "@/components/shared/SummaryCards";
import { dateLabel, money } from "@/components/shared/formatters";
import { getErrorMessage } from "@/lib/api-error";
import { useInvoices } from "@/hooks/useInvoices";
import {
  INVOICE_FILTER_OPTIONS,
  invoiceStatusLabel,
  type InvoiceUiStatus,
} from "@/types/enums";
import type { AdminInvoice } from "@/types/invoices";

const PAGE_SIZE = 10;

const tones: Record<InvoiceUiStatus, StatusTone> = {
  OUTSTANDING: "primary",
  PAID: "success",
  OVERDUE: "error",
};

const columns: TableColumn<AdminInvoice>[] = [
  {
    key: "invoice",
    header: "Invoice / Case",
    render: (record) => (
      <RecordIdentity
        id={record.invoiceNumber}
        name={record.caseTitle || "—"}
        secondary={record.caseNumber || undefined}
      />
    ),
  },
  {
    key: "owner",
    header: "Billed to",
    render: (record) => record.billedTo || "—",
  },
  {
    key: "status",
    header: "Status",
    render: (record) => (
      <StatusBadge
        label={invoiceStatusLabel(record.status)}
        tone={tones[record.status]}
      />
    ),
  },
  {
    key: "date",
    header: "Due date",
    render: (record) => (record.dueDate ? dateLabel(record.dueDate) : "—"),
    className: "whitespace-nowrap",
  },
  {
    key: "amount",
    header: "Amount",
    render: (record) => money(record.amount),
    className: "font-medium text-dark dark:text-white",
  },
];

export default function BillingInvoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceUiStatus | "">("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 900);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const listParams = useMemo(
    () => ({
      page: currentPage,
      limit: PAGE_SIZE,
      search,
      status: statusFilter,
    }),
    [currentPage, search, statusFilter],
  );

  const { data, isError, error } = useInvoices(listParams);
  const invoices = data?.invoices ?? [];
  const summary = data?.summary;
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <p>View billing and invoice information.</p>
      <SummaryCards
        items={[
          { label: "Total billed", value: money(summary?.totalBilled ?? 0) },
          { label: "Paid", value: money(summary?.paid ?? 0) },
          { label: "Unpaid balance", value: money(summary?.unpaidBalance ?? 0) },
        ]}
      />
      {isError && (
        <p className="rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
          {getErrorMessage(error, "Unable to load invoices.")}
        </p>
      )}
      <DataTable
        label="Invoices"
        caption="Platform invoices"
        records={invoices}
        columns={columns}
        total={pagination?.total ?? 0}
        currentPage={pagination?.page ?? currentPage}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        getDetailsHref={(record) => `/billing-invoices/details?id=${record.id}`}
        toolbar={
          <div className="grid gap-4 border-b border-stroke p-5 dark:border-stroke-dark sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              Search invoices
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Invoice, case, or billed to…"
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <FilterSelect
              label="Status"
              value={statusFilter}
              placeholder="Any status"
              options={INVOICE_FILTER_OPTIONS}
              onChange={(value) =>
                setStatusFilter(value as InvoiceUiStatus | "")
              }
            />
            <button
              type="button"
              title="Clear filters"
              aria-label="Clear filters"
              disabled={!searchInput && !statusFilter}
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setStatusFilter("");
              }}
              className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-stroke text-dark-5 transition hover:bg-error-light hover:text-error disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-3 dark:text-white"
            >
              <ClearFiltersIcon />
            </button>
          </div>
        }
      />
    </div>
  );
}
