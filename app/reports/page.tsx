"use client";

import { useEffect, useState } from "react";
import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  FiCalendar,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";
import { LuFileText, LuReceipt } from "react-icons/lu";
import { MdOutlineFileDownload, MdOutlineMail } from "react-icons/md";
import { Toaster, toast } from "sonner";

// ======================================================
// TYPES
// ======================================================

type PeriodValue =
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "last-quarter"
  | "this-year"
  | "last-year"
  | "custom";

type FormatValue = "pdf" | "xlsx" | "csv";

type ReportType =
  | "income-statement"
  | "profit-loss"
  | "expense-report"
  | "tax-summary"
  | "cash-flow-statement"
  | "budget-vs-actual";

type ReportTemplate = {
  type: ReportType;
  icon: any;
  heading: string;
  body: string;
};

type RecentReport = {
  _id: string;
  userId?: string;
  type: ReportType;
  title: string;
  period: string;
  format: FormatValue;
  fileName: string;
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
};

// ======================================================
// OPTIONS
// ======================================================

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

// ======================================================
// REPORT TEMPLATES
// ======================================================

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

// ======================================================
// PAGE
// ======================================================

export default function Page() {
  const [period, setPeriod] = useState<PeriodValue>("this-month");
  const [format, setFormat] = useState<FormatValue>("pdf");
  const [generatingType, setGeneratingType] = useState<ReportType | null>(
    null
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ======================================================
  // FETCH RECENT REPORTS
  // ======================================================

  const fetchRecentReports = async () => {
    try {
      setLoadingReports(true);

      if (!API_URL) {
        console.error("NEXT_PUBLIC_API_URL is not configured");
        toast.error("API URL is not configured");
        return;
      }

      const res = await fetch(`${API_URL}/api/reports`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        let message = "Failed to fetch reports";

        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      const result = await res.json();

      const reports = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.reports)
        ? result.reports
        : [];

      setRecentReports(reports);
    } catch (error) {
      console.error("FETCH REPORTS:", error);
      setRecentReports([]);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch reports"
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchRecentReports();
  }, []);

  // ======================================================
  // DOWNLOAD HELPER (shared by generate + re-download)
  // ======================================================

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  // ======================================================
  // GENERATE REPORT
  // ======================================================

  const handleGenerate = async (template: ReportTemplate) => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setGeneratingType(template.type);

    try {
      const params = new URLSearchParams({
        type: template.type,
        period,
        format,
      });

      const res = await fetch(
        `${API_URL}/api/reports/generate?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        let message = "Failed to generate report";

        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          // Response was not JSON
        }

        toast.error(message);
        return;
      }

      const blob = await res.blob();

      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const filename =
        filenameMatch?.[1] || `${template.type}-${period}.${format}`;

      triggerDownload(blob, filename);

      toast.success(`${template.heading} downloaded successfully`);

      await fetchRecentReports();
    } catch (error) {
      console.error("GENERATE REPORT:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong generating this report"
      );
    } finally {
      setGeneratingType(null);
    }
  };

  // ======================================================
  // DOWNLOAD A PREVIOUSLY GENERATED REPORT
  // ======================================================

  const handleDownloadReport = async (report: RecentReport) => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setDownloadingId(report._id);

    try {
      const res = await fetch(
        `${API_URL}/api/reports/${report._id}/download`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        let message = "Failed to download report";

        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          // Response was not JSON
        }

        toast.error(message);
        return;
      }

      const blob = await res.blob();
      triggerDownload(blob, report.fileName);
    } catch (error) {
      console.error("DOWNLOAD REPORT:", error);
      toast.error(
        error instanceof Error ? error.message : "Download failed"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // ======================================================
  // EMAIL A PREVIOUSLY GENERATED REPORT
  // ======================================================

  const handleEmailReport = async (report: RecentReport) => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    const to = window.prompt("Send this report to which email address?");

    if (!to) return;

    setEmailingId(report._id);

    try {
      const res = await fetch(
        `${API_URL}/api/reports/${report._id}/email`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to }),
        }
      );

      if (!res.ok) {
        let message = "Failed to send email";

        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      toast.success(`Report sent to ${to}`);
    } catch (error) {
      console.error("EMAIL REPORT:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    } finally {
      setEmailingId(null);
    }
  };

  // ======================================================
  // SCHEDULE REPORTS (not built yet)
  // ======================================================

  const handleScheduleReports = () => {
    toast.info("Automated report scheduling is coming soon");
  };

  // ======================================================
  // FORMAT REPORT TYPE
  // ======================================================

  const formatReportType = (type: ReportType) => {
    switch (type) {
      case "income-statement":
        return "Income Statement";
      case "profit-loss":
        return "Profit & Loss";
      case "expense-report":
        return "Expense Report";
      case "tax-summary":
        return "Tax Summary";
      case "cash-flow-statement":
        return "Cash Flow Statement";
      case "budget-vs-actual":
        return "Budget vs Actual";
      default:
        return type;
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatReportDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ======================================================
  // FORMAT FILE SIZE
  // ======================================================

  const formatFileSize = (size?: number) => {
    if (!size || size <= 0) {
      return "—";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div>
      <Siderbar />
      <Header />

      <main className="content">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reports</h2>
            <p>Generate and download financial reports</p>
          </div>
        </div>

        {/* ==========================================
            REPORT SETTINGS
        ========================================== */}

        <div className="bg-card shadow-2xs rounded-xl border-2 border-gray-300 my-12 px-8 py-6">
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
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ==========================================
            REPORT TEMPLATES
        ========================================== */}

        <div>
          <h3>Report Templates</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {reportTemplates.map((reportTemplate) => {
              const Icon = reportTemplate.icon;
              const isGenerating = generatingType === reportTemplate.type;

              return (
                <div
                  key={reportTemplate.type}
                  className="bg-card border-border border rounded-2xl p-5"
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

        {/* ==========================================
            RECENT REPORTS
        ========================================== */}

        <div className="bg-card border border-border rounded-2xl mt-12 overflow-hidden">
          <div className="border-b border-border p-6">
            <h4 className="font-semibold text-lg">Recent Reports</h4>
          </div>

          {loadingReports ? (
            <div className="p-8 text-center">
              <p>Loading reports...</p>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="p-8 text-center">
              <LuFileText className="text-4xl mx-auto mb-3 opacity-50" />
              <h5 className="font-semibold">No reports yet</h5>
              <p className="text-sm mt-1">
                Generate your first financial report above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentReports.map((report) => {
                const isDownloading = downloadingId === report._id;
                const isEmailing = emailingId === report._id;

                return (
                  <div
                    key={report._id}
                    className="py-5 px-4 md:px-9 gap-y-5 flex flex-col md:flex-row md:items-center justify-between"
                  >
                    <div className="flex items-start md:items-center gap-x-5 md:gap-4">
                      <div className="p-3 rounded-lg bg-border shrink-0">
                        <LuFileText className="text-2xl text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-x-3 font-semibold text-lg">
                          <span>{report.period}</span>
                          <h5>
                            {report.title || formatReportType(report.type)}
                          </h5>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center mt-2 opacity-60 gap-x-6 gap-y-3">
                          <span>
                            {report.title || formatReportType(report.type)}
                          </span>

                          <p>
                            Generated on{" "}
                            {formatReportDate(report.createdAt)}
                          </p>

                          <span>{formatFileSize(report.fileSize)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-4 w-full md:w-56">
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => handleDownloadReport(report)}
                        className="bg-border text-black hover:bg-primary hover:text-white flex-1 rounded-2xl py-3 flex items-center gap-x-2 justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition"
                      >
                        <MdOutlineFileDownload className="text-2xl" />
                        {isDownloading ? "..." : "Download"}
                      </button>

                      <button
                        type="button"
                        disabled={isEmailing}
                        onClick={() => handleEmailReport(report)}
                        title="Email report"
                        aria-label={`Email ${report.title || formatReportType(report.type)}`}
                        className="w-12 h-12 shrink-0 rounded-xl bg-border flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-primary hover:text-white cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <MdOutlineMail className="text-2xl" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==========================================
            AUTOMATED REPORTS
        ========================================== */}

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
              <FiCalendar className="text-2xl" />
              Schedule Reports
            </button>
          </div>
        </div>

        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
}