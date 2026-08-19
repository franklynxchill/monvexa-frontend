"use client";

import { useEffect, useState } from "react";
import Header from "@/component/Header";
import Navbar from "@/component/Navbar";
import Siderbar from "@/component/Siderbar";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ==========================================
// TYPES
//
// NOTE: this shape is inferred from what's rendered on the analytics
// page, since no analytics.controller.ts was shared. If your actual
// endpoint returns something different, adjust these types and the
// unwrap logic in fetchAnalytics to match — everything downstream
// just reads from `analytics`.
// ==========================================

type DateRange = "3m" | "6m" | "12m" | "ytd";

type SummaryMetric = {
  value: number;
  changePercent: number;
};

type AnalyticsSummary = {
  avgMonthlyIncome: SummaryMetric;
  avgMonthlyExpenses: SummaryMetric;
  avgProfitMargin: SummaryMetric;
  growthRate: {
    value: number;
    label: string;
  };
};

type MonthlyTrendPoint = {
  month: string;
  income: number;
  expenses: number;
};

type ProfitTrendPoint = {
  month: string;
  profit: number;
};

type ExpenseCategorySlice = {
  category: string;
  percentage: number;
  color?: string;
};

type WeeklyCashFlowPoint = {
  week: string;
  value: number;
};

type IncomeSourcePoint = {
  source: string;
  amount: number;
};

type AnalyticsData = {
  summary: AnalyticsSummary;
  incomeExpenseTrend: MonthlyTrendPoint[];
  profitTrend: ProfitTrendPoint[];
  expenseByCategory: ExpenseCategorySlice[];
  weeklyCashFlow: WeeklyCashFlowPoint[];
  incomeBySource: IncomeSourcePoint[];
};

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "12m", label: "Last 12 Months" },
  { value: "ytd", label: "Year to Date" },
];

const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

