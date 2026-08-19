"use client";

import { useState } from "react";
import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiCalendar, FiDollarSign, FiPieChart } from "react-icons/fi";
import { LuFileText, LuReceipt } from "react-icons/lu";
import { MdOutlineFileDownload } from "react-icons/md";
import { Toaster, toast } from "sonner";

type PeriodValue =
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "last-quarter"
  | "this-year"
  | "last-year"
  | "custom";

type FormatValue = "pdf" | "xlsx" | "csv";

const PERIOD_OPTIONS: { value: PeriodValue; label: string }[] = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "last-quarter", label: "Last Quarter" },
  { value: "this-year", label: "This Year" },
  { value: "last-year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

const FORMAT_OPTIONS: { value: FormatValue; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "xlsx", label: "Excel (XLSX)" },
  { value: "csv", label: "CSV" },
];

type ReportTemplate = {
  type: string;
  icon: any;
  heading: string;
  body: string;
};

const reportTemplates: ReportTemplate[] = [
  {
    type: "income-statement",
    icon: FiDollarSign,
    heading: "Income Statement",
    body: "Detailed breakdown of income and expenses",
  },
  {
    type: "profit-loss",
    icon: FaArrowTrendUp,
    heading: "Profit & Loss",
    body: "Comprehensive profit and loss analysis",
  },
  {
    type: "expense-report",
    icon: LuReceipt,
    heading: "Expense Report",
    body: "Category-wise expense breakdown",
  },
  {
    type: "tax-summary",
    icon: LuFileText,
    heading: "Tax Summary",
    body: "Tax-ready financial summary",
  },
  {
    type: "cash-flow-statement",
    icon: FiPieChart,
    heading: "Cash Flow Statement",
    body: "Track cash in and cash out",
  },
  {
    type: "budget-vs-actual",
    icon: FiCalendar,
    heading: "Budget vs Actual",
    body: "Compare budgets with actual spending",
  },
];

export default function Page() {
  const [period, setPeriod] = useState<PeriodValue>("this-month");
  const [format, setFormat] = useState<FormatValue>("pdf");

  // Tracks which report card is currently generating, so only that
  // button shows a loading state instead of disabling the whole page.
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const handleGenerate = async (template: ReportTemplate) => {
    setGeneratingType(template.type);

    try {
      const params = new URLSearchParams({
        type: template.type,
        period,
        format,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/generate?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        let message = "Failed to generate report";
        try {
          const errData = await res.json();
          message = errData.message || message;
        } catch {
          // response wasn't JSON — keep the generic message
        }
        toast.error(message);
        return;
      }

      const blob = await res.blob();

      // Prefer the filename the server suggests (Content-Disposition),
      // fall back to something sensible built from the template + format.
      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const filename =
        filenameMatch?.[1] ||
        `${template.type}-${period}.${format === "xlsx" ? "xlsx" : format}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${template.heading} downloaded`);
    } catch (error) {
      console.error("GENERATE REPORT:", error);
      toast.error("Something went wrong generating this report");
    } finally {
      setGeneratingType(null);
    }
  };

  const handleScheduleReports = () => {
    // Scheduling requires backend infra (cron + email delivery) that
    // isn't built yet — surfacing this honestly instead of pretending
    // the button does something it doesn't.
    toast.info("Automated report scheduling is coming soon");
  };

  return (
    <div>
      <Siderbar />
      <Header />
      <main className=" content">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reports</h2>
            <p>Generate and download financial reports</p>
          </div>
        </div>

        <div className="bg-card shadow-2xs rounded-xl border-2 border-gray-300 my-12 px-8 py-6">
          <div>
            <h3>Report Settings</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
              <div className="flex flex-col w-full">
                <label htmlFor="report-period">Time Period</label>
                <select
                  id="report-period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodValue)}
                  className="py-3 px-3.5 border-2 border-primary/25 mt-2 rounded-xl"
                >
                  {PERIOD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="report-format">Export Format</label>
                <select
                  id="report-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as FormatValue)}
                  className="py-3 px-3.5 border-2 border-primary/25 mt-2 rounded-xl"
                >
                  {FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {reportTemplates.map((reportTemplate) => {
              const Icon = reportTemplate.icon;
              const isGenerating = generatingType === reportTemplate.type;

              return (
                <div
                  className="bg-card border-border border rounded-2xl p-5"
                  key={reportTemplate.type}
                >
                  <div className="w-20">
                    <Icon className="text-3xl" />
                  </div>
                  <h4 className="my-4 font-semibold text-xl">
                    {reportTemplate.heading}
                  </h4>
                  <p>{reportTemplate.body}</p>
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleGenerate(reportTemplate)}
                    className="bg-border text-black hover:bg-primary hover:text-white w-full rounded-2xl py-3 mt-4 flex items-center gap-x-2 justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <MdOutlineFileDownload className="text-2xl" />
                    {isGenerating ? "Generating..." : "Generate Report"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center mt-16 bg-border border border-primary/25 rounded-3xl gap-4 p-8">
          <div className="w-full">
            <h3 className="mb-3 font-semibold">Automated Reports</h3>
            <p>Schedule reports to be generated and emailed automatically</p>
          </div>
          <div className="w-full md:w-1/4 text-center">
            <button
              type="button"
              onClick={handleScheduleReports}
              className="w-full bg-primary text-white rounded-xl py-3 px-4 flex items-center justify-center gap-x-3"
            >
              <FiCalendar className="text-2xl" /> Schedule Reports
            </button>
          </div>
        </div>

        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
}