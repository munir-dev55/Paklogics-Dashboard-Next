"use client";

import DataTable, {
  RecordIdentity,
  type TableColumn,
} from "@/components/shared/DataTable";
import RecordFilters from "@/components/shared/RecordFilters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import SummaryCards from "@/components/shared/SummaryCards";
import useRecordFilters from "@/components/shared/useRecordFilters";
import { dateLabel } from "@/components/shared/formatters";
import { cases, statuses, type CaseRecord } from "./data";

const tones: Record<CaseRecord["status"], StatusTone> = {
  Active: "primary",
  Pending: "warning",
  "On hold": "muted",
  Closed: "success",
};
const columns: TableColumn<CaseRecord>[] = [
  {
    key: "case",
    header: "Case",
    render: (record) => <RecordIdentity id={record.id} name={record.name} />,
  },
  { key: "owner", header: "Case manager", render: (record) => record.owner },
  {
    key: "status",
    header: "Status",
    render: (record) => (
      <StatusBadge label={record.status} tone={tones[record.status]} />
    ),
  },
  {
    key: "date",
    header: "Review date",
    render: (record) => dateLabel(record.date),
    className: "whitespace-nowrap",
  },
];

export default function CaseManagement() {
  const records = cases;
  const filters = useRecordFilters(records, (record) => [
    record.id,
    record.caseId,
    record.name,
    record.owner,
  ]);
  return (
    <div className="space-y-6">
      <p>View, manage, and track cases across the platform.</p>
      <SummaryCards
        items={[
          { label: "Total cases", value: records.length },
          {
            label: "Active cases",
            value: records.filter((record) => record.status === "Active")
              .length,
          },
          {
            label: "Closed cases",
            value: records.filter((record) => record.status === "Closed")
              .length,
          },
        ]}
      />
      <DataTable
        label="Cases"
        caption="Sample platform cases"
        records={filters.filtered}
        columns={columns}
        total={records.length}
        pageSize={3}
        detailsBasePath="/case-management"
        toolbar={
          <RecordFilters
            label="Search cases"
            placeholder="Case ID, name, or case manager…"
            statuses={statuses}
            {...filters}
          />
        }
      />
    </div>
  );
}
