import { Suspense } from "react";
import DashboardContent from "./components/DashboardContent";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 rounded-lg bg-gray-200"
          />
        ))}
      </div>

      <div className="h-64 rounded-lg bg-gray-200" />
    </div>
  );
}