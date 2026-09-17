import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AuditLogDetailsPageClient from "@/components/AuditLogs/AuditLogDetailsPageClient";

export const metadata: Metadata = { title: "FedArb ADR | Audit Log Details" };

export default function AuditLogDetailsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Audit Log Details"
        parents={[{ label: "Audit Logs", href: "/audit-logs" }]}
      />
      <Suspense fallback={null}>
        <AuditLogDetailsPageClient />
      </Suspense>
    </DefaultLayout>
  );
}
