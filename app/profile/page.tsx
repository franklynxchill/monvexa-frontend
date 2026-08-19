"use client";

import Header from "@/component/Header";
import Navbar from "@/component/Navbar";
import Siderbar from "@/component/Siderbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FiCalendar, FiUser } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { LuLogOut, LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";

type User = {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: "user" | "admin";
  plan?: "free" | "pro" | "business";
  createdAt?: string;
  updatedAt?: string;
};

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5200/api/profile", {
          credentials: "include",
        });

        const data = await res.json();

        const profile = data.user || data;

        setUser(profile);

        setFormData({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phoneNumber: profile.phoneNumber?.toString() || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5200/api/profile",
        {
          method: "PUT", // Change to PATCH if your API uses PATCH
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);

      setFormData({
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phoneNumber: data.user.phoneNumber?.toString() || "",
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        "http://localhost:5200/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !user) {
    return (
      <div className="">
        <Header />

        <div className="relative md:flex">
          <Siderbar />
          <div className="content">
            <div className="flex items-center justify-center h-[70vh]">
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />

        <div className="content">
          <h2>Profile</h2>
          <p>Manage your personal information</p>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <h3 className="font-bold">Profile Picture</h3>

              <div className="mt-5 flex items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold uppercase">
                    {formData.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="w-9 h-9 rounded-full bg-primary absolute bottom-0 right-0 flex items-center justify-center">
                    <IoCameraOutline className="text-white text-lg" />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="bg-muted/40 hover:bg-muted rounded-xl px-5 py-3 font-bold"
                  >
                    Upload New Picture
                  </button>

                  <p>JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <h3 className="font-bold">Personal Information</h3>

              <div className="space-y-4 mt-5">
                <div>
                  <label>Full Name</label>

                  <div className="bg-muted rounded-xl flex items-center gap-3 p-4 mt-2">
                    <FiUser className="text-xl text-muted-foreground" />

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label>Email Address</label>

                  <div className="bg-muted rounded-xl flex items-center gap-3 p-4 mt-2">
                    <MdOutlineMail className="text-xl text-muted-foreground" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label>Phone Number</label>

                  <div className="bg-muted rounded-xl flex items-center gap-3 p-4 mt-2">
                    <LuPhone className="text-xl text-muted-foreground" />

                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-card px-8 py-7 rounded-2xl mt-7">
              <h3 className="font-bold">Account Information</h3>

              <div className="mt-5 space-y-4">
                <Link
                  href="#"
                  className="flex justify-between items-center bg-muted rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <FiCalendar />

                    <label className="font-semibold">
                      Member Since
                    </label>
                  </div>

                  <p>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )
                      : "N/A"}
                  </p>
                </Link>

                <div className="flex justify-between items-center bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FiUser />

                    <label className="font-semibold">
                      Account Type
                    </label>
                  </div>

                  <p className="capitalize">
                    {user?.plan || "Free"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-5 mt-8">
              <button
                type="reset"
                className="px-5 py-3 hover:bg-muted rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-xl px-5 py-3 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <button
            onClick={handleLogout}
            className="w-full bg-red-100 text-red-500 rounded-xl py-3 mt-8 flex justify-center items-center gap-3 font-semibold"
          >
            <LuLogOut />
            Logout
          </button>

          <Navbar />
        </div>
      </div>
    </div>
  );
}