"use client";

import Header from "@/component/Header";
import Navbar from "@/component/Navbar";
import Siderbar from "@/component/Siderbar";
import { useCurrency } from "@/context/CurrencyContext";

import Link from "next/link";

import { useEffect, useState } from "react";

import {
  FiArrowDown,
  FiArrowUp,
  FiDollarSign,
  FiPlus,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";

import { GoTag } from "react-icons/go";

import { PiCarProfile, PiSuitcase } from "react-icons/pi";

import { IoMdTrendingUp } from "react-icons/io";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ==========================================
// TYPES
// ==========================================

type Category = {
  _id?: string;
  name: string;
  icon?: string;
  color?: string;
};

type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: Category | null;
  date: string;
  note: string;
};

type RevenueOverview = {
  month: string;
  revenue: number;
  expenses: number;
};

type ExpenseBreakdown = {
  category: string;
  amount: number;
  percentage: number;
  icon?: string;
  color?: string;
};

type BudgetProgress = {
  _id: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  icon?: string;
  color?: string;
};

type DashboardData = {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    cashFlow: number;

    revenueChange: number;
    expenseChange: number;
    profitChange: number;
    cashFlowChange: number;
  };

  revenueOverview: RevenueOverview[];

  expenseBreakdown: ExpenseBreakdown[];

  recentTransactions: Transaction[];

  budgetProgress: BudgetProgress[];
};

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

// ==========================================
// PAGE
// ==========================================

