import type { AdminAuditLogDetail } from "@/types/audit-logs";
import type { CaseDetails } from "@/types/cases";
import type { AdminDashboard } from "@/types/dashboard";
import type { InvoiceDetails } from "@/types/invoices";
import type { AdminUser, UserDetails } from "@/types/users";
import type { AuthUser } from "@/types/auth";

export const DEMO_USER: AuthUser = {
  id: "user-001",
  email: "admin@fedarb.com",
  firstName: "Super",
  lastName: "Admin",
  phone: "+1 202 555 0100",
  jobTitle: "Platform Administrator",
  userType: "INTERNAL",
  status: "ACTIVE",
  roleId: "role-super-admin",
  role: { id: "role-super-admin", name: "SUPER_ADMIN" },
  twoFactorEnabled: false,
  lastLoginAt: "2026-09-24T08:30:00.000Z",
  mustChangePassword: false,
  createdAt: "2025-01-15T09:00:00.000Z",
  updatedAt: "2026-09-24T08:30:00.000Z",
};

export const STATIC_USER_DETAILS: UserDetails[] = [
  { ...DEMO_USER, deactivatedAt: null, deactivationReason: null },
  {
    id: "user-002", email: "sarah.chen@fedarb.com", firstName: "Sarah", lastName: "Chen",
    phone: "+1 202 555 0102", jobTitle: "Senior Case Manager", userType: "INTERNAL", status: "ACTIVE",
    roleId: "role-case-manager", role: { id: "role-case-manager", name: "CASE_MANAGER" },
    deactivatedAt: null, deactivationReason: null, createdAt: "2025-05-12T10:00:00.000Z", updatedAt: "2026-09-20T12:00:00.000Z",
  },
  {
    id: "user-003", email: "james.wilson@example.com", firstName: "James", lastName: "Wilson",
    phone: "+1 202 555 0103", jobTitle: "Mediator", userType: "EXTERNAL", status: "ACTIVE",
    roleId: "role-neutral", role: { id: "role-neutral", name: "NEUTRAL" },
    deactivatedAt: null, deactivationReason: null, createdAt: "2025-08-02T10:00:00.000Z", updatedAt: "2026-09-19T12:00:00.000Z",
  },
  {
    id: "user-004", email: "maya.patel@meridian.com", firstName: "Maya", lastName: "Patel",
    phone: "+1 202 555 0104", jobTitle: "General Counsel", userType: "EXTERNAL", status: "INVITED",
    roleId: "role-lawyer", role: { id: "role-lawyer", name: "LAWYER" },
    deactivatedAt: null, deactivationReason: null, createdAt: "2026-09-18T10:00:00.000Z", updatedAt: "2026-09-18T10:00:00.000Z",
  },
  {
    id: "user-005", email: "olivia.brooks@fedarb.com", firstName: "Olivia", lastName: "Brooks",
    phone: "+1 202 555 0105", jobTitle: "Accounting Specialist", userType: "INTERNAL", status: "ACTIVE",
    roleId: "role-accounting", role: { id: "role-accounting", name: "ACCOUNTING_STAFF" },
    deactivatedAt: null, deactivationReason: null, createdAt: "2025-11-09T10:00:00.000Z", updatedAt: "2026-09-17T12:00:00.000Z",
  },
  {
    id: "user-006", email: "daniel.reyes@example.com", firstName: "Daniel", lastName: "Reyes",
    phone: "+1 202 555 0106", jobTitle: "Trustee", userType: "EXTERNAL", status: "DEACTIVATED",
    roleId: "role-client", role: { id: "role-client", name: "CLIENT" },
    deactivatedAt: "2026-08-12T14:00:00.000Z", deactivationReason: "Matter concluded", createdAt: "2025-09-14T10:00:00.000Z", updatedAt: "2026-08-12T14:00:00.000Z",
  },
];

export const STATIC_USERS: AdminUser[] = STATIC_USER_DETAILS.map((user) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  firstName: user.firstName,
  lastName: user.lastName,
  firmCompany: user.userType === "INTERNAL" ? "FedArb ADR" : user.email.split("@")[1] ?? null,
  role: user.role?.name ?? null,
  email: user.email,
  phone: user.phone,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
}));

