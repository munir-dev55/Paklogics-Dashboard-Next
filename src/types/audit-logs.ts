import type { Pagination } from "@/types/api";
import type { PermissionModule, RoleName } from "@/types/enums";

export type AuditLogsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  module?: PermissionModule | "";
  role?: RoleName | "";
  from?: string;
  to?: string;
};

export type AdminAuditLogActor = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AdminAuditLogListItem = {
  id: string;
  createdAt: string;
  action: string;
  module: PermissionModule;
  actingUserRoleSnapshot: RoleName | null;
  affectedRecordType: string;
  affectedRecordId: string;
  reason: string | null;
  actor: AdminAuditLogActor | null;
};

export type AdminAuditLogDetail = AdminAuditLogListItem & {
  previousValue: unknown | null;
  newValue: unknown | null;
  ipAddress: string | null;
  deviceInfo: string | null;
};

export type AuditLogsListResult = {
  auditLogs: AdminAuditLogListItem[];
  pagination: Pagination;
  summary: {
    totalEvents: number;
  };
};
