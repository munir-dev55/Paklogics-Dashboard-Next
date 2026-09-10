export const statuses = ["Outstanding", "Paid", "Overdue"] as const;
export type InvoiceRecord = {
  id: string;
  name: string;
  caseId: string;
  owner: string;
  status: (typeof statuses)[number];
  date: string;
  amount: number;
};

// Preview records; replace with API data when available.
export const invoices: InvoiceRecord[] = [
  {
    id: "INV-2026-001",
    caseId: "ADR-2026-001",
    name: "Johnson v. Meridian Corp",
    owner: "Meridian Corp",
    status: "Outstanding",
    date: "2026-09-30",
    amount: 12500,
  },
  {
    id: "INV-2026-002",
    caseId: "ADR-2026-002",
    name: "Reyes Family Trust Dispute",
    owner: "Reyes Family Trust",
    status: "Paid",
    date: "2026-09-05",
    amount: 4800,
  },
  {
    id: "INV-2026-003",
    caseId: "ADR-2026-003",
    name: "Hartwell Construction v. Pinnacle",
    owner: "Hartwell Construction",
    status: "Overdue",
    date: "2026-08-31",
    amount: 7200,
  },
  {
    id: "INV-2026-004",
    caseId: "ADR-2026-004",
    name: "Murphy Construction Defect Claim",
    owner: "Murphy Construction",
    status: "Paid",
    date: "2026-08-28",
    amount: 3600,
  },
];
