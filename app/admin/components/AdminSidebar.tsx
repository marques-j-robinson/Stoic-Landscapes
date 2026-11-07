
import AdminNavigation from "./AdminNavigation";
import { Mountain, LogOut } from "lucide-react";

export default function AdminSidebar() {
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

      {/* Navigation */}
      <AdminNavigation />

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
            className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"
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
