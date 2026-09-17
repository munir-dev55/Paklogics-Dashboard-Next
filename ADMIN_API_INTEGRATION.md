# Admin Panel API Integration Guide

Guide for the web frontend (and coding agents) integrating the **FedArb Admin panel** with backend APIs.

**Base URL:** `{API_ORIGIN}/api/v1`  
**Postman:** `FEDARB.postman_collection.json` → folder **Admin**  
**Allowed roles:** `SUPER_ADMIN`, `ADMIN_LEADERSHIP` only (all `/admin/*` routes)

---

## 1. Auth

### Headers

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Cookie `accessToken` is also accepted if you use cookie-based auth.

### Who can use Admin APIs

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full admin panel |
| `ADMIN_LEADERSHIP` | Full admin panel |
| Everyone else | `403` on `/admin/*` |

Sign in with an SA/AL account, store the token, and send it on every admin request.

### Standard response envelope

Success:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { }
}
```

Error:

```json
{
  "success": false,
  "statusCode": 400 | 401 | 403 | 404 | 409 | ...,
  "message": "Human-readable error",
  "errors": []
}
```

Handle `401` → re-login; `403` → hide admin UI / show forbidden.

---

## 2. Enums (copy into frontend constants)

### `RoleName`

```ts
type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN_LEADERSHIP"
  | "CASE_MANAGER"
  | "NEUTRAL"
  | "LAWYER"
  | "CLIENT"
  | "ACCOUNTING_STAFF";
```

**Invitable roles** (invite API — cannot invite Super Admin):

```ts
const INVITABLE_ROLES = [
  "ADMIN_LEADERSHIP",
  "CASE_MANAGER",
  "NEUTRAL",
  "LAWYER",
  "CLIENT",
  "ACCOUNTING_STAFF",
] as const;
```

### `UserType` (required on invite)

```ts
type UserType = "INTERNAL" | "EXTERNAL";
```

Suggested mapping for invite form:

| Role | Typical `userType` |
|------|--------------------|
| `ADMIN_LEADERSHIP`, `CASE_MANAGER`, `ACCOUNTING_STAFF` | `INTERNAL` |
| `NEUTRAL`, `LAWYER`, `CLIENT` | `EXTERNAL` |

Backend still accepts any valid pair; FE should default sensibly.

### `UserStatus`

```ts
type UserStatus =
  | "ACTIVE"
  | "INVITED"
  | "INVITE_EXPIRED"
  | "DEACTIVATED"
  | "LOCKED";
```

**Status toggle (admin can set only these):**

```ts
type AdminSettableStatus = "ACTIVE" | "DEACTIVATED" | "LOCKED";
```

Figma toggle:

- **On** → `ACTIVE`
- **Off / trash** → `DEACTIVATED` (soft delete; no hard-delete API)

### `CaseLifecycleStatus` (raw DB)

```ts
type CaseLifecycleStatus =
  | "INTAKE"
  | "SCHEDULED"
  | "ACTIVE"
  | "ON_HOLD"
  | "CLOSED"
  | "REOPENED";
