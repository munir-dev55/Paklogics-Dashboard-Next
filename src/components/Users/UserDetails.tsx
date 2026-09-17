"use client";

import Link from "next/link";
import Card from "@/components/shared/Card";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";
import { getErrorMessage } from "@/lib/api-error";
import { useUser } from "@/hooks/useUsers";
import { USER_STATUS_LABELS, roleLabel, type UserStatus } from "@/types/enums";

const statusTones: Record<UserStatus, StatusTone> = {
  ACTIVE: "success",
  INVITED: "warning",
  INVITE_EXPIRED: "muted",
  DEACTIVATED: "error",
  LOCKED: "error",
};

export default function UserDetails({ userId }: { userId: string }) {
  const { data: user, isLoading, isError, error } = useUser(userId);

  if (isLoading) {
    return <Card className="min-h-[240px] p-4 sm:p-6" />;
  }

  if (isError || !user) {
    return (
      <Card className="p-4 sm:p-6">
        <p className="text-error">{getErrorMessage(error, "User not found.")}</p>
        <Link
          href="/users"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to users
        </Link>
      </Card>
    );
  }

  const name = `${user.firstName} ${user.lastName}`.trim() || user.email;

  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-dark-5">User ID: {user.id}</p>
          <h2 className="mt-1 break-words text-xl font-semibold text-primary dark:text-white">
            {name}
          </h2>
        </div>
        <StatusBadge
          label={USER_STATUS_LABELS[user.status]}
          tone={statusTones[user.status]}
        />
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        {[
          ["Role", roleLabel(user.role?.name)],
          ["User type", user.userType === "INTERNAL" ? "Internal" : "External"],
          ["Email", user.email],
          ["Phone", user.phone || "—"],
          ["Job title", user.jobTitle || "—"],
          ["Deactivation reason", user.deactivationReason || "—"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-sm text-dark-5">{label}</dt>
            <dd className="mt-1 break-words font-medium text-dark dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href="/users"
        className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to users
      </Link>
    </Card>
  );
}
