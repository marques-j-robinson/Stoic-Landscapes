import Link from "next/link";
import { db, Painting } from "@/lib/db";
import {
  Images,
  Plus,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";

export default async function DashboardContent() {
  const [paintings] = await db.execute<Painting[]>(
    "SELECT * FROM paintings ORDER BY created_at DESC"
  );

  const totalPaintings = paintings.length;
  const recentPaintings = paintings.slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#292A26]">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your artwork and gallery.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Paintings
            </p>
            <Images className="h-5 w-5 text-[#85876B]" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-[#292A26]">
            {totalPaintings}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Recently Added
            </p>
            <ImageIcon className="h-5 w-5 text-[#85876B]" />
          </div>

          <p className="mt-4 text-3xl font-semibold text-[#292A26]">
            {recentPaintings.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Latest five paintings
          </p>
        </div>

        {/* Quick Action */}
        <Link
          href="/admin/paintings/new"
          className="flex items-center justify-between rounded-lg bg-[#44483B] p-6 text-white transition-colors hover:bg-[#36392F]"
        >
          <div>
            <p className="text-sm font-medium text-gray-200">
              Add New Artwork
            </p>
            <p className="mt-2 text-lg font-semibold">
              Upload a painting
            </p>
          </div>

          <Plus className="h-7 w-7" />
        </Link>
      </div>

      {/* Recent Paintings */}
      <section className="rounded-lg border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="font-semibold text-[#292A26]">
              Recent Paintings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest additions.
            </p>
          </div>

          <Link
            href="/admin/paintings"
            className="flex items-center gap-2 text-sm font-medium text-[#77795F] hover:text-[#44483B]"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPaintings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Images className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-4 font-medium text-gray-600">
              No paintings yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Start building your gallery by adding your first painting.
            </p>

            <Link
              href="/admin/paintings/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#44483B] px-4 py-2 text-sm text-white hover:bg-[#36392F]"
            >
              <Plus className="h-4 w-4" />
              Add Painting
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentPaintings.map((painting) => (
              <div
                key={painting.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-[#292A26]">
                    {painting.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Added{" "}
                    {new Date(painting.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  href={`/admin/paintings/${painting.id}`}
                  className="text-sm font-medium text-[#77795F] hover:text-[#44483B]"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}