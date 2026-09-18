import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvoiceDetailsPageClient from "@/components/BillingInvoices/InvoiceDetailsPageClient";

export const metadata: Metadata = { title: "FedArb ADR | Invoice Details" };

export default function InvoiceDetailsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Invoice Details"
        parents={[{ label: "Billing & Invoices", href: "/billing-invoices" }]}
      />
      <Suspense fallback={null}>
        <InvoiceDetailsPageClient />
      </Suspense>
    </DefaultLayout>
  );
}