export default function Page() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Currency comes from context now — shared with every other page,
  // not a local hardcoded ₦. Must be called here, before any early
  // returns below, since hooks can't run conditionally.
  const { formatMoney } = useCurrency();

  // ==========================================
  // ICON MAP
  // ==========================================

  const iconMap: Record<string, any> = {
    shopping: FiShoppingBag,
    transport: PiCarProfile,
    rent: FiDollarSign,
    salary: FiDollarSign,
    freelance: PiSuitcase,
    investment: IoMdTrendingUp,
    other: GoTag,
  };

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch dashboard: ${res.status}`);
        }

        const data = await res.json();

        // Controllers in this app respond as { message, data: {...} }.
        // Unwrap that here so `dashboard` always ends up holding the
        // actual DashboardData shape the rest of this component expects,
        // instead of the { message, data } envelope.
        const payload: DashboardData | undefined = data?.data ?? data;

        if (
          !payload ||
          typeof payload !== "object" ||
          !("summary" in payload)
        ) {
          throw new Error("Unexpected dashboard response shape");
        }

        setDashboard(payload);
      } catch (error) {
        console.error("FETCH DASHBOARD:", error);

        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div>
        <Header />

        <div className="relative md:flex">
          <Siderbar />
          <div className="px-4 mt-6 mb-36 space-y-3 lg:absolute lg:left-84 lg:top-20 lg:w-[76.3%]">
            <div className="flex items-center justify-center h-[70vh]">
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !dashboard) {
    return (
      <div>
        <Header />

        <div className="relative md:flex">
          <Siderbar />
          <div className="px-4 mt-6 mb-36 space-y-3 lg:absolute lg:left-84 lg:top-20 lg:w-[76.3%]">
            <div className="flex items-center justify-center h-[70vh]">
              <p className="text-red-500">
                {error || "No dashboard data available."}
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
    revenueOverview,
    expenseBreakdown,
    recentTransactions,
    budgetProgress,
  } = dashboard;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // TIME AGO
  // ==========================================

  const timeAgo = (date: string) => {
    const now = new Date();
    const transactionDate = new Date(date);

    const difference = now.getTime() - transactionDate.getTime();

    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

  // ==========================================
  // PERCENTAGE COLOR
  // ==========================================

  const changeClass = (value: number, positiveIsGood = true) => {
    const isPositive = value >= 0;

    if (positiveIsGood ? isPositive : !isPositive) {
      return "text-green-600";
    }

    return "text-red-500";
  };

  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />

        <main className=" content">
          {/* ================================== */}
          {/* HEADER */}
          {/* ================================== */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>

              <p className="text-gray-500">
                Welcome back! Here's your financial overview
              </p>
            </div>

            <Link
              href="/new-transaction"
              className="
                bg-primary
                text-white
                rounded-2xl
                px-5
                py-3
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <FiPlus />
              Add Transaction
            </Link>
          </div>

          {/* ================================== */}
          {/* SUMMARY CARDS */}
          {/* ================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-gray-500">Total Revenue</p>

              <h2 className="text-2xl font-bold mt-3">
                {formatMoney(summary.totalRevenue)}
              </h2>

              <div
                className={`flex items-center gap-1 mt-3 text-sm font-semibold ${changeClass(
                  summary.revenueChange
                )}`}
              >
                {summary.revenueChange >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                {Math.abs(summary.revenueChange)}%
                <span className="text-gray-400 font-normal">
                  vs last month
                </span>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-gray-500">Total Expenses</p>

              <h2 className="text-2xl font-bold mt-3">
                {formatMoney(summary.totalExpenses)}
              </h2>

              <div
                className={`flex items-center gap-1 mt-3 text-sm font-semibold ${changeClass(
                  summary.expenseChange,
                  false
                )}`}
              >
                {summary.expenseChange >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                {Math.abs(summary.expenseChange)}%
                <span className="text-gray-400 font-normal">
                  vs last month
                </span>
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-gray-500">Net Profit</p>

              <h2 className="text-2xl font-bold mt-3">
                {formatMoney(summary.netProfit)}
              </h2>

              <div
                className={`flex items-center gap-1 mt-3 text-sm font-semibold ${changeClass(
                  summary.profitChange
                )}`}
              >
                {summary.profitChange >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                {Math.abs(summary.profitChange)}%
                <span className="text-gray-400 font-normal">
                  vs last month
                </span>
              </div>
            </div>

            {/* Cash Flow */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-gray-500">Cash Flow</p>

              <h2 className="text-2xl font-bold mt-3">
                {formatMoney(summary.cashFlow)}
              </h2>

              <div
                className={`flex items-center gap-1 mt-3 text-sm font-semibold ${changeClass(
                  summary.cashFlowChange
                )}`}
              >
                {summary.cashFlowChange >= 0 ? (
                  <FiArrowUp />
                ) : (
                  <FiArrowDown />
                )}
                {Math.abs(summary.cashFlowChange)}%
                <span className="text-gray-400 font-normal">
                  vs last month
                </span>
              </div>
            </div>
          </div>
          <div className=" flex flex-col md:flex-row items-center gap-7">
            {/* ================================== */}
            {/* REVENUE OVERVIEW */}
            {/* ================================== */}

            <div className="bg-card border border-border rounded-2xl p-5 w-full md:w-[70%]">
              <div className="mb-6">
                <h4 className="font-semibold">Revenue Overview</h4>

                <p className="text-sm text-gray-500">
                  Last 6 months performance
                </p>
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueOverview}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip
                      formatter={(value: any) => formatMoney(Number(value))}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-600" />
                  Revenue
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Expenses
                </div>
              </div>
            </div>

            {/* ================================== */}
            {/* EXPENSE BREAKDOWN  */}
            {/* ================================== */}
            <div className=" w-full md:w-[30%]">
              {/* Expense Breakdown */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="">
                  <div>
                    <h4 className="font-semibold text-center">
                      Expense Breakdown
                    </h4>

                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                </div>

                {expenseBreakdown.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No expenses this month.
                  </p>
                ) : (
                  <div className="space-y-5">
                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={3}
                          >
                            {expenseBreakdown.map((_, index) => (
                              <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            formatter={(value: any) =>
                              formatMoney(Number(value))
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 mt-6">
                      {expenseBreakdown.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />

                            <p className="font-medium">{item.category}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <p className="font-semibold">
                              {formatMoney(item.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-5">
            {/* ================================== */}
            {/* RECENT TRANSACTIONS */}
            {/* ================================== */}

            <div className="bg-card border border-border rounded-2xl p-5 w-full md:w-[70%]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-semibold">Recent Transactions</h4>

                  <p className="text-sm text-gray-500">
                    Your latest financial activity
                  </p>
                </div>

                <Link
                  href="/transactions"
                  className="text-primary text-sm font-semibold"
                >
                  View all
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <p className="text-gray-500 text-sm">No transactions yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => {
                    const iconKey = transaction.category?.icon || "other";

                    const Icon = iconMap[iconKey];

                    return (
                      <div
                        key={transaction._id}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            py-2
                          "
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                            {Icon && <Icon />}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {transaction.note || "No note"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {timeAgo(transaction.date)}
                            </p>
                          </div>
                        </div>

                        <p
                          className={`font-bold whitespace-nowrap ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatMoney(transaction.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Budget Progress */}
            {/* ================================== */}
            {/* BUDGET */}
            {/* ================================== */}
            <div className="bg-card border border-border rounded-2xl p-5 w-full md:w-[30%]">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="font-semibold">Budget Progress</h4>

                  <p className="text-sm text-gray-500">This month</p>
                </div>

                <Link
                  href="/budgets"
                  className="text-primary text-sm font-semibold"
                >
                  View all
                </Link>
              </div>

              {budgetProgress.length === 0 ? (
                <div className="text-sm text-gray-500">
                  <p>No budgets created for this month.</p>

                  <Link
                    href="/budgets"
                    className="text-primary font-semibold inline-block mt-2"
                  >
                    Create a budget
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {budgetProgress.slice(0, 4).map((budget) => (
                    <div key={budget._id}>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{budget.category}</p>

                        <p className="text-sm text-gray-500">
                          {formatMoney(budget.spent)} /{" "}
                          {formatMoney(budget.budget)}
                        </p>
                      </div>

                      <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            budget.percentage >= 100
                              ? "bg-red-500"
                              : budget.percentage >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(budget.percentage, 100)}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        {budget.percentage}% used
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* ================================== */}
              {/* FINANCIAL INSIGHT */}
              {/* ================================== */}

              <div className="bg-background border border-border rounded-2xl p-5 mt-7">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <FiTrendingUp className="text-xl" />
                  </div>

                  <div>
                    <h4 className="font-bold">Financial Insight</h4>

                    <p className="text-sm text-gray-500 mt-1">
                      {summary.profitChange >= 0
                        ? `Your net profit is ${Math.abs(
                            summary.profitChange
                          )}% higher than last month. Keep monitoring your income and expenses.`
                        : `Your net profit is ${Math.abs(
                            summary.profitChange
                          )}% lower than last month. Review your expenses and income to identify areas for improvement.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Navbar />
    </div>
  );
}
