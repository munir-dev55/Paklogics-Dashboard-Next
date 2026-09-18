"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { dateTimeLabel } from "@/components/shared/formatters";
import {
  humanizeAction,
  permissionModuleLabel,
  roleLabel,
} from "@/types/enums";
import type { AdminAuditLogDetail } from "@/types/audit-logs";

function actorDisplayName(record: AdminAuditLogDetail) {
  if (!record.actor) return "Unknown";
  const name =
    `${record.actor.firstName ?? ""} ${record.actor.lastName ?? ""}`.trim();
  return name || record.actor.email || "Unknown";
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-secondary dark:bg-dark-2 ${className}`}
    />
  );
}

function AuditLogDetailsSkeleton() {
  return (
    <div className="mt-6" aria-busy="true" aria-label="Loading audit details">
      <dl className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-5 w-full max-w-[220px]" />
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-5 w-full" />
        </div>
      </dl>
      <div className="mt-6 space-y-3">
        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-3 w-10" />
          </div>
        </div>
        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  const [open, setOpen] = useState(false);
  const hasValue = value !== null && value !== undefined;

  return (
    <div className="rounded-lg border border-stroke dark:border-dark-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-dark dark:text-white"
      >
        {label}
        <span className="text-dark-5">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <pre className="overflow-x-auto border-t border-stroke bg-surface-secondary px-4 py-3 text-xs text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
          {hasValue ? JSON.stringify(value, null, 2) : "null"}
        </pre>
      )}
    </div>
  );
}

export default function AuditLogDetailsModal({
  record,
  isLoading,
  isError,
  errorMessage,
  onClose,
}: {
  record: AdminAuditLogDetail | undefined;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[99990] flex items-center justify-center bg-[#001842]/55 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-log-details-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-stroke bg-white px-6 py-6 shadow-lg dark:border-stroke-dark dark:bg-gray-dark sm:px-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2
              id="audit-log-details-title"
              className="text-xl font-semibold text-primary dark:text-white"
            >
              Audit event
            </h2>
            {isLoading ? (
              <SkeletonBlock className="mt-2 h-4 w-64 max-w-full" />
            ) : (
              <p className="mt-1 break-all text-sm text-dark-5">
                {record?.id ?? "—"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-dark-5 transition hover:bg-surface-muted hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {isLoading && <AuditLogDetailsSkeleton />}

        {!isLoading && isError && (
          <p className="mt-6 text-sm font-medium text-error">
            {errorMessage || "Audit log not found."}
          </p>
        )}

        {!isLoading && record && (
          <>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail label="Action" value={humanizeAction(record.action)} />
              <Detail
                label="Module"
                value={permissionModuleLabel(record.module)}
              />
              <Detail
                label="Timestamp"
                value={dateTimeLabel(record.createdAt)}
              />
              <Detail
                label="Actor role"
                value={
                  record.actingUserRoleSnapshot
                    ? roleLabel(record.actingUserRoleSnapshot)
                    : "Unknown"
                }
              />
              <Detail label="Actor" value={actorDisplayName(record)} />
              <Detail label="Email" value={record.actor?.email || "—"} />
              <Detail label="Actor user ID" value={record.actor?.id || "—"} />
              <Detail label="Record type" value={record.affectedRecordType} />
              <Detail
                label="Record ID"
                value={record.affectedRecordId}
                className="sm:col-span-2"
              />
              {record.reason && (
                <Detail
                  label="Reason"
                  value={record.reason}
                  className="sm:col-span-2"
                />
              )}
              {record.ipAddress && (
                <Detail label="IP address" value={record.ipAddress} />
              )}
              {record.deviceInfo && (
                <Detail label="Device" value={record.deviceInfo} />
              )}
            </dl>

            <div className="mt-6 space-y-3">
              <JsonBlock label="Previous value" value={record.previousValue} />
              <JsonBlock label="New value" value={record.newValue} />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Detail({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm text-dark-5">{label}</dt>
      <dd className="mt-1 break-all font-medium text-dark dark:text-white">
        {value}
      </dd>
    </div>
  );
}
