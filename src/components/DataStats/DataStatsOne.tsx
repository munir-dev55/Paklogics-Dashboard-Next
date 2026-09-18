"use client";

import type { DashboardKpis } from "@/types/dashboard";

type StatsIconName = "cases" | "users" | "invoices" | "blocked";

type DataStatItem = {
  icon: StatsIconName;
  color: string;
  title: string;
  value: string;
};

const numberLabel = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

function buildStats(kpis?: DashboardKpis): DataStatItem[] {
  return [
    {
      icon: "users",
      color: "#18BFFF",
      title: "Total Users",
      value: numberLabel(kpis?.totalUsers ?? 0),
    },
    {
      icon: "blocked",
      color: "var(--color-error)",
      title: "Blocked Users",
      value: numberLabel(kpis?.blockedUsers ?? 0),
    },
    {
      icon: "cases",
      color: "#2563EA",
      title: "Total Cases",
      value: numberLabel(kpis?.totalCases ?? 0),
    },
    {
      icon: "invoices",
      color: "#8155FF",
      title: "Total Invoices",
      value: numberLabel(kpis?.totalInvoices ?? 0),
    },
  ];
}

export default function DataStatsOne({ kpis }: { kpis?: DashboardKpis }) {
  const dataStatsList = buildStats(kpis);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {dataStatsList.map((item) => (
        <div
          key={item.title}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
        >
          <div
            className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            <StatsIcon type={item.icon} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {item.value}
              </h4>
              <span className="text-body-sm font-medium">{item.title}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsIcon({ type }: { type: StatsIconName }) {
  const commonProps = {
    "aria-hidden": true,
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-white",
  };

  if (type === "cases") {
    return (
      <svg {...commonProps}>
        <path d="M3 7.5h6l2-2h10v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11Z" />
        <path d="M3 9h18M8 13h8M8 16h5" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16.5 14a4.5 4.5 0 0 1 4 4.5" />
      </svg>
    );
  }

  if (type === "invoices") {
    return (
      <svg {...commonProps}>
        <path d="M6 2.5h8l4 4v15H6v-19Z" />
        <path d="M14 2.5v4h4M9 11h6M9 15h6M9 18h4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 9-5.2" />
      <circle cx="17" cy="17" r="4" />
      <path d="m14.2 14.2 5.6 5.6" />
    </svg>
  );
}
