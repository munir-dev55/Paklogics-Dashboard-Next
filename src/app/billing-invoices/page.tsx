import type { Metadata } from "next";
import BillingInvoices from "@/components/BillingInvoices";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "FedArb ADR | Billing & Invoices",
};

export default function BillingInvoicesPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Billing & Invoices" />
      <BillingInvoices />
    </DefaultLayout>
  );
}
