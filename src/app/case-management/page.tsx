import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CaseManagement from "@/components/CaseManagement";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "FedArb ADR | Case Management",
};

export default function CaseManagementPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Case Management" />
      <CaseManagement />
    </DefaultLayout>
  );
}
