"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoBell } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogOut, LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";

type User = {
  _id?: string;
  fullName: string;
};

function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
  });

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
        });
      } catch (error) {
        console.error(error);
      } 
    };

    fetchProfile();
  }, []);

  return (
    <div
      className="
        z-30 fixed top-0 right-0 bg-card text-foreground shadow-2xs w-screen py-4 px-8
        overflow-hidden
        lg:left-67.5 lg:w-[calc(100%-270px)]
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-12 pr-6">
          <div className="bg-muted py-2 px-4 w-lg rounded-lg flex items-center gap-x-2">
            <LuSearch className="text-muted-foreground" />
            <input
              type="search"
              className="w-full outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="Search transaction..."
            />
          </div>

          <div className="flex items-center gap-x-5">
            <Link
              href="/notifications"
              className="p-2 rounded-lg hover:bg-muted cursor-pointer"
              aria-label="Notifications"
            >
              <GoBell className="text-xl" />
            </Link>
            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-muted cursor-pointer"
              aria-label="Settings"
            >
              <IoSettingsOutline className="text-xl" />
            </Link>
          </div>
        </div>
        <div className=" flex items-center gap-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg text-white font-medium uppercase">
            {formData.fullName
              ?.split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
            }
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="border-l-2 border-l-border pl-6 cursor-pointer"
            aria-label="Log out"
          >
            <LuLogOut className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
