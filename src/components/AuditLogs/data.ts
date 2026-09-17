export const AUDIT_STATUSES = ["Success", "Failed", "Warning"] as const;
export const AUDIT_MODULES = [
  "Authentication",
  "Users",
  "Cases",
  "Billing",
  "Exports",
] as const;

export type AuditStatus = (typeof AUDIT_STATUSES)[number];
export type AuditModule = (typeof AUDIT_MODULES)[number];

export type AuditLog = {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  module: AuditModule;
  resource: string;
  status: AuditStatus;
  ipAddress: string;
  details: string;
};

export const auditLogs: AuditLog[] = [
  {
    id: "AUD-2026-0012",
    timestamp: "2026-09-17T18:42:11.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Exported invoice report",
    module: "Exports",
    resource: "INV-2026-0041",
    status: "Success",
    ipAddress: "203.0.113.12",
    details: "CSV export of outstanding invoices for September 2026.",
  },
  {
    id: "AUD-2026-0011",
    timestamp: "2026-09-17T16:08:44.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Deactivated user",
    module: "Users",
    resource: "murtazadev@paklogics.com",
    status: "Success",
    ipAddress: "203.0.113.12",
    details: "User status changed from Active to Inactive from the users table.",
  },
  {
    id: "AUD-2026-0010",
    timestamp: "2026-09-17T15:21:03.000Z",
    actor: "Case Manager",
    actorEmail: "murtazadev@paklogics.com",
    action: "Updated case status",
    module: "Cases",
    resource: "MED-2026-0001",
    status: "Warning",
    ipAddress: "198.51.100.24",
    details: "Lifecycle stayed at Intake after a review-date update with no status change.",
  },
  {
    id: "AUD-2026-0009",
    timestamp: "2026-09-16T21:04:19.000Z",
    actor: "Unknown",
    actorEmail: "—",
    action: "Sign-in attempt",
    module: "Authentication",
    resource: "admin@fedarb.com",
    status: "Failed",
    ipAddress: "192.0.2.88",
    details: "Invalid password. Account was not locked.",
  },
  {
    id: "AUD-2026-0008",
    timestamp: "2026-09-16T20:58:02.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Signed in",
    module: "Authentication",
    resource: "admin@fedarb.com",
    status: "Success",
    ipAddress: "203.0.113.12",
    details: "Successful admin panel sign-in.",
  },
  {
    id: "AUD-2026-0007",
    timestamp: "2026-09-16T14:11:37.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Invited user",
    module: "Users",
    resource: "neutral@fedarb.com",
    status: "Success",
    ipAddress: "203.0.113.12",
    details: "Invitation sent for Neutral / External.",
  },
  {
    id: "AUD-2026-0006",
    timestamp: "2026-09-15T19:33:51.000Z",
    actor: "Accounting Staff",
    actorEmail: "billing@fedarb.com",
    action: "Marked invoice paid",
    module: "Billing",
    resource: "INV-2026-0038",
    status: "Success",
    ipAddress: "203.0.113.41",
    details: "Payment recorded against case MED-2026-0001.",
  },
  {
    id: "AUD-2026-0005",
    timestamp: "2026-09-15T11:02:08.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Exported case list",
    module: "Exports",
    resource: "Case Management",
    status: "Failed",
    ipAddress: "203.0.113.12",
    details: "Excel export timed out while generating the file.",
  },
  {
    id: "AUD-2026-0004",
    timestamp: "2026-09-14T13:17:09.000Z",
    actor: "Case Manager",
    actorEmail: "murtazadev@paklogics.com",
    action: "Created case",
    module: "Cases",
    resource: "MED-2026-0001",
    status: "Success",
    ipAddress: "198.51.100.24",
    details: "Case “My Sample Commercial Dispute” created from intake.",
  },
  {
    id: "AUD-2026-0003",
    timestamp: "2026-09-14T09:44:26.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Activated user",
    module: "Users",
    resource: "murtazadev@paklogics.com",
    status: "Success",
    ipAddress: "203.0.113.12",
    details: "User status changed from Inactive to Active.",
  },
  {
    id: "AUD-2026-0002",
    timestamp: "2026-09-13T22:19:40.000Z",
    actor: "Unknown",
    actorEmail: "—",
    action: "Sign-in attempt",
    module: "Authentication",
    resource: "admin@fedarb.com",
    status: "Failed",
    ipAddress: "192.0.2.14",
    details: "Unknown device. Credentials were rejected.",
  },
  {
    id: "AUD-2026-0001",
    timestamp: "2026-09-12T08:05:13.000Z",
    actor: "Admin Leadership",
    actorEmail: "admin@fedarb.com",
    action: "Viewed invoice",
    module: "Billing",
    resource: "INV-2026-0031",
    status: "Warning",
    ipAddress: "203.0.113.12",
    details: "Invoice opened without billing notes attached.",
  },
];
