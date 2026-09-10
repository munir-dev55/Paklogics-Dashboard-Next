import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  invoices,
  type InvoiceRecord,
} from "@/components/BillingInvoices/data";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Card from "@/components/shared/Card";
import { dateLabel, money } from "@/components/shared/formatters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";

export const metadata: Metadata = { title: "FedArb ADR | Invoice Details" };

const statusTones: Record<InvoiceRecord["status"], StatusTone> = {
  Outstanding: "primary",
  Paid: "success",
  Overdue: "error",
};

export function generateStaticParams() {
  return invoices.map(({ id }) => ({ id }));
}

export default function InvoiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const record = invoices.find(({ id }) => id === params.id);
  if (!record) notFound();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Invoice Details"
        parents={[{ label: "Billing & Invoices", href: "/billing-invoices" }]}
      />
      <Card className="p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-dark-5">Invoice ID</p>
            <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
              {record.id}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              label={record.status}
              tone={statusTones[record.status]}
            />
          </div>
        </div>
        <dl className="grid gap-6 sm:grid-cols-2">
          <Detail label="Case" value={record.name} />
          <Detail label="Case ID" value={record.caseId} />
          <Detail label="Billed to" value={record.owner} />
          <Detail label="Status" value={record.status} />
          <Detail label="Due date" value={dateLabel(record.date)} />
          <Detail label="Amount (USD)" value={money(record.amount)} />
        </dl>
        <Link
          href="/billing-invoices"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to invoices
        </Link>
      </Card>
    </DefaultLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-dark-5">{label}</dt>
      <dd className="mt-1 font-medium text-dark dark:text-white">{value}</dd>
    </div>
  );
}
