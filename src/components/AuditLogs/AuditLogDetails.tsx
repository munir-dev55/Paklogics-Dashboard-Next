"use client";

import Link from "next/link";
import Card from "@/components/shared/Card";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import { dateTimeLabel } from "@/components/shared/formatters";
import { auditLogs, type AuditStatus } from "./data";

const tones: Record<AuditStatus, StatusTone> = {
  Success: "success",
  Failed: "error",
  Warning: "warning",
};

export default function AuditLogDetails({ logId }: { logId: string }) {
  const record = auditLogs.find((log) => log.id === logId);

  if (!record) {
    return (
      <Card className="p-6">
        <p className="text-error">Audit log not found.</p>
        <Link
          href="/audit-logs"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to audit logs
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-dark-5">Log ID</p>
          <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
            {record.id}
          </h2>
        </div>
        <StatusBadge label={record.status} tone={tones[record.status]} />
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        <Detail label="Action" value={record.action} />
        <Detail label="Module" value={record.module} />
        <Detail label="Actor" value={record.actor} />
        <Detail label="Email" value={record.actorEmail} />
        <Detail label="Resource" value={record.resource} />
        <Detail label="Timestamp" value={dateTimeLabel(record.timestamp)} />
        <Detail label="IP address" value={record.ipAddress} />
        <Detail label="Status" value={record.status} />
      </dl>
      <div className="mt-6">
        <p className="text-sm text-dark-5">Details</p>
        <p className="mt-1 font-medium text-dark dark:text-white">{record.details}</p>
      </div>
      <Link
        href="/audit-logs"
        className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to audit logs
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
