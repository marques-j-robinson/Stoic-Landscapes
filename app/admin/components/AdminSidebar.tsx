
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Plus,
  Settings,
  LogOut,
  Mountain,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Paintings",
    href: "/admin/paintings",
    icon: Images,
  },
  {
    name: "Add Painting",
    href: "/admin/paintings/new",
    icon: Plus,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#242522] text-[#EAE9E1]">

      {/* Branding */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <Mountain className="h-8 w-8 text-[#A3A58A]" />

        <div>
          <h1 className="text-sm font-semibold tracking-widest">
            STOIC LANDSCAPES
          </h1>
          <p className="mt-1 text-xs tracking-wider text-gray-400">
            STUDIO ADMIN
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#44483B] text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Account Navigation */}
        <div className="mt-10">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Account
          </p>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </nav>

      {/* Account Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Studio Owner
            </p>
            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

          <button
            type="button"
            aria-label="Sign out"
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            disabled
            title="Authentication not implemented yet"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