```

**Admin case list UI filter values** (preferred for dropdowns):

| UI value | Maps to |
|----------|---------|
| `ANY` / omit | No filter |
| `PENDING` | `INTAKE`, `SCHEDULED` |
| `ACTIVE` | `ACTIVE`, `REOPENED` |
| `ON_HOLD` | `ON_HOLD` |
| `CLOSED` | `CLOSED` |

You may also pass a raw `CaseLifecycleStatus` value.

### Admin invoice UI status

```ts
type AdminInvoiceStatus = "ANY" | "OUTSTANDING" | "PAID" | "OVERDUE";
```

| Value | Meaning |
|-------|---------|
| `OUTSTANDING` | Issued/sent/draft, unpaid/partial, not past due |
| `PAID` | `paymentStatus = PAID` |
| `OVERDUE` | Marked overdue or unpaid/partial with `dueDate` in the past |

List rows return `status` as one of `OUTSTANDING` | `PAID` | `OVERDUE` for badges.

### Dashboard period

```ts
type InvoicePeriod = "monthly" | "yearly"; // default monthly
```

---

## 3. Pagination (list endpoints)

Query:

| Param | Default | Notes |
|-------|---------|-------|
| `page` | `1` | ≥ 1 |
| `limit` | `20` | 1–100 |

Response:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Omit empty filter strings or send `""` — both are accepted for optional filters.

---

## 4. Dashboard

### `GET /admin/dashboard`

**Query**

| Param | Values | Default |
|-------|--------|---------|
| `invoicePeriod` | `monthly` \| `yearly` | `monthly` |

**Example**

```http
GET /api/v1/admin/dashboard?invoicePeriod=monthly
```

**`data` shape**

```ts
{
  kpis: {
    totalUsers: number;
    blockedUsers: number;   // DEACTIVATED + LOCKED
    totalCases: number;
    totalInvoices: number;  // excludes VOID
  };
  invoicesOverview: {
    period: "monthly" | "yearly";
    series: Array<{
      label: string;           // e.g. "Sep 2026" or "2026"
      receivedAmount: number;  // payments in bucket
      dueAmount: number;       // outstanding on open invoices in bucket
    }>;
    receivedAmount: number;    // series sum
    dueAmount: number;         // series sum
  };
}
```

**FE mapping (home screen)**

| Card / chart | Field |
|--------------|--------|
| Total Users | `kpis.totalUsers` |
| Blocked Users | `kpis.blockedUsers` |
| Total Cases | `kpis.totalCases` |
| Total Invoices | `kpis.totalInvoices` |
| Chart lines | `invoicesOverview.series[].receivedAmount` / `dueAmount` |
| Chart “SHORT BY” | `invoicePeriod` |
| Footer Received / Due | `invoicesOverview.receivedAmount` / `dueAmount` |

---

## 5. Users

### List — `GET /admin/users`

**Query**

| Param | Description |
|-------|-------------|
| `search` | Name, email, phone, job title, law firm, party org |
| `role` | `RoleName` or omit / `""` |
| `status` | `UserStatus` or omit / `""` |
| `page`, `limit` | Pagination |

**Example**

```http
GET /api/v1/admin/users?page=1&limit=20&search=williams&role=NEUTRAL&status=ACTIVE
```

**`data` shape**

```ts
{
  users: Array<{
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    firmCompany: string | null;
    role: RoleName | null;
    email: string;
    phone: string | null;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: { ... };
}
```

**Table columns**

| Column | Field |
|--------|--------|
| NAME | `name` |
| FIRM / COMPANY | `firmCompany` |
| ROLE | `role` (labelize enums) |
| CONTACT | `email`, `phone` |
| STATUS toggle | `status === "ACTIVE"` → on |

### Invite — `POST /auth/invite`

Not under `/admin`; same SA/AL auth. Use this for “Invite user”.

**Body**

```json
{
  "email": "new.cm@example.com",
  "userType": "INTERNAL",
  "roleName": "CASE_MANAGER",
  "jobTitle": "Case Manager"
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `email` | yes | Valid email (lowercased) |
| `userType` | yes | `INTERNAL` \| `EXTERNAL` |
| `roleName` | yes | Any `RoleName` **except** `SUPER_ADMIN` |
| `jobTitle` | no | Max 100 chars |

**Invite flow for FE**

1. Open invite modal → collect email, role, userType (default by role), optional jobTitle.
2. `POST /auth/invite`.
3. On success, refresh `GET /admin/users` (user appears as `INVITED`).
4. Invitee accepts via public accept-invite flow (outside admin panel); then status becomes `ACTIVE`.

Invitation expires in **7 days** (`INVITE_EXPIRED` if unused).

### View — `GET /users/:id`

Eye icon → full user profile (existing users API).

### Toggle status — `PATCH /users/:id/status`

**Body**

```json
{ "status": "ACTIVE" }
```

or deactivate (trash / toggle off):

```json
{
  "status": "DEACTIVATED",
  "reason": "Removed from admin panel"
}
```

| Field | Required | Values |
|-------|----------|--------|
| `status` | yes | `ACTIVE` \| `DEACTIVATED` \| `LOCKED` |
| `reason` | no | Max 500; useful for deactivate |

**Rules**

- Cannot deactivate/lock **your own** account (`400`).
- No hard delete — always soft status change.

**Toggle UX**

```ts
async function onToggle(userId: string, nextOn: boolean) {
  await api.patch(`/users/${userId}/status`, {
    status: nextOn ? "ACTIVE" : "DEACTIVATED",
    reason: nextOn ? undefined : "Deactivated from admin users table",
  });
}
```

---

## 6. Case Management

### List — `GET /admin/cases`

**Query**

| Param | Description |
|-------|-------------|
| `search` | Case number, title, case manager name/email |
| `status` | `ANY` \| `PENDING` \| `ACTIVE` \| `ON_HOLD` \| `CLOSED` \| raw lifecycle |
| `page`, `limit` | Pagination |

**Example**

```http
GET /api/v1/admin/cases?page=1&limit=20&search=Johnson&status=ACTIVE
```

**`data` shape**

```ts
{
  cases: Array<{
    id: string;
    caseNumber: string;
    title: string;
    caseManager: {
      id: string;
      name: string;
      email: string;
    } | null;
    status: CaseLifecycleStatus;
    reviewDate: string;  // updatedAt
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
  }>;
  pagination: { ... };
  summary: {
    total: number;
    active: number;   // ACTIVE + REOPENED (global, not filter-scoped)
    closed: number;   // CLOSED (global)
  };
}
```

**FE mapping**

| UI | Field |
|----|--------|
| Total / Active / Closed cards | `summary.*` |
| Case column | `caseNumber` + `title` |
| Case manager | `caseManager.name` |
| Status badge | `status` (map `INTAKE`/`SCHEDULED` → “Pending” if desired) |
| Review date | `reviewDate` |
| Details | `GET /cases/:id` |

### Detail — `GET /cases/:id`

Existing case API (eye icon).

---

## 7. Billing & Invoices

### List — `GET /admin/invoices`

**Query**

| Param | Description |
|-------|-------------|
| `search` | Invoice #, case #, case title, billed-to name/org/email |
| `status` | `ANY` \| `OUTSTANDING` \| `PAID` \| `OVERDUE` |
| `page`, `limit` | Pagination |

**Example**

```http
GET /api/v1/admin/invoices?page=1&limit=20&status=OUTSTANDING&search=Meridian
```

**`data` shape**

```ts
{
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    caseId: string | null;
    caseNumber: string | null;
    caseTitle: string | null;
    billedTo: string | null;
    status: "OUTSTANDING" | "PAID" | "OVERDUE";
    invoiceStatus: string;
    paymentStatus: string;
    dueDate: string | null;
    amount: number;
    createdAt: string;
  }>;
  pagination: { ... };
  summary: {
    totalBilled: number;
    paid: number;
    unpaidBalance: number;
  };
}
```

**FE mapping**

| UI | Field |
|----|--------|
| Total billed / Paid / Unpaid cards | `summary.*` |
| Invoice / Case | `invoiceNumber`, `caseTitle`, `caseNumber` |
| Billed to | `billedTo` |
| Status badge | `status` (UI enum) |
| Due date | `dueDate` |
| Amount | `amount` |
| Details | `GET /billing/invoices/:id` |

### Detail — `GET /billing/invoices/:invoiceId`

Existing billing API (eye icon). Requires billing access (SA/AL have it).

---

## 8. Suggested frontend API module

```ts
// adminApi.ts
const admin = {
  dashboard: (invoicePeriod: "monthly" | "yearly" = "monthly") =>
    client.get("/admin/dashboard", { params: { invoicePeriod } }),

  users: (params: { page?: number; limit?: number; search?: string; role?: string; status?: string }) =>
    client.get("/admin/users", { params }),

  cases: (params: { page?: number; limit?: number; search?: string; status?: string }) =>
    client.get("/admin/cases", { params }),

  invoices: (params: { page?: number; limit?: number; search?: string; status?: string }) =>
    client.get("/admin/invoices", { params }),
};

const usersMutations = {
  invite: (body: { email: string; userType: "INTERNAL" | "EXTERNAL"; roleName: string; jobTitle?: string }) =>
    client.post("/auth/invite", body),

  setStatus: (id: string, body: { status: "ACTIVE" | "DEACTIVATED" | "LOCKED"; reason?: string }) =>
    client.patch(`/users/${id}/status`, body),

  getById: (id: string) => client.get(`/users/${id}`),
};
```

---

## 9. Screen → API checklist

| Screen | Primary API | Related |
|--------|-------------|---------|
| Dashboard home | `GET /admin/dashboard` | Period dropdown → `invoicePeriod` |
| Users table | `GET /admin/users` | Invite → `POST /auth/invite`; toggle/trash → `PATCH /users/:id/status`; eye → `GET /users/:id` |
| Case Management | `GET /admin/cases` | Cards from `summary`; eye → `GET /cases/:id` |
| Billing & Invoices | `GET /admin/invoices` | Cards from `summary`; eye → `GET /billing/invoices/:id` |

---

## 10. Role label helpers (optional UI)

```ts
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_LEADERSHIP: "Admin / Leadership",
  CASE_MANAGER: "Case Manager",
  NEUTRAL: "Neutral",
  LAWYER: "Lawyer",
  CLIENT: "Client",
  ACCOUNTING_STAFF: "Accounting Staff",
};

const CASE_STATUS_LABELS: Record<string, string> = {
  INTAKE: "Pending",
  SCHEDULED: "Pending",
  ACTIVE: "Active",
  REOPENED: "Active",
  ON_HOLD: "On hold",
  CLOSED: "Closed",
};
```

---

## 11. Out of scope for this Admin surface

- Hard-delete users
- Creating/editing cases or invoices from `/admin` (use existing Case / Billing APIs)
- Per-user Zoom or DocuSign admin dashboards

For full operational workflows, use the other Postman folders (`Case`, `Billing`, `Hearing`, etc.) with the same SA/AL token.