export const STATIC_CASES: CaseDetails[] = [
  {
    id: "case-001", caseNumber: "ADR-2026-001", title: "Johnson v. Meridian Corp", caseType: "Commercial Arbitration",
    lifecycleStatus: "ACTIVE", closedAt: null, closureSummary: null, jurisdiction: "New York", isInternational: false,
    caseValue: 850000, createdAt: "2026-06-10T09:00:00.000Z", updatedAt: "2026-09-18T09:00:00.000Z",
    caseManager: { id: "user-002", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@fedarb.com" },
  },
  {
    id: "case-002", caseNumber: "ADR-2026-002", title: "Reyes Family Trust Dispute", caseType: "Mediation",
    lifecycleStatus: "SCHEDULED", closedAt: null, closureSummary: null, jurisdiction: "California", isInternational: false,
    caseValue: 480000, createdAt: "2026-07-22T09:00:00.000Z", updatedAt: "2026-09-22T09:00:00.000Z",
    caseManager: { id: "user-002", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@fedarb.com" },
  },
  {
    id: "case-003", caseNumber: "ADR-2026-003", title: "Hartwell Construction v. Pinnacle", caseType: "Construction Arbitration",
    lifecycleStatus: "ON_HOLD", closedAt: null, closureSummary: null, jurisdiction: "Texas", isInternational: false,
    caseValue: 1250000, createdAt: "2026-05-18T09:00:00.000Z", updatedAt: "2026-09-25T09:00:00.000Z",
    caseManager: { id: "user-001", firstName: "Alex", lastName: "Morgan", email: "admin@fedarb.com" },
  },
  {
    id: "case-004", caseNumber: "ADR-2026-004", title: "Murphy Construction Defect Claim", caseType: "Mediation",
    lifecycleStatus: "CLOSED", closedAt: "2026-08-28T16:00:00.000Z", closureSummary: "Resolved by mediated settlement.", jurisdiction: "Florida", isInternational: false,
    caseValue: 320000, createdAt: "2026-02-05T09:00:00.000Z", updatedAt: "2026-08-28T16:00:00.000Z",
    caseManager: { id: "user-002", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@fedarb.com" },
  },
];

export const STATIC_INVOICES: InvoiceDetails[] = [
  {
    id: "invoice-001", invoiceNumber: "INV-2026-001", invoiceType: "Professional Services", invoiceStatus: "ISSUED", paymentStatus: "UNPAID",
    amountDue: 12500, subtotal: 12500, dueDate: "2026-09-30T00:00:00.000Z", invoiceDate: "2026-09-01T00:00:00.000Z",
    specialInstructions: "Payment due within 30 days.", createdAt: "2026-09-01T09:00:00.000Z", updatedAt: "2026-09-01T09:00:00.000Z",
    case: { id: "case-001", caseNumber: "ADR-2026-001", title: "Johnson v. Meridian Corp" },
    payerCaseParty: { id: "party-001", organizationName: "Meridian Corp", firstName: null, lastName: null, email: "billing@meridian.com" },
  },
  {
    id: "invoice-002", invoiceNumber: "INV-2026-002", invoiceType: "Professional Services", invoiceStatus: "ISSUED", paymentStatus: "PAID",
    amountDue: 4800, subtotal: 4800, dueDate: "2026-09-05T00:00:00.000Z", invoiceDate: "2026-08-05T00:00:00.000Z",
    specialInstructions: null, createdAt: "2026-08-05T09:00:00.000Z", updatedAt: "2026-09-03T09:00:00.000Z",
    case: { id: "case-002", caseNumber: "ADR-2026-002", title: "Reyes Family Trust Dispute" },
    payerCaseParty: { id: "party-002", organizationName: "Reyes Family Trust", firstName: null, lastName: null, email: "accounts@reyestrust.com" },
  },
  {
    id: "invoice-003", invoiceNumber: "INV-2026-003", invoiceType: "Professional Services", invoiceStatus: "ISSUED", paymentStatus: "OVERDUE",
    amountDue: 7200, subtotal: 7200, dueDate: "2026-08-31T00:00:00.000Z", invoiceDate: "2026-08-01T00:00:00.000Z",
    specialInstructions: "Please reference the case number.", createdAt: "2026-08-01T09:00:00.000Z", updatedAt: "2026-09-15T09:00:00.000Z",
    case: { id: "case-003", caseNumber: "ADR-2026-003", title: "Hartwell Construction v. Pinnacle" },
    payerCaseParty: { id: "party-003", organizationName: "Hartwell Construction", firstName: null, lastName: null, email: "finance@hartwell.com" },
  },
  {
    id: "invoice-004", invoiceNumber: "INV-2026-004", invoiceType: "Professional Services", invoiceStatus: "ISSUED", paymentStatus: "PAID",
    amountDue: 3600, subtotal: 3600, dueDate: "2026-08-28T00:00:00.000Z", invoiceDate: "2026-07-28T00:00:00.000Z",
    specialInstructions: null, createdAt: "2026-07-28T09:00:00.000Z", updatedAt: "2026-08-20T09:00:00.000Z",
    case: { id: "case-004", caseNumber: "ADR-2026-004", title: "Murphy Construction Defect Claim" },
    payerCaseParty: { id: "party-004", organizationName: "Murphy Construction", firstName: null, lastName: null, email: "billing@murphy.com" },
  },
];

const auditActor = { id: "user-001", email: "admin@fedarb.com", firstName: "Alex", lastName: "Morgan" };

export const STATIC_AUDIT_LOGS: AdminAuditLogDetail[] = [
  { id: "audit-001", createdAt: "2026-09-24T08:45:00.000Z", action: "USER_STATUS_UPDATED", module: "USERS", actingUserRoleSnapshot: "SUPER_ADMIN", affectedRecordType: "User", affectedRecordId: "user-006", reason: "Matter concluded", actor: auditActor, previousValue: { status: "ACTIVE" }, newValue: { status: "DEACTIVATED" }, ipAddress: "192.0.2.10", deviceInfo: "Chrome on macOS" },
  { id: "audit-002", createdAt: "2026-09-23T14:20:00.000Z", action: "CASE_UPDATED", module: "CASES", actingUserRoleSnapshot: "CASE_MANAGER", affectedRecordType: "Case", affectedRecordId: "ADR-2026-003", reason: "Awaiting supporting documents", actor: { id: "user-002", email: "sarah.chen@fedarb.com", firstName: "Sarah", lastName: "Chen" }, previousValue: { status: "ACTIVE" }, newValue: { status: "ON_HOLD" }, ipAddress: "192.0.2.22", deviceInfo: "Edge on Windows" },
  { id: "audit-003", createdAt: "2026-09-22T11:05:00.000Z", action: "INVOICE_CREATED", module: "BILLING", actingUserRoleSnapshot: "ACCOUNTING_STAFF", affectedRecordType: "Invoice", affectedRecordId: "INV-2026-001", reason: null, actor: { id: "user-005", email: "olivia.brooks@fedarb.com", firstName: "Olivia", lastName: "Brooks" }, previousValue: null, newValue: { amount: 12500, status: "ISSUED" }, ipAddress: "192.0.2.31", deviceInfo: "Chrome on Windows" },
  { id: "audit-004", createdAt: "2026-09-20T09:30:00.000Z", action: "USER_INVITED", module: "USERS", actingUserRoleSnapshot: "SUPER_ADMIN", affectedRecordType: "User", affectedRecordId: "user-004", reason: null, actor: auditActor, previousValue: null, newValue: { email: "maya.patel@meridian.com", role: "LAWYER" }, ipAddress: "192.0.2.10", deviceInfo: "Chrome on macOS" },
  { id: "audit-005", createdAt: "2026-09-18T16:10:00.000Z", action: "DOCUMENT_UPLOADED", module: "DOCUMENTS", actingUserRoleSnapshot: "CASE_MANAGER", affectedRecordType: "CaseDocument", affectedRecordId: "document-1042", reason: null, actor: { id: "user-002", email: "sarah.chen@fedarb.com", firstName: "Sarah", lastName: "Chen" }, previousValue: null, newValue: { filename: "hearing-schedule.pdf" }, ipAddress: "192.0.2.22", deviceInfo: "Edge on Windows" },
];

export const STATIC_DASHBOARDS: Record<"monthly" | "yearly", AdminDashboard> = {
  monthly: {
    kpis: { totalUsers: 126, blockedUsers: 4, totalCases: 48, totalInvoices: 92 },
    invoicesOverview: {
      period: "monthly", receivedAmount: 80400, dueAmount: 26700,
      series: [
        { label: "Apr", receivedAmount: 9200, dueAmount: 3500 }, { label: "May", receivedAmount: 11800, dueAmount: 4200 },
        { label: "Jun", receivedAmount: 12600, dueAmount: 5100 }, { label: "Jul", receivedAmount: 15400, dueAmount: 3900 },
        { label: "Aug", receivedAmount: 14300, dueAmount: 5700 }, { label: "Sep", receivedAmount: 17100, dueAmount: 4300 },
      ],
    },
  },
  yearly: {
    kpis: { totalUsers: 126, blockedUsers: 4, totalCases: 48, totalInvoices: 92 },
    invoicesOverview: {
      period: "yearly", receivedAmount: 278500, dueAmount: 68400,
      series: [
        { label: "2022", receivedAmount: 172000, dueAmount: 52000 }, { label: "2023", receivedAmount: 211000, dueAmount: 61000 },
        { label: "2024", receivedAmount: 236000, dueAmount: 57000 }, { label: "2025", receivedAmount: 254000, dueAmount: 72000 },
        { label: "2026", receivedAmount: 278500, dueAmount: 68400 },
      ],
    },
  },
};

export function staticDelay<T>(value: T, milliseconds = 180): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), milliseconds));
}
