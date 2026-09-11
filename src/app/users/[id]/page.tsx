import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { users } from "@/components/Users/data";

export const metadata: Metadata = { title: "FedArb ADR | User Details" };

export function generateStaticParams() {
  return users.map(({ id }) => ({ id: String(id) }));
}

export default function UserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = users.find(({ id }) => String(id) === params.id);
  if (!user) notFound();

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="User Details"
        parents={[{ label: "Users", href: "/users" }]}
      />
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-dark-5">User ID: {user.id}</p>
            <h2 className="mt-1 break-words text-xl font-semibold text-primary dark:text-white">
              {user.name}
            </h2>
          </div>
          <StatusBadge
            label={user.status}
            tone={user.status === "Active" ? "success" : "error"}
          />
        </div>
        <dl className="grid gap-6 sm:grid-cols-2">
          {[
            ["Firm / Company", user.firmCompany],
            ["Role", user.role],
            ["Email", user.email],
            ["Phone", user.phone],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-sm text-dark-5">{label}</dt>
              <dd className="mt-1 break-words font-medium text-dark dark:text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          href="/users"
          className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Back to users
        </Link>
      </Card>
    </DefaultLayout>
  );
}
