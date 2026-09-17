"use client";

import { useMemo, useState } from "react";
import DataTable, {
  RecordIdentity,
  type TableColumn,
} from "@/components/shared/DataTable";
import FilterSelect, { ClearFiltersIcon } from "@/components/shared/FilterSelect";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import SummaryCards from "@/components/shared/SummaryCards";
import { dateTimeLabel } from "@/components/shared/formatters";
import { toast } from "sonner";
import {
  AUDIT_MODULES,
  AUDIT_STATUSES,
  auditLogs,
  type AuditLog,
  type AuditModule,
  type AuditStatus,
} from "./data";
import { exportAuditLogsCsv, exportAuditLogsExcel } from "./export";

const PAGE_SIZE = 10;

const tones: Record<AuditStatus, StatusTone> = {
  Success: "success",
  Failed: "error",
  Warning: "warning",
};

const columns: TableColumn<AuditLog>[] = [
  {
    key: "event",
    header: "Event",
    render: (record) => (
      <RecordIdentity id={record.id} name={record.action} secondary={record.resource} />
    ),
  },
  {
    key: "actor",
    header: "Actor",
    render: (record) => (
      <>
        <p className="font-medium text-dark dark:text-white">{record.actor}</p>
        <p className="mt-1 text-xs">{record.actorEmail}</p>
      </>
    ),
  },
  {
    key: "module",
    header: "Module",
    render: (record) => record.module,
  },
  {
    key: "status",
    header: "Status",
    render: (record) => (
      <StatusBadge label={record.status} tone={tones[record.status]} />
    ),
  },
  {
    key: "timestamp",
    header: "Timestamp",
    render: (record) => dateTimeLabel(record.timestamp),
    className: "whitespace-nowrap",
  },
];

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "">("");
  const [moduleFilter, setModuleFilter] = useState<AuditModule | "">("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesStatus = !statusFilter || log.status === statusFilter;
      const matchesModule = !moduleFilter || log.module === moduleFilter;
      const matchesSearch =
        !query ||
        [log.id, log.actor, log.actorEmail, log.action, log.resource, log.module, log.ipAddress]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesModule && matchesSearch;
    });
  }, [moduleFilter, search, statusFilter]);

  const summary = {
    total: filtered.length,
    success: filtered.filter((log) => log.status === "Success").length,
    failed: filtered.filter((log) => log.status === "Failed").length,
  };

  const exportRows = () => {
    if (!filtered.length) {
      toast.error("No audit logs match the current filters.");
      return null;
    }

    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p>Review admin activity, status outcomes, and download filtered logs.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const rows = exportRows();
              if (!rows) return;
              exportAuditLogsCsv(rows);
              toast.success("CSV export downloaded.");
            }}
            className="rounded-lg border border-stroke px-4 py-2.5 text-sm font-semibold text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              const rows = exportRows();
              if (!rows) return;
              exportAuditLogsExcel(rows);
              toast.success("Excel export downloaded.");
            }}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Export Excel
          </button>
        </div>
      </div>
      <SummaryCards
        items={[
          { label: "Events", value: summary.total },
          { label: "Successful", value: summary.success },
          { label: "Failed", value: summary.failed },
        ]}
      />
      <DataTable
        label="Audit logs"
        caption="Admin activity logs"
        records={filtered}
        columns={columns}
        total={filtered.length}
        pageSize={PAGE_SIZE}
        getDetailsHref={(record) => `/audit-logs/details?id=${record.id}`}
        toolbar={
          <div className="grid gap-4 border-b border-stroke p-5 dark:border-stroke-dark sm:grid-cols-[1fr_180px_200px_auto] sm:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-dark dark:text-white">
              Search logs
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Log ID, actor, action, or resource…"
                className="rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
            </label>
            <FilterSelect
              label="Status"
              value={statusFilter}
              placeholder="Any status"
              options={AUDIT_STATUSES.map((value) => ({ value, label: value }))}
              onChange={(value) => setStatusFilter(value as AuditStatus | "")}
            />
            <FilterSelect
              label="Module"
              value={moduleFilter}
              placeholder="Any module"
              options={AUDIT_MODULES.map((value) => ({ value, label: value }))}
              onChange={(value) => setModuleFilter(value as AuditModule | "")}
            />
            <button
              type="button"
              title="Clear filters"
              aria-label="Clear filters"
              disabled={!search && !statusFilter && !moduleFilter}
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setModuleFilter("");
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
