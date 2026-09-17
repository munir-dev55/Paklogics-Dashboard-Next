"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/shared/Card";
import AuditLogDetails from "@/components/AuditLogs/AuditLogDetails";

export default function AuditLogDetailsPageClient() {
  const searchParams = useSearchParams();
  const logId = searchParams.get("id") ?? "";

  if (!logId) {
    return (
      <Card className="p-6">
        <p className="text-error">Audit log id is missing.</p>
      </Card>
    );
  }

  return <AuditLogDetails logId={logId} />;
}
