export const statuses = ["Active", "Pending", "On hold", "Closed"] as const;
export type CaseRecord = {
  id: string;
  name: string;
  caseId: string;
  owner: string;
  status: (typeof statuses)[number];
  date: string;
};

// Preview records; replace with API data when available.
export const cases: CaseRecord[] = [
  {
    id: "ADR-2026-001",
    caseId: "ADR-2026-001",
    name: "Johnson v. Meridian Corp",
    owner: "Alex Johnson",
    status: "Active",
    date: "2026-09-18",
  },
  {
    id: "ADR-2026-002",
    caseId: "ADR-2026-002",
    name: "Reyes Family Trust Dispute",
    owner: "Morgan Lee",
    status: "Pending",
    date: "2026-09-22",
  },
  {
    id: "ADR-2026-003",
    caseId: "ADR-2026-003",
    name: "Hartwell Construction v. Pinnacle",
    owner: "Alex Johnson",
    status: "On hold",
    date: "2026-09-25",
  },
  {
    id: "ADR-2026-004",
    caseId: "ADR-2026-004",
    name: "Murphy Construction Defect Claim",
    owner: "Morgan Lee",
    status: "Closed",
    date: "2026-08-28",
  },
];
