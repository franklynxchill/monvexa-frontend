"use client";

import { useEffect, useState } from "react";
import Header from "@/component/Header";
import Navbar from "@/component/Navbar";
import Siderbar from "@/component/Siderbar";
import { Toaster, toast } from "sonner";

import { BsPhone } from "react-icons/bs";
import { GoLock } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { LuBell, LuDatabase, LuMoon } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { TfiShine } from "react-icons/tfi";

type Theme = "light" | "dark" | "system";
type Currency = "USD" | "EUR" | "GBP" | "NGN";
type Language = "english" | "spanish" | "french" | "german";

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  const prefersDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", prefersDark);
}

export default function Page() {
  const [theme, setTheme] = useState<Theme>("light");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [language, setLanguage] = useState<Language>("english");

  // Load saved preferences on mount, then apply the theme to <html>.
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    const savedCurrency =
      (localStorage.getItem("currency") as Currency) || "USD";
    const savedLanguage =
      (localStorage.getItem("language") as Language) || "english";

    setTheme(savedTheme);
    setCurrency(savedCurrency);
    setLanguage(savedLanguage);
    applyTheme(savedTheme);
  }, []);

  const handleThemeSelect = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const handleCurrencyChange = (value: Currency) => {
    setCurrency(value);
    localStorage.setItem("currency", value);
    toast.success("Currency preference saved");
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    toast.success("Language preference saved");
  };

  // Features that need a backend endpoint / dedicated page that doesn't
  // exist yet — surfaced honestly instead of linking to a 404 or
  // pretending the button does something it doesn't.
  const comingSoon = (feature: string) => {
    toast.info(`${feature} is coming soon`);
  };

  const themeOptions: { value: Theme; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: TfiShine },
    { value: "dark", label: "Dark", icon: LuMoon },
    { value: "system", label: "System", icon: BsPhone },
  ];

  return (
    <div>
      <Header />
      <div className="relative md:flex">
        <Siderbar />
        <main className="content">
          <div>
            <h2>Settings</h2>
            <p>Manage your account preferences and settings</p>

            {/* ================================== */}
            {/* APPEARANCE */}
            {/* ================================== */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-8">
              <div className="flex items-center gap-x-3">
                <TfiShine className="text-primary text-2xl" />
                <h3 className="font-bold">Appearance</h3>
              </div>
              <div className="mt-5">
                <h4 className="font-bold">Theme</h4>
                <div className="flex items-center text-center gap-x-4 mt-2">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = theme === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleThemeSelect(opt.value)}
                        className={`w-1/3 flex flex-col items-center gap-y-3 border-2 rounded-xl py-4 cursor-pointer transition ${
                          isActive
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/40"
                        }`}
                      >
                        <Icon className="text-primary text-xl" />
                        <p>{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================================== */}
            {/* GENERAL */}
            {/* ================================== */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div className="flex items-center gap-x-3">
                <TbWorld className="text-primary text-2xl" />
                <h3 className="font-bold">General</h3>
              </div>
              <div className="mt-5">
                <div className="mb-5">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) =>
                      handleCurrencyChange(e.target.value as Currency)
                    }
                    className="w-full p-4 bg-muted rounded-2xl text-black mt-2 outline-primary"
                  >
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) =>
                      handleLanguageChange(e.target.value as Language)
                    }
                    className="w-full p-4 bg-muted rounded-2xl text-black mt-2 outline-primary"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ================================== */}
            {/* NOTIFICATIONS */}
            {/* ================================== */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div className="flex items-center gap-x-3">
                <LuBell className="text-primary text-2xl" />
                <h3 className="font-bold">Notifications</h3>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => comingSoon("Email notification settings")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold cursor-pointer"
                >
                  <div className="flex items-center gap-x-3">
                    <MdOutlineMail className="text-2xl text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Email Notifications</p>
                      <p className="text-gray-500 font-normal">
                        Receive email updates about your account
                      </p>
                    </div>
                  </div>
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={() => comingSoon("Push notification settings")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold mt-4 cursor-pointer"
                >
                  <div className="flex items-center gap-x-3">
                    <LuBell className="text-2xl text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Push Notifications</p>
                      <p className="text-gray-500 font-normal">
                        Receive push notifications on your devices
                      </p>
                    </div>
                  </div>
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* ================================== */}
            {/* SECURITY */}
            {/* ================================== */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div className="flex items-center gap-x-3">
                <GoLock className="text-primary text-2xl" />
                <h3 className="font-bold">Security</h3>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => comingSoon("Change Password")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold cursor-pointer text-left"
                >
                  Change Password
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={() => comingSoon("Two-Factor Authentication")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold my-4 cursor-pointer text-left"
                >
                  Two-Factor Authentication
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={() => comingSoon("Active Sessions")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold cursor-pointer text-left"
                >
                  Active Sessions
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* ================================== */}
            {/* DATA & PRIVACY */}
            {/* ================================== */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7 mb-10">
              <div className="flex items-center gap-x-3">
                <LuDatabase className="text-primary text-2xl" />
                <h3 className="font-bold">Data & Privacy</h3>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => comingSoon("Data export")}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-bold cursor-pointer text-left"
                >
                  Export Your Data
                  <IoIosArrowForward className="text-xl text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={() => comingSoon("Account deletion")}
                  className="w-full flex items-center justify-between p-4 bg-red-100 text-red-500 font-bold rounded-2xl mt-4 cursor-pointer text-left"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Navbar />
      <Toaster position="top-right" richColors />
    </div>
  );
}