function formatMoney(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function changeClass(value: number) {
  return value >= 0 ? "text-green-600" : "text-red-500";
}

function formatChange(value: number) {
  return `${value >= 0 ? "+" : ""}${value}% vs last period`;
}

// Builds a `conic-gradient(...)` value from a list of category slices,
// e.g. "color1 0deg 90deg, color2 90deg 200deg, ...". Slices with 0%
// are skipped so they don't render as a zero-width sliver.
function buildConicGradient(slices: ExpenseCategorySlice[]) {
  let cursor = 0;
  const stops: string[] = [];

  slices.forEach((slice, index) => {
    if (slice.percentage <= 0) return;

    const color = slice.color || PIE_COLORS[index % PIE_COLORS.length];
    const start = cursor;
    const end = cursor + slice.percentage * 3.6; // percentage -> degrees

    stops.push(`${color} ${start}deg ${end}deg`);
    cursor = end;
  });

  return stops.join(", ");
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("6m");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics?range=${range}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch analytics: ${res.status}`);
        }

        const data = await res.json();

        // Same envelope convention as the rest of this app's controllers:
        // { message, data: {...} }. Fall back to the raw payload in case
        // this endpoint doesn't wrap it, rather than assuming either way.
        const payload: AnalyticsData | undefined = data?.data ?? data;

        if (!payload || typeof payload !== "object" || !("summary" in payload)) {
          throw new Error("Unexpected analytics response shape");
        }

        setAnalytics(payload);
      } catch (err) {
        console.error("FETCH ANALYTICS:", err);
        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="relative md:flex">
          <Siderbar />
          <div className="px-4 mt-6 mb-36 space-y-3 lg:absolute lg:left-84 lg:top-20 lg:w-[76.3%]">
            <div className="flex items-center justify-center h-[70vh]">
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div>
        <Header />
        <div className="relative md:flex">
          <Siderbar />
          <div className="px-4 mt-6 mb-36 space-y-3 lg:absolute lg:left-84 lg:top-20 lg:w-[76.3%]">
            <div className="flex items-center justify-center h-[70vh]">
              <p className="text-red-500">
                {error || "No analytics data available."}
              </p>
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  const {
    summary,
    incomeExpenseTrend,
    profitTrend,
    expenseByCategory,
    weeklyCashFlow,
    incomeBySource,
  } = analytics;

  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />

        <section className="content">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-y-5">
            <div className="w-full">
              <h1>Analytics</h1>
              <p>Deep insights into your financial performance</p>
            </div>

            <div className="w-full md:w-[20%] text-center bg-card rounded-2xl border border-primary">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as DateRange)}
                className="w-full p-4 outline-0 bg-transparent"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ================================== */}
          {/* SUMMARY CARDS */}
          {/* ================================== */}

          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            {/* Avg Monthly Income */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Avg Monthly Income</p>
              <h2 className="text-2xl font-bold mt-2">
                {formatMoney(summary.avgMonthlyIncome.value)}
              </h2>
              <p
                className={`text-sm font-semibold mt-2 ${changeClass(
                  summary.avgMonthlyIncome.changePercent
                )}`}
              >
                {formatChange(summary.avgMonthlyIncome.changePercent)}
              </p>
            </div>

            {/* Avg Monthly Expenses */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Avg Monthly Expenses</p>
              <h2 className="text-2xl font-bold mt-2">
                {formatMoney(summary.avgMonthlyExpenses.value)}
              </h2>
              <p
                className={`text-sm font-semibold mt-2 ${changeClass(
                  summary.avgMonthlyExpenses.changePercent
                )}`}
              >
                {formatChange(summary.avgMonthlyExpenses.changePercent)}
              </p>
            </div>

            {/* Avg Profit Margin */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Avg Profit Margin</p>
              <h2 className="text-2xl font-bold mt-2">
                {summary.avgProfitMargin.value}%
              </h2>
              <p
                className={`text-sm font-semibold mt-2 ${changeClass(
                  summary.avgProfitMargin.changePercent
                )}`}
              >
                {formatChange(summary.avgProfitMargin.changePercent)}
              </p>
            </div>

            {/* Growth Rate */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Growth Rate</p>
              <h2 className="text-2xl font-bold mt-2">
                {summary.growthRate.value >= 0 ? "+" : ""}
                {summary.growthRate.value}%
              </h2>
              <p className="text-sm font-semibold mt-2 text-green-600">
                {summary.growthRate.label}
              </p>
            </div>
          </div>

          {/* ================================== */}
          {/* INCOME VS EXPENSES TREND */}
          {/* ================================== */}

          <div className="rounded-2xl bg-card border border-border p-8 mt-10">
            <div>
              <h3 className="font-bold">Income vs Expenses Trend</h3>
            </div>

            <div className="mt-10 w-full h-80">
              {incomeExpenseTrend.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No data for this period.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeExpenseTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => formatMoney(Number(value))}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ================================== */}
          {/* PROFIT TREND + EXPENSE BY CATEGORY */}
          {/* ================================== */}

          <div className="flex flex-col md:flex-row gap-6 w-full mt-10">
            <div className="rounded-2xl bg-card border border-border p-8 md:w-1/2">
              <div>
                <h3 className="font-bold">Profit Trend</h3>
              </div>

              <div className="mt-10 w-full h-70">
                {profitTrend.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No data for this period.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatMoney(Number(value))}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-8 md:w-1/2">
              <div>
                <h3 className="font-bold">Expense by Category</h3>
              </div>

              <div className="mt-10 w-full">
                {expenseByCategory.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No expenses for this period.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center">
                    {/* Plain CSS circle chart — each slice is a segment of
                        a conic-gradient built from cumulative percentages,
                        no charting library involved. */}
                    <div
                      className="relative w-44 h-44 rounded-full shrink-0"
                      style={{
                        background: `conic-gradient(${buildConicGradient(
                          expenseByCategory
                        )})`,
                      }}
                    >
                      <div className="absolute inset-[18%] rounded-full bg-card flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {expenseByCategory.length}{" "}
                          {expenseByCategory.length === 1
                            ? "category"
                            : "categories"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      {expenseByCategory.map((entry, index) => (
                        <div
                          key={entry.category}
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  entry.color ||
                                  PIE_COLORS[index % PIE_COLORS.length],
                              }}
                            />
                            <span className="font-medium">
                              {entry.category}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {entry.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================== */}
          {/* WEEKLY CASH FLOW + INCOME BY SOURCE */}
          {/* ================================== */}

          <div className="flex flex-col md:flex-row gap-6 w-full mt-10">
            <div className="rounded-2xl bg-card border border-border p-8 md:w-1/2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Weekly Cash Flow</h3>
              </div>

              <div className="mt-10 w-full h-70">
                {weeklyCashFlow.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No data for this period.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyCashFlow}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatMoney(Number(value))}
                      />
                      <Bar dataKey="value" name="Cash Flow" radius={[6, 6, 0, 0]}>
                        {weeklyCashFlow.map((entry) => (
                          <Cell
                            key={entry.week}
                            fill={entry.value >= 0 ? "#16a34a" : "#ef4444"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-8 md:w-1/2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Income by Source</h3>
              </div>

              <div className="mt-10 w-full h-70">
                {incomeBySource.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No income for this period.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incomeBySource} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="source" type="category" width={90} />
                      <Tooltip
                        formatter={(value: any) => formatMoney(Number(value))}
                      />
                      <Bar
                        dataKey="amount"
                        name="Income"
                        fill="#2563eb"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Navbar />
    </div>
  );
}