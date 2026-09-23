import { STATIC_AUDIT_LOGS, staticDelay } from "@/data/static-data";
import { includesSearch, paginate } from "@/data/static-utils";
import type {
  AuditLogsListParams,
  AuditLogsListResult,
} from "@/types/audit-logs";

function filterLogs(params: Omit<AuditLogsListParams, "page" | "limit">) {
  return STATIC_AUDIT_LOGS.filter((record) =>
    (!params.module || record.module === params.module) &&
    (!params.role || record.actingUserRoleSnapshot === params.role) &&
    (!params.from || record.createdAt >= params.from) &&
    (!params.to || record.createdAt <= params.to) &&
    includesSearch([
      record.id, record.action, record.affectedRecordType,
      record.affectedRecordId, record.actor?.email,
      record.actor?.firstName, record.actor?.lastName,
    ], params.search),
  );
}

function csvCell(value: unknown) {
  const text = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(records: typeof STATIC_AUDIT_LOGS) {
  const headings = ["Timestamp", "Action", "Module", "Role", "Actor", "Record type", "Record ID", "Reason"];
  const rows = records.map((record) => [
    record.createdAt, record.action, record.module, record.actingUserRoleSnapshot,
    record.actor?.email, record.affectedRecordType, record.affectedRecordId, record.reason,
  ].map(csvCell).join(","));
  const blob = new Blob([[headings.map(csvCell).join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const auditLogsService = {
  list(params: AuditLogsListParams) {
    const filtered = filterLogs(params);
    const page = paginate(filtered, params.page, params.limit);
    return staticDelay<AuditLogsListResult>({
      auditLogs: page.records, pagination: page.pagination,
      summary: { totalEvents: filtered.length },
    });
  },

  getById(id: string) {
    const record = STATIC_AUDIT_LOGS.find((item) => item.id === id);
    return record ? staticDelay(record) : Promise.reject(new Error("Audit event not found."));
  },

  exportCsv(params: Omit<AuditLogsListParams, "page" | "limit">) {
    downloadCsv(filterLogs(params));
    return staticDelay(undefined);
  },
};
