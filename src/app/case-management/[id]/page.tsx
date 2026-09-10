import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { cases, type CaseRecord } from "@/components/CaseManagement/data";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Card from "@/components/shared/Card";
import { dateLabel } from "@/components/shared/formatters";
import StatusBadge, { type StatusTone } from "@/components/shared/StatusBadge";

export const metadata: Metadata = { title: "FedArb ADR | Case Details" };

const statusTones: Record<CaseRecord["status"], StatusTone> = {
  Active: "primary",
  Pending: "warning",
  "On hold": "muted",
  Closed: "success",
};

export function generateStaticParams() {
  return cases.map(({ id }) => ({ id }));
}

export default function CaseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const record = cases.find(({ id }) => id === params.id);
  if (!record) notFound();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="Case Details"
        parents={[{ label: "Case Management", href: "/case-management" }]}
      />
      <Card className="p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-dark-5">Case ID</p>
            <h2 className="mt-1 text-xl font-semibold text-primary dark:text-white">
              {record.id}
            </h2>
          </div>
          <StatusBadge
            label={record.status}
            tone={statusTones[record.status]}
          />
        </div>
        <dl className="grid gap-6 sm:grid-cols-2">
          <Detail label="Case" value={record.name} />
          <Detail label="Case manager" value={record.owner} />
          <Detail label="Status" value={record.status} />
          <Detail label="Review date" value={dateLabel(record.date)} />
        </dl>
        <Link
          href="/case-management"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to cases
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
