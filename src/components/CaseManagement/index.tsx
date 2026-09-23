"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable, {
  RecordIdentity,
  type TableColumn,
} from "@/components/shared/DataTable";
import FilterSelect, { ClearFiltersIcon } from "@/components/shared/FilterSelect";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import SummaryCards from "@/components/shared/SummaryCards";
import { dateLabel } from "@/components/shared/formatters";
import { getErrorMessage } from "@/lib/ui-error";
import { useCases } from "@/hooks/useCases";
import {
  CASE_FILTER_OPTIONS,
  caseStatusLabel,
  type AdminCaseStatusFilter,
  type CaseLifecycleStatus,
} from "@/types/enums";
import type { AdminCase } from "@/types/cases";

const PAGE_SIZE = 10;

const tones: Record<CaseLifecycleStatus, StatusTone> = {
  INTAKE: "warning",
  SCHEDULED: "warning",
  ACTIVE: "primary",
  REOPENED: "primary",
  ON_HOLD: "muted",
  CLOSED: "success",
};

const columns: TableColumn<AdminCase>[] = [
  {
    key: "case",
    header: "Case",
    render: (record) => (
      <RecordIdentity id={record.caseNumber} name={record.title} />
    ),
  },
  {
    key: "owner",
    header: "Case manager",
    render: (record) => record.caseManager?.name || "—",
  },
  {
    key: "status",
    header: "Status",
    render: (record) => (
      <StatusBadge
        label={caseStatusLabel(record.status)}
        tone={tones[record.status]}
      />
    ),
  },
  {
    key: "date",
    header: "Review date",
    render: (record) => dateLabel(record.reviewDate),
    className: "whitespace-nowrap",
  },
];

export default function CaseManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminCaseStatusFilter | "">("");

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

  const { data, isError, error } = useCases(listParams);
  const cases = data?.cases ?? [];
  const summary = data?.summary;
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <p>View, manage, and track cases across the platform.</p>
      <SummaryCards
        items={[
          { label: "Total cases", value: summary?.total ?? 0 },
          { label: "Active cases", value: summary?.active ?? 0 },
          { label: "Closed cases", value: summary?.closed ?? 0 },
        ]}
      />
      {isError && (
        <p className="rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
          {getErrorMessage(error, "Unable to load cases.")}
        </p>
      )}
      <DataTable
        label="Cases"
        caption="Platform cases"
        records={cases}
        columns={columns}
        total={pagination?.total ?? 0}
        currentPage={pagination?.page ?? currentPage}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        getDetailsHref={(record) => `/case-management/details?id=${record.id}`}
        toolbar={
          <div className="grid gap-4 border-b border-stroke p-5 dark:border-stroke-dark sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              Search cases
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Case ID, name, or case manager…"
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <FilterSelect
              label="Status"
              value={statusFilter}
              placeholder="Any status"
              options={CASE_FILTER_OPTIONS}
              onChange={(value) =>
                setStatusFilter(value as AdminCaseStatusFilter | "")
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
