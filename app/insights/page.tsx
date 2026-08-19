"use client";

import Navbar from "@/component/Navbar";
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type BreakdownItem = {
  category: string;
  amount: number;
  percentage: number;
};

type MonthlyTrendItem = {
  month: string;
  income: number;
  expense: number;
};

type ProfitTrendItem = {
  period: string;
  income: number;
  expense: number;
  profit: number;
};

type WeeklyComparisonItem = {
  period: string;
  income: number;
  expense: number;
};

type InsightsData = {
  expenseBreakdown: BreakdownItem[];
  incomeSources: BreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
  profitTrend: ProfitTrendItem[];
  weeklyComparison: WeeklyComparisonItem[];
};

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

export default function Page() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================
  // FORMAT MONEY
  // =========================
  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // =========================
  // PROFIT CHANGE %
  // =========================
  const getProfitChange = () => {
    if (
      !insights ||
      insights.profitTrend.length < 2
    ) {
      return 0;
    }

    const first =
      insights.profitTrend[0]?.profit || 0;

    const last =
      insights.profitTrend[
        insights.profitTrend.length - 1
      ]?.profit || 0;

    if (first === 0) return 0;

    return Math.round(
      ((last - first) / first) * 100
    );
  };

  // =========================
  // FETCH API
  // =========================
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/insights`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        setInsights({
          expenseBreakdown:
            data.expenseBreakdown || [],

          incomeSources:
            data.incomeSources || [],

          monthlyTrend:
            data.monthlyTrend || [],

          profitTrend:
            data.profitTrend || [],

          weeklyComparison:
            data.weeklyComparison || [],
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchInsights();
  }, []);

  if (!mounted || !insights) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="px-4 pb-28 bg-gray-50 min-h-screen">
      <main className="mt-4 space-y-7">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Track your income and expenses
          </p>
        </div>

        {/* ================================= */}
        {/* EXPENSE BREAKDOWN */}
        {/* ================================= */}
        <div className="bg-card rounded-3xl border p-5">

          <h2 className="text-xl font-bold mb-5">
            Expense Breakdown
          </h2>

          <div className="w-full h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={
                    insights.expenseBreakdown
                  }
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {insights.expenseBreakdown.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-6">

            {insights.expenseBreakdown.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">

                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[
                            index % COLORS.length
                          ],
                      }}
                    />

                    <p className="font-medium">
                      {item.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      {formatAmount(
                        item.amount
                      )}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {item.percentage}%
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* INCOME SOURCES */}
        {/* ================================= */}
        <div className="bg-card rounded-3xl border p-5">

          <h2 className="text-xl font-bold mb-5">
            Income Sources
          </h2>

          <div className="space-y-5">

            {insights.incomeSources.map(
              (item, index) => (
                <div key={index}>

                  <div className="flex items-center justify-between mb-2">

                    <p className="font-medium">
                      {item.category}
                    </p>

                    <div className="flex items-center gap-3">
                      <p className="font-bold text-green-600">
                        {formatAmount(
                          item.amount
                        )}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* PROFIT TREND */}
        {/* ================================= */}
        <div className="bg-card rounded-3xl border p-5">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-bold">
                Profit Trend
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Weekly performance
              </p>
            </div>

            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              +{getProfitChange()}%
            </div>
          </div>

          <div className="relative w-full h-80 min-h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={insights.profitTrend}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="period" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22C55E"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================================= */}
        {/* WEEKLY COMPARISON */}
        {/* ================================= */}
        <div className="bg-card rounded-3xl border p-5">
          <h2 className="text-xl font-bold mb-5">
          Weekly Comparison
          </h2>

          <div className="relative w-full h-80 min-h-80">
            <ResponsiveContainer
            width="100%"
            height="100%"
            >
            <BarChart
            data={insights.weeklyComparison}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="period" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="income"
              fill="#22C55E"
              radius={[10, 10, 0, 0]}
            />

            <Bar
              dataKey="expense"
              fill="#EF4444"
              radius={[10, 10, 0, 0]}
            />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================================= */}
        {/* MONTHLY TREND */}
        {/* ================================= */}
        <div className="bg-card rounded-3xl border p-5">

          <h2 className="text-xl font-bold mb-5">
            Monthly Trends
          </h2>

          <div className="relative w-full h-80 min-h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={insights.monthlyTrend}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22C55E"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
}