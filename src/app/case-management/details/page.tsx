import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CaseDetailsPageClient from "@/components/CaseManagement/CaseDetailsPageClient";

export const metadata: Metadata = { title: "FedArb ADR | Case Details" };

export default function CaseDetailsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Case Details"
        parents={[{ label: "Case Management", href: "/case-management" }]}
      />
      <Suspense fallback={null}>
        <CaseDetailsPageClient />
      </Suspense>
    </DefaultLayout>
  );
}
