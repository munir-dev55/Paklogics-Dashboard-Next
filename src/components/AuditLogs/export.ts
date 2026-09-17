import { dateTimeLabel } from "@/components/shared/formatters";
import type { AuditLog } from "./data";

const columns = [
  "Log ID",
  "Timestamp",
  "Actor",
  "Email",
  "Action",
  "Module",
  "Resource",
  "Status",
  "IP address",
  "Details",
] as const;

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rows(logs: readonly AuditLog[]) {
  return logs.map((log) => [
    log.id,
    dateTimeLabel(log.timestamp),
    log.actor,
    log.actorEmail,
    log.action,
    log.module,
    log.resource,
    log.status,
    log.ipAddress,
    log.details,
  ]);
}

function download(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportAuditLogsCsv(logs: readonly AuditLog[]) {
  const csv = [columns, ...rows(logs)]
    .map((line) => line.map(escapeCsv).join(","))
    .join("\n");

  download(
    `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`,
    `\uFEFF${csv}`,
    "text/csv;charset=utf-8",
  );
}

export function exportAuditLogsExcel(logs: readonly AuditLog[]) {
  const table = `
    <table>
      <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows(logs)
          .map(
            (line) =>
              `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>
  `;

  download(
    `audit-logs-${new Date().toISOString().slice(0, 10)}.xls`,
    `<html xmlns:o="urn:schemas-microsoft-com:office:office"><body>${table}</body></html>`,
    "application/vnd.ms-excel",
  );
}
