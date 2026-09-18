"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable, { type TableColumn } from "@/components/shared/DataTable";
import FilterSelect, { ClearFiltersIcon } from "@/components/shared/FilterSelect";
import SummaryCards from "@/components/shared/SummaryCards";
import { dateTimeLabel } from "@/components/shared/formatters";
import { getErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import {
  useAuditLog,
  useAuditLogs,
  useExportAuditLogs,
} from "@/hooks/useAuditLogs";
import {
  PERMISSION_MODULE_FILTER_OPTIONS,
  ROLE_FILTER_OPTIONS,
  humanizeAction,
  permissionModuleLabel,
  roleLabel,
  shortId,
  type PermissionModule,
  type RoleName,
} from "@/types/enums";
import type { AdminAuditLogListItem } from "@/types/audit-logs";
import AuditLogDetailsModal from "./AuditLogDetailsModal";

const PAGE_SIZE = 10;

function actorName(record: AdminAuditLogListItem) {
  if (!record.actor) return null;
  const name =
    `${record.actor.firstName ?? ""} ${record.actor.lastName ?? ""}`.trim();
  return name || null;
}

function actorRoleLabel(record: AdminAuditLogListItem) {
  return record.actingUserRoleSnapshot
    ? roleLabel(record.actingUserRoleSnapshot)
    : "Unknown";
}

const columns: TableColumn<AdminAuditLogListItem>[] = [
  {
    key: "event",
    header: "Event",
    render: (record) => (
      <>
        <p className="font-semibold text-primary dark:text-white">
          {humanizeAction(record.action)}
        </p>
        <p className="mt-1 text-dark dark:text-white">
          {record.affectedRecordType} · {shortId(record.affectedRecordId)}
        </p>
        {/* <p className="mt-1 text-xs text-dark-5">{shortId(record.id)}</p> */}
      </>
    ),
  },
  {
    key: "actor",
    header: "Actor",
    render: (record) => (
      <>
        <p className="font-medium text-dark dark:text-white">
          {actorRoleLabel(record)}
        </p>
        <p className="mt-1 text-xs">
          {record.actor?.email || actorName(record) || "—"}
        </p>
        {/* {record.actor?.email && actorName(record) && (
          <p className="mt-0.5 text-xs text-dark-5">{actorName(record)}</p>
        )} */}
      </>
    ),
  },
  {
    key: "module",
    header: "Module",
    render: (record) => permissionModuleLabel(record.module),
  },
  {
    key: "timestamp",
    header: "Timestamp",
    render: (record) => dateTimeLabel(record.createdAt),
    className: "whitespace-nowrap",
  },
];

export default function AuditLogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<PermissionModule | "">("");
  const [roleFilter, setRoleFilter] = useState<RoleName | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 900);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, moduleFilter, roleFilter, fromDate, toDate]);

  const filterParams = useMemo(
    () => ({
      search,
      module: moduleFilter,
      role: roleFilter,
      from: fromDate ? `${fromDate}T00:00:00.000Z` : "",
      to: toDate ? `${toDate}T23:59:59.999Z` : "",
    }),
    [fromDate, moduleFilter, roleFilter, search, toDate],
  );

  const listParams = useMemo(
    () => ({
      page: currentPage,
      limit: PAGE_SIZE,
      ...filterParams,
    }),
    [currentPage, filterParams],
  );

  const { data, isError, error } = useAuditLogs(listParams);
  const {
    data: selected,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useAuditLog(selectedId ?? "");
  const { mutate: exportCsv, isPending: isExporting } = useExportAuditLogs();

  const auditLogs = data?.auditLogs ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary;

  const hasFilters = Boolean(
    searchInput || moduleFilter || roleFilter || fromDate || toDate,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p>
          Review recorded admin and case activity. Export filtered results as
          CSV.
        </p>
        <button
          type="button"
          disabled={isExporting}
          onClick={() => {
            exportCsv(filterParams, {
              onSuccess: () => toast.success("CSV export downloaded."),
              onError: (err) =>
                toast.error(getErrorMessage(err, "Unable to export audit logs.")),
            });
          }}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isExporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      <SummaryCards
        items={[{ label: "Events", value: summary?.totalEvents ?? 0 }]}
      />

      {isError && (
        <p className="rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
          {getErrorMessage(error, "Unable to load audit logs.")}
        </p>
      )}

      <DataTable
        label="Audit logs"
        caption="Admin activity mutation trail"
        records={auditLogs}
        columns={columns}
        total={pagination?.total ?? 0}
        currentPage={pagination?.page ?? currentPage}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        emptyMessage="No audit events match these filters."
        onDetailsClick={(record) => setSelectedId(record.id)}
        toolbar={
          <div className="grid gap-4 border-b border-stroke p-5 dark:border-stroke-dark lg:grid-cols-[1fr_180px_200px_150px_150px_auto] lg:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              Search
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="ID, actor, action, or record…"
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <FilterSelect
              label="Module"
              value={moduleFilter}
              placeholder="Any module"
              options={PERMISSION_MODULE_FILTER_OPTIONS}
              onChange={(value) =>
                setModuleFilter(value as PermissionModule | "")
              }
            />
            <FilterSelect
              label="Actor role"
              value={roleFilter}
              placeholder="Any role"
              options={ROLE_FILTER_OPTIONS}
              onChange={(value) => setRoleFilter(value as RoleName | "")}
            />
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              To
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <div className="flex justify-end lg:block">
              <button
                type="button"
                title="Clear filters"
                aria-label="Clear filters"
                disabled={!hasFilters}
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setModuleFilter("");
                  setRoleFilter("");
                  setFromDate("");
                  setToDate("");
                }}
                className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-stroke text-dark-5 transition hover:bg-error-light hover:text-error disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-3 dark:text-white"
              >
                <ClearFiltersIcon />
              </button>
            </div>
          </div>
        }
      />

      {selectedId && (
        <AuditLogDetailsModal
          record={selected}
          isLoading={isDetailLoading}
          isError={isDetailError}
          errorMessage={getErrorMessage(detailError, "Audit log not found.")}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
