export type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN_LEADERSHIP"
  | "CASE_MANAGER"
  | "NEUTRAL"
  | "LAWYER"
  | "CLIENT"
  | "ACCOUNTING_STAFF";

export type UserType = "INTERNAL" | "EXTERNAL";

export type UserStatus =
  | "ACTIVE"
  | "INVITED"
  | "INVITE_EXPIRED"
  | "DEACTIVATED"
  | "LOCKED";

export type AdminSettableStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED";

export const ADMIN_ROLES: readonly RoleName[] = [
  "SUPER_ADMIN",
  "ADMIN_LEADERSHIP",
];

export const INVITABLE_ROLES = [
  "ADMIN_LEADERSHIP",
  "CASE_MANAGER",
  "NEUTRAL",
  "LAWYER",
  "CLIENT",
  "ACCOUNTING_STAFF",
] as const;

export type InvitableRole = (typeof INVITABLE_ROLES)[number];

export const ROLE_LABELS: Record<RoleName, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_LEADERSHIP: "Admin / Leadership",
  CASE_MANAGER: "Case Manager",
  NEUTRAL: "Neutral",
  LAWYER: "Lawyer",
  CLIENT: "Client",
  ACCOUNTING_STAFF: "Accounting Staff",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INVITED: "Invited",
  INVITE_EXPIRED: "Invite expired",
  DEACTIVATED: "Inactive",
  LOCKED: "Locked",
};

export function defaultUserType(role: RoleName): UserType {
  if (role === "NEUTRAL" || role === "LAWYER" || role === "CLIENT") {
    return "EXTERNAL";
  }

  return "INTERNAL";
}

export function roleLabel(role: RoleName | string | null | undefined) {
  if (!role) return "—";
  return ROLE_LABELS[role as RoleName] ?? role;
}

export type CaseLifecycleStatus =
  | "INTAKE"
  | "SCHEDULED"
  | "ACTIVE"
  | "ON_HOLD"
  | "CLOSED"
  | "REOPENED";

export type AdminCaseStatusFilter = "PENDING" | "ACTIVE" | "ON_HOLD" | "CLOSED";

export const CASE_STATUS_LABELS: Record<CaseLifecycleStatus, string> = {
  INTAKE: "Pending",
  SCHEDULED: "Pending",
  ACTIVE: "Active",
  REOPENED: "Active",
  ON_HOLD: "On hold",
  CLOSED: "Closed",
};

export const CASE_FILTER_OPTIONS: Array<{
  value: AdminCaseStatusFilter;
  label: string;
}> = [
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "CLOSED", label: "Closed" },
];

export function caseStatusLabel(status: CaseLifecycleStatus | string | null | undefined) {
  if (!status) return "—";
  return CASE_STATUS_LABELS[status as CaseLifecycleStatus] ?? status;
}
