"use client";

import Navbar from "@/component/Navbar";
import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

import { LuSearch } from "react-icons/lu";
import {
  FiShoppingBag,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";

import { GoHome, GoTag } from "react-icons/go";
import {
  PiCarProfile,
  PiSuitcase,
} from "react-icons/pi";

import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";

  category: {
    _id: string;
    name: string;
    icon: string;
  } | null;

  date: string;
  note: string;

  status?: "completed" | "pending";
};

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { formatMoney } = useCurrency();

  // ==================================
  // ICON MAP
  // ==================================

  const iconMap: Record<string, any> = {
    shopping: FiShoppingBag,
    transport: PiCarProfile,
    rent: GoHome,
    salary: FiDollarSign,
    freelance: PiSuitcase,
    investment: IoMdTrendingUp,
    other: GoTag,
  };

  // ==================================
  // FETCH TRANSACTIONS
  // ==================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5200/api/transactions",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch transactions: ${res.status}`
          );
        }

        const data = await res.json();

        setTransactions(data?.data ?? []);
      } catch (error) {
        console.error(
          "Failed to fetch transactions:",
          error
        );

        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  // ==================================
  // FILTER TRANSACTIONS
  // ==================================

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.note
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction.category?.name
          ?.toLowerCase()
          .includes(searchValue);

      const matchesType =
        !typeFilter ||
        transaction.type === typeFilter;

      return matchesSearch && matchesType;
    }
  );

  // ==================================
  // TOTALS
  // ==================================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const netBalance =
    totalIncome - totalExpenses;

  // ==================================
  // DATE FORMAT
  // ==================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================
  // STATUS
  // ==================================

  const getStatus = (
    transaction: Transaction
  ) => {
    return transaction.status || "completed";
  };

  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />

        <main className=" content">

          {/* ==================================
              PAGE HEADER
          ================================== */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-5">
            <div>
              <h1>Transactions</h1>

              <p>
                Manage and track all your financial
                transactions
              </p>
            </div>

            <Link
              href="/new-transaction"
              className="py-3 px-4 rounded-2xl bg-primary text-white flex items-center justify-center gap-x-3"
            >
              <FiPlus className="text-xl" />

              Add Transaction
            </Link>
          </div>

          {/* ==================================
              SEARCH + FILTER
          ================================== */}

          <div className="bg-card px-8 py-7 rounded-2xl mt-7 flex flex-col lg:flex-row items-center gap-3">

            {/* Search */}

            <div className="bg-muted py-3 px-4 w-full rounded-lg flex items-center gap-x-2 lg:w-3/5">
              <LuSearch />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full outline-none bg-transparent"
                placeholder="Search transaction..."
              />
            </div>

            {/* Type */}

            <div className="bg-muted rounded-lg py-3 px-4 w-full lg:w-2/5">
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
                className="w-full outline-0 bg-transparent"
              >
                <option value="">
                  All Types
                </option>

                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>
              </select>
            </div>

            {/* Export */}

            <button
              type="button"
              className="bg-muted rounded-lg flex items-center justify-center gap-x-1 py-3 w-full lg:w-2/5 font-semibold"
            >
              <MdOutlineFileDownload className="text-xl" />

              Export
            </button>
          </div>

          {/* ==================================
              SUMMARY
          ================================== */}

          <div className="flex flex-col lg:flex-row gap-4 mt-6">

            {/* Total Income */}

            <div className="flex-1 bg-card border  border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">
                Total Income
              </p>

              <h2 className="text-xl font-bold mt-4 text-green-600">
                +
                {formatMoney(totalIncome)}
              </h2>
            </div>

            {/* Total Expenses */}

            <div className="flex-1 bg-card border  border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">
                Total Expenses
              </p>

              <h2 className="text-xl font-bold mt-4 text-red-500">
                -{formatMoney(totalExpenses)}
              </h2>
            </div>

            {/* Net Balance */}

            <div className="flex-1 bg-card border  border-border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">
                Net Balance
              </p>

              <h2
                className={`text-xl font-bold mt-4 ${
                  netBalance >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {`${netBalance >= 0 ? "+" : "-"}${formatMoney(Math.abs(netBalance))}`}
              </h2>
            </div>
          </div>

          {/* =====================================================
              DESKTOP TABLE
              ===================================================== */}

          <div className="hidden md:block mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead>
                  <tr className="bg-border border-b-2 border-border">

                    <th className="px-5 py-5 text-left text-sm font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-5 text-left text-sm font-semibold">
                      Description
                    </th>

                    <th className="px-5 py-5 text-left text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-5 text-center text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-5 text-right text-sm font-semibold">
                      Amount
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {filteredTransactions.length === 0 ? (

                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>

                  ) : (

                    filteredTransactions.map(
                      (transaction) => {

                        const iconKey =
                          transaction.category?.icon ??
                          "other";

                        const Icon =
                          iconMap[iconKey];

                        const status =
                          getStatus(transaction);

                        return (
                          <tr
                            key={transaction._id}
                            className="border-b border-border last:border-b-0 hover:bg-muted/30"
                          >

                            {/* DATE */}

                            <td className="px-5 py-5 whitespace-nowrap">
                              <span className="text-sm text-gray-600">
                                {formatDate(
                                  transaction.date
                                )}
                              </span>
                            </td>

                            {/* DESCRIPTION */}

                            <td className="px-5 py-5">
                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                    transaction.type ===
                                    "income"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-500"
                                  }`}
                                >
                                  {Icon && (
                                    <Icon className="text-xl" />
                                  )}
                                </div>

                                <p className="font-semibold capitalize text-gray-700">
                                  {transaction.note ||
                                    "No note"}
                                </p>

                              </div>
                            </td>

                            {/* CATEGORY */}

                            <td className="px-5 py-5">
                              <span className="text-sm text-gray-600">
                                {transaction.category
                                  ?.name ??
                                  "Unknown Category"}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-5 text-center">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                  status ===
                                  "completed"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {status}
                              </span>
                            </td>

                            {/* AMOUNT */}

                            <td className="px-5 py-5 text-right">
                              <span
                                className={`font-bold ${
                                  transaction.type ===
                                  "income"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {transaction.type ===
                                "income"
                                  ? "+"
                                  : "-"}{" "}
                                ₦
                                {transaction.amount.toLocaleString()}
                              </span>
                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>
          </div>

          {/* =====================================================
              MOBILE TRANSACTIONS
              ===================================================== */}

          <div className="md:hidden mt-6 space-y-3">

            {filteredTransactions.length === 0 ? (

              <div className="bg-card rounded-2xl border border-border p-8 text-center text-gray-500">
                No transactions found.
              </div>

            ) : (

              filteredTransactions.map(
                (transaction) => {

                  const iconKey =
                    transaction.category?.icon ??
                    "other";

                  const Icon =
                    iconMap[iconKey];

                  const status =
                    getStatus(transaction);

                  return (

                    <div
                      key={transaction._id}
                      className="bg-card rounded-2xl border border-border px-4 py-4"
                    >

                      {/* =================================================
                          MOBILE ROW 1
                          DESCRIPTION + DATE + AMOUNT
                      ================================================= */}

                      <div className="flex items-start justify-between gap-3">

                        {/* DESCRIPTION */}

                        <div className="flex items-center gap-3 min-w-0">

                          {/* ICON */}

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              transaction.type ===
                              "income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                            {Icon && (
                              <Icon className="text-xl" />
                            )}
                          </div>

                          {/* DESCRIPTION */}

                          <div className="min-w-0">

                            <p className="font-semibold capitalize text-gray-700 leading-5 wrap-break-word">
                              {transaction.note ||
                                "No note"}
                            </p>
                          </div>

                        </div>

                        {/* AMOUNT */}

                        <p
                          className={`font-bold text-base whitespace-nowrap pt-1 ${
                            transaction.type ===
                            "income"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type ===
                          "income"
                            ? "+"
                            : "-"}{" "}
                          ₦
                          {transaction.amount.toLocaleString()}
                        </p>

                      </div>

                      
                      <div className="mt-1 ml-14">
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(
                            transaction.date
                          )}
                        </p>
                      </div>

                      {/* =================================================
                          MOBILE ROW 2
                          CATEGORY + STATUS
                      ================================================= */}

                      <div className="flex items-center gap-x-4 mt-4">

                        {/* CATEGORY */}

                        <span className="text-sm text-gray-500">
                          {transaction.category
                            ?.name ??
                            "Unknown Category"}
                        </span>

                        {/* STATUS */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            status ===
                            "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {status}
                        </span>

                      </div>

                    </div>

                  );
                }
              )

            )}

          </div>

        </main>
      </div>

      <Navbar />
    </div>
  );
}

