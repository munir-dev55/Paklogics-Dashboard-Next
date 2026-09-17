"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/shared/Card";
import UserDetails from "@/components/Users/UserDetails";

export default function UserDetailsPageClient() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") ?? "";

  if (!userId) {
    return (
      <Card className="p-4 sm:p-6">
        <p className="text-error">User id is missing.</p>
      </Card>
    );
  }

  return <UserDetails userId={userId} />;
}
