"use client";

import { useState } from "react";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { getErrorMessage } from "@/lib/ui-error";
import { useDashboard } from "@/hooks/useDashboard";
import type { InvoicePeriod } from "@/types/dashboard";

export default function ECommerce() {
  const [invoicePeriod, setInvoicePeriod] =
    useState<InvoicePeriod>("monthly");
  const { data, isError, error } = useDashboard(invoicePeriod);

  return (
    <>
      {isError && (
        <p className="mb-4 rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error">
          {getErrorMessage(error, "Unable to load dashboard.")}
        </p>
      )}
      <DataStatsOne kpis={data?.kpis} />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne
          overview={data?.invoicesOverview}
          period={invoicePeriod}
          onPeriodChange={setInvoicePeriod}
        />
      </div>
    </>
  );
}
