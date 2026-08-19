"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import {
  LuBriefcase,
  LuChartColumn,
  LuCreditCard,
  LuDollarSign,
  LuFileText,
  LuFolderOpen,
  LuLayoutDashboard,
} from "react-icons/lu";
import { TbWallet } from "react-icons/tb";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: LuLayoutDashboard },
  { href: "/transactions", label: "History", icon: GrTransaction },
  { href: "/categories", label: "Categories", icon: LuFolderOpen },
  { href: "/analytics", label: "Analytics", icon: LuChartColumn },
  { href: "/budgets", label: "Budgets", icon: TbWallet },
  { href: "/reports", label: "Reports", icon: LuFileText },
  { href: "/notifications", label: "Notifications", icon: GoBell },
  { href: "/business-mode", label: "Business Mode", icon: LuBriefcase },
];

const navItems1: NavItem[] = [
  { href: "/settings", label: "Settings", icon: IoSettingsOutline },
  { href: "/profile", label: "Profile", icon: FiUser },
  { href: "/billings", label: "Billings", icon: LuCreditCard },
];

function Siderbar() {
  const pathname = usePathname();

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderNavItem = (item: NavItem) => {
    const isActive = isItemActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-x-3 px-3 py-3.5 hover:rounded-xl ${
          isActive
            ? "bg-primary text-white rounded-xl"
            : "hover:bg-muted hover:text-foreground"
        }`}
      >
        <Icon className="text-2xl" />
        {item.label}
      </Link>
    );
  };

  return (
    <div
      className="
        bg-card p-5 h-screen fixed hidden overflow-y-auto
        lg:block lg:w-67.5
      "
    >
      <div>
        <div className="flex items-center gap-x-3">
          <div className="bg-blue-600 p-3 rounded-lg">
            <LuDollarSign className="text-white text-2xl" />
          </div>
          <div>
            <span className="font-semibold text-xl">Monvexa</span>
            <p>Business Edition</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col text-muted-foreground pb-4">
          <div className="pb-8">{navItems.map(renderNavItem)}</div>

          <div className="border-t-2 border-t-muted pt-6">
            {navItems1.map(renderNavItem)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Siderbar;