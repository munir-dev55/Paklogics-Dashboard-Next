"use client";

import Link from "next/link";
import Card from "@/components/shared/Card";
import { dateLabel } from "@/components/shared/formatters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import { getErrorMessage } from "@/lib/api-error";
import { useCase } from "@/hooks/useCases";
import { caseStatusLabel, type CaseLifecycleStatus } from "@/types/enums";

const tones: Record<CaseLifecycleStatus, StatusTone> = {
  INTAKE: "warning",
  SCHEDULED: "warning",
  ACTIVE: "primary",
  REOPENED: "primary",
  ON_HOLD: "muted",
  CLOSED: "success",
};

export default function CaseDetails({ caseId }: { caseId: string }) {
  const { data: record, isLoading, isError, error } = useCase(caseId);

  if (isLoading) {
    return <Card className="min-h-[240px] p-6" />;
  }

  if (isError || !record) {
    return (
      <Card className="p-6">
        <p className="text-error">{getErrorMessage(error, "Case not found.")}</p>
        <Link
          href="/case-management"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to cases
        </Link>
      </Card>
    );
  }

  const managerName = record.caseManager
    ? `${record.caseManager.firstName} ${record.caseManager.lastName}`.trim() ||
      record.caseManager.email
    : "—";

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-dark-5">Case ID</p>
          <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
            {record.caseNumber}
          </h2>
        </div>
        <StatusBadge
          label={caseStatusLabel(record.lifecycleStatus)}
          tone={tones[record.lifecycleStatus]}
        />
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        <Detail label="Case" value={record.title} />
        <Detail label="Case manager" value={managerName} />
        <Detail label="Status" value={caseStatusLabel(record.lifecycleStatus)} />
        <Detail label="Review date" value={dateLabel(record.updatedAt)} />
        <Detail label="Type" value={record.caseType || "—"} />
        <Detail label="Jurisdiction" value={record.jurisdiction || "—"} />
      </dl>
      <Link
        href="/case-management"
        className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to cases
      </Link>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-dark-5">{label}</dt>
      <dd className="mt-1 font-medium text-dark dark:text-white">{value}</dd>
    </div>
  );
}
