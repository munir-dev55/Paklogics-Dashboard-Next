"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/shared/Card";
import InvoiceDetails from "@/components/BillingInvoices/InvoiceDetails";

export default function InvoiceDetailsPageClient() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id") ?? "";

  if (!invoiceId) {
    return (
      <Card className="p-6">
        <p className="text-error">Invoice id is missing.</p>
      </Card>
    );
  }

  return <InvoiceDetails invoiceId={invoiceId} />;
}
