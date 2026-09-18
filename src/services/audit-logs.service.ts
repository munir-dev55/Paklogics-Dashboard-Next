import { getAccessToken, clearSession } from "@/lib/auth-session";
import { ApiError } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";
import { withQuery } from "@/lib/query-string";
import type {
  AdminAuditLogDetail,
  AuditLogsListParams,
  AuditLogsListResult,
} from "@/types/audit-logs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getBaseUrl() {
  if (!API_BASE_URL) {
    throw new ApiError(500, "API base URL is not configured.");
  }

  return API_BASE_URL.replace(/\/$/, "");
}

function filenameFromDisposition(header: string | null) {
  if (!header) return null;
  const utfMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1].trim());
  }
  const match = header.match(/filename="?([^";]+)"?/i);
  return match?.[1]?.trim() ?? null;
}

async function downloadCsv(path: string) {
  const token = getAccessToken();

  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Please try again.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.replace("/auth/signin");
      }
    }

    let message = "Unable to export audit logs.";
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) message = payload.message;
    } catch {
      // raw CSV error body
    }
    throw new ApiError(response.status, message);
  }

  const blob = await response.blob();
  const filename =
    filenameFromDisposition(response.headers.get("Content-Disposition")) ||
    `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const auditLogsService = {
  list(params: AuditLogsListParams) {
    return apiClient<AuditLogsListResult>(withQuery("/admin/audit-logs", params));
  },

  getById(id: string) {
    return apiClient<AdminAuditLogDetail>(`/admin/audit-logs/${id}`);
  },

  exportCsv(params: Omit<AuditLogsListParams, "page" | "limit">) {
    return downloadCsv(withQuery("/admin/audit-logs/export", params));
  },
};
