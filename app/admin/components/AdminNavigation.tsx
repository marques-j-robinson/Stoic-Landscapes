
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Plus,
  Settings,
} from "lucide-react";

const navigation = [
  {
    section: "Workspace",
    items: [
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
    ],
  },
  {
    section: "Account",
    items: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-6">
      {navigation.map((section) => (
        <div key={section.section} className="mb-8">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {section.section}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
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

        </div>
      ))}
    </nav>
  );
}
