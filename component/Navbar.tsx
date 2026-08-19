"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgFileDocument } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { LuChartPie } from "react-icons/lu";

function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: GoHome },
    { href: "/transactions", label: "History", icon: CgFileDocument },
    { href: "/insights", label: "Analytics", icon: LuChartPie },
    { href: "/settings", label: "Settings", icon: IoSettingsOutline },
    { href: "/profile", label: "Profile", icon: FaRegUser },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-gray-200 pb-safe lg:hidden">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center text-xs w-full"
            >
              <Icon
                className={`text-xl transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              />

              <span
                className={`transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;