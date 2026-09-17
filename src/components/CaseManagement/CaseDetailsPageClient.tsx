"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/shared/Card";
import CaseDetails from "@/components/CaseManagement/CaseDetails";

export default function CaseDetailsPageClient() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("id") ?? "";

  if (!caseId) {
    return (
      <Card className="p-6">
        <p className="text-error">Case id is missing.</p>
      </Card>
    );
  }

  return <CaseDetails caseId={caseId} />;
}
