import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserDetailsPageClient from "@/components/Users/UserDetailsPageClient";

export const metadata: Metadata = { title: "FedArb ADR | User Details" };

export default function UserDetailsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb
        pageName="User Details"
        parents={[{ label: "Users", href: "/users" }]}
      />
      <Suspense fallback={null}>
        <UserDetailsPageClient />
      </Suspense>
    </DefaultLayout>
  );
}
