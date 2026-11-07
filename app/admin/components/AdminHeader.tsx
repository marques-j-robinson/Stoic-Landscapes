
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronRight, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/paintings": "Paintings",
  "/admin/paintings/new": "Add Painting",
  "/admin/settings": "Settings",
};

export default function AdminHeader() {
  const pathname = usePathname();

  const pageTitle =
    pageTitles[pathname] ??
    (pathname.startsWith("/admin/paintings/")
      ? "Edit Painting"
      : "Admin");

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* Page Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-[#292A26]">
          {pageTitle}
        </h1>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-6">

        {/* Public Website Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#44483B]"
        >
          View Website
          <ExternalLink className="h-4 w-4" />
        </Link>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* Account */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9E9DF] text-[#44483B]">
            <User className="h-5 w-5" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#292A26]">
              Studio Owner
            </p>
            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>

          <ChevronRight className="h-4 w-4 rotate-90 text-gray-400" />
        </div>

      </div>
    </header>
  );
}
