"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiEdit, FiPlus } from "react-icons/fi";
import { FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { GoHome, GoTag } from "react-icons/go";
import { PiCarProfile, PiSuitcase } from "react-icons/pi";
import { IoMdTrendingUp } from "react-icons/io";
import Navbar from "@/component/Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";

type Category = {
  _id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
};

const iconOptions = [
  { name: "shopping", icon: FiShoppingBag },
  { name: "transport", icon: PiCarProfile },
  { name: "rent", icon: GoHome },
  { name: "salary", icon: FiDollarSign },
  { name: "freelance", icon: PiSuitcase },
  { name: "investment", icon: IoMdTrendingUp },
  { name: "other", icon: GoTag },
];

export default function Page() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createCategory, setCreateCategory] = useState(false);

  const [categoryData, setCategoryData] = useState({
    name: "",
    type: "expense",
    icon: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // refresh categories
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            credentials: "include",
          }
        );

        const categoryDataRes = await categoryRes.json();

        setCategories(
          Array.isArray(categoryDataRes.data) ? categoryDataRes.data : []
        );

        // reset form
        setCategoryData({
          name: "",
          type: "expense",
          icon: "",
        });

        setCreateCategory(false);
        setEditingId(null);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        // remove deleted category instantly from UI
        setCategories((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch categories from backend
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
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="">
      <Header />
      <div className="relative md:flex">
        <Siderbar />
        <main className="content">
          <div className="py-5 px-5 rounded-lg bg-primary/15 border-2 border-primary flex items-start gap-x-4">
            <div>
              <FiAlertCircle className="text-2xl text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-medium">
                Categories help you organize your money
              </h3>
              <p>
                You can't delete categories that are already used in
                transactions
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-7">
            <div>
              <h2 className="text-green-600 font-bold">Income Categories</h2>
              <div className="mt-4">
                {categories.filter((cat) => cat.type === "income").length ===
                  0 && (
                  <p className="text-sm text-gray-400">
                    No income categories yet.
                  </p>
                )}
                {categories
                  .filter((cat) => cat.type === "income")
                  .map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between border-2 border-border p-5 rounded-lg bg-card mb-4"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-x-6">
                        <FiEdit
                          className="text-xl cursor-pointer"
                          onClick={() => {
                            setCreateCategory(true);
                            setEditingId(item._id);
                            setCategoryData({
                              name: item.name,
                              type: item.type,
                              icon: item.icon,
                            });
                          }}
                        />
                        <RiDeleteBinLine
                          className="text-red-500 text-xl cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-red-600 font-medium">Expense Categories</h2>
              <div className="mt-4">
                {categories.filter((cat) => cat.type === "expense").length ===
                  0 && (
                  <p className="text-sm text-gray-400">
                    No expense categories yet.
                  </p>
                )}
                {categories
                  .filter((cat) => cat.type === "expense")
                  .map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between border-2 border-border p-5 rounded-lg bg-card mb-4"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-x-6">
                        <FiEdit
                          className="text-xl cursor-pointer"
                          onClick={() => {
                            setCreateCategory(true);
                            setEditingId(item._id);
                            setCategoryData({
                              name: item.name,
                              type: item.type,
                              icon: item.icon,
                            });
                          }}
                        />
                        <RiDeleteBinLine
                          className="text-red-500 text-xl cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="bg-primary text-white font-bold py-3 mt-6 w-full rounded-lg flex items-center justify-center gap-x-3"
            onClick={() => setCreateCategory(true)}
          >
            <FiPlus className="text-2xl" />
            Add Category
          </button>
        </main>
      </div>

      {createCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-card rounded-xl p-5 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="my-4">
                <label className="font-medium">Category Name</label>

                <input
                  type="text"
                  name="name"
                  value={categoryData.name}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border-2 mt-2"
                  placeholder="e.g Shopping"
                />
              </div>

              <div>
                <label className="font-medium">Type</label>

                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryData({
                        ...categoryData,
                        type: "expense",
                      })
                    }
                    className={`flex-1 border-2 rounded-xl py-3 ${
                      categoryData.type === "expense"
                        ? "bg-red-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryData({
                        ...categoryData,
                        type: "income",
                      })
                    }
                    className={`flex-1 border-2 rounded-xl py-3 ${
                      categoryData.type === "income"
                        ? "bg-green-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label className="font-medium">Choose Icon</label>

                <div className="grid grid-cols-4 gap-3 mt-3">
                  {iconOptions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setCategoryData({
                            ...categoryData,
                            icon: item.name,
                          })
                        }
                        className={`border-2 rounded-xl p-4 flex items-center justify-center text-xl ${
                          categoryData.icon === item.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setCreateCategory(false);
                    setEditingId(null);
                    setCategoryData({ name: "", type: "expense", icon: "" });
                  }}
                  className="flex-1 border-2 rounded-lg py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white rounded-lg py-3"
                >
                  {isLoading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
