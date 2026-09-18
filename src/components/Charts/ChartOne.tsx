"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import { money } from "@/components/shared/formatters";
import type {
  DashboardInvoicesOverview,
  InvoicePeriod,
} from "@/types/dashboard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PERIOD_OPTIONS = ["Monthly", "Yearly"] as const;

function periodLabel(period: InvoicePeriod) {
  return period === "yearly" ? "Yearly" : "Monthly";
}

function periodFromLabel(label: string): InvoicePeriod {
  return label === "Yearly" ? "yearly" : "monthly";
}

type Props = {
  overview?: DashboardInvoicesOverview;
  period: InvoicePeriod;
  onPeriodChange: (period: InvoicePeriod) => void;
};

const ChartOne = ({ overview, period, onPeriodChange }: Props) => {
  const categories = overview?.series.map((point) => point.label) ?? [];
  const series = [
    {
      name: "Received Amount",
      data: overview?.series.map((point) => point.receivedAmount) ?? [],
    },
    {
      name: "Due Amount",
      data: overview?.series.map((point) => point.dueAmount) ?? [],
    },
  ];

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#001842", "#2563eb"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      y: {
        formatter: (value) => money(value),
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value),
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Invoices Overview
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            Short by:
          </p>
          <DefaultSelectOption
            options={[...PERIOD_OPTIONS]}
            value={periodLabel(period)}
            onChange={(value) => onPeriodChange(periodFromLabel(value))}
          />
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">Received Amount</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {money(overview?.receivedAmount ?? 0)}
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">Due Amount</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {money(overview?.dueAmount ?? 0)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
