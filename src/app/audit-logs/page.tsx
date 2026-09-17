import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AuditLogs from "@/components/AuditLogs";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "FedArb ADR | Audit Logs",
};

export default function AuditLogsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Audit Logs" />
      <AuditLogs />
    </DefaultLayout>
  );
}
