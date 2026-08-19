"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiShoppingBag, FiDollarSign, FiCalendar } from "react-icons/fi";
import { GoHome, GoTag } from "react-icons/go";
import { PiCarProfile, PiSuitcase } from "react-icons/pi";
import { IoMdTrendingUp } from "react-icons/io";
import { Toaster, toast } from "sonner";
import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import { LuFileText, LuSave } from "react-icons/lu";

type Category = {
  _id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
};

export default function Page() {
  const router = useRouter();

  const [transactionData, setTransactionData] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    category: "",
  });

  const iconMap: any = {
    shopping: FiShoppingBag,
    transport: PiCarProfile,
    rent: GoHome,
    salary: FiDollarSign,
    freelance: PiSuitcase,
    investment: IoMdTrendingUp,
    other: GoTag,
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        // Guard against error responses / unexpected shapes so
        // categories.filter(...) below never blows up on undefined.
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Input handler (ONLY inputs)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Category handler
  const handleCategorySelect = (categoryId: string) => {
    setTransactionData((prev) => ({
      ...prev,
      category: categoryId,
    }));

    setErrors((prev) => ({
      ...prev,
      category: "",
    }));
  };

  // Submit transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      amount: "",
      category: "",
    };

    // AMOUNT VALIDATION
    if (!transactionData.amount) {
      newErrors.amount = "Amount is required";
    } else if (Number(transactionData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    // CATEGORY VALIDATION
    if (!transactionData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);

    if (newErrors.amount || newErrors.category) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        amount: Number(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        note: transactionData.note,
        date: new Date().toISOString(),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend Error:", data.message);
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Transaction successful", {
        duration: 1500,
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="relative md:flex">
        <Siderbar />
        <main className="content">
          {/* Header */}
          <div>
            <div className="mb-4">
              <Link href="/transactions" className="flex items-center gap-x-2">
                <IoArrowBackOutline className="text-xl" />
                <p>Back to Transactions</p>
              </Link>
            </div>

            <h1>Add Transaction</h1>
            <p>Record a new income or expense transaction</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Type */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <label className="font-semibold">Transaction Type</label>
              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setTransactionData((prev) => ({
                      ...prev,
                      type: "expense",
                    }))
                  }
                  className={`flex-1 border-2 rounded-xl py-3 cursor-pointer ${
                    transactionData.type === "expense"
                      ? "bg-red-500 text-white"
                      : "border-gray-300 bg-card"
                  }`}
                >
                  Expense
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTransactionData((prev) => ({
                      ...prev,
                      type: "income",
                    }))
                  }
                  className={`flex-1 border-2 rounded-xl py-3 cursor-pointer ${
                    transactionData.type === "income"
                      ? "bg-green-500 text-white"
                      : "border-gray-300 bg-card"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div>
                <label className="font-semibold">Amount *</label>
                <div className="flex items-center gap-x-3 p-4 bg-muted rounded-2xl mt-3 outline-primary">
                  <p className="text-3xl">₦</p>
                  <input
                    type="number"
                    name="amount"
                    value={transactionData.amount}
                    onChange={handleChange}
                    className="outline-none w-full text-3xl"
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div>
                <label className="font-semibold">Description</label>
                <div className="p-4 bg-muted rounded-2xl mt-3 outline-primary flex items-center gap-x-3">
                  <LuFileText className="text-xl" />
                  <input
                    type="text"
                    name="note"
                    value={transactionData.note}
                    onChange={handleChange}
                    className="outline-0 w-full"
                    placeholder="e.g., Client payment for project"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div className="mt-6">
                <label className="font-semibold">Category</label>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  {categories
                    .filter((cat) => cat.type === transactionData.type)
                    .map((item) => {
                      const Icon = iconMap[item.icon];

                      return (
                        <div
                          key={item._id}
                          onClick={() => handleCategorySelect(item._id)}
                          className={`border-2 bg-card font-medium rounded-xl py-3 text-center cursor-pointer flex flex-col items-center gap-2 ${
                            transactionData.category === item._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          }`}
                        >
                          {Icon && <Icon className="text-2xl" />}
                          <p className="text-[.8rem]">{item.name}</p>
                        </div>
                      );
                    })}
                </div>

                {categories.length === 0 && (
                  <p className="text-sm text-gray-400 mt-3">
                    No categories yet — add one from the Categories page.
                  </p>
                )}

                {errors.category && (
                  <p className="text-red-500 text-sm mt-3">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <div>
                <label className="font-semibold">Note (Optional)</label>
                <div className="p-4 bg-muted rounded-2xl mt-3 outline-primary h-36">
                  <input
                    type="text"
                    name="note"
                    value={transactionData.note}
                    onChange={handleChange}
                    className="outline-0 w-full"
                    placeholder="Add any additional notes or details..."
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center gap-x-4 mt-7">
              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white text-lg py-3 md:w-4/5 rounded-xl cursor-pointer flex items-center justify-center gap-x-3"
              >
                <LuSave />
                {isLoading ? "Saving..." : "Save Transaction"}
              </button>

              {/* Cancel */}
              <Link
                href="/transactions"
                className="md:w-1/5 py-3 px-4 hover:bg-muted rounded-xl text-center font-semibold"
              >
                Cancel
              </Link>
            </div>
          </form>

          <Toaster position="top-right" richColors />
        </main>
      </div>
    </div>
  );
}
