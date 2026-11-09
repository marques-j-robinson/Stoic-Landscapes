"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import PaintingCard, { Painting } from "./PaintingCard";

interface PaintingsContentProps {
  initialPaintings: Painting[];
}

export default function PaintingsContent({
  initialPaintings,
}: PaintingsContentProps) {
  const [paintings, setPaintings] = useState(initialPaintings);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Filter paintings based on the search input.
  const filteredPaintings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return paintings;

    return paintings.filter((painting) =>
      painting.title.toLowerCase().includes(query)
    );
  }, [paintings, search]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this painting? This cannot be undone."
    );

    if (!confirmed) return;

    setError(null);

    try {
      const response = await fetch(`/api/paintings/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete painting.");
      }

      setPaintings((current) =>
        current.filter((painting) => painting.id !== id)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete painting."
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#34372F]">
            Paintings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your artwork collection.
          </p>
        </div>

        <Link
          href="/admin/paintings/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#34372F] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4A4D42]"
        >
          <Plus size={18} />
          Add Painting
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search paintings..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-md border border-[#E5E5DF] bg-white py-2.5 pl-10 pr-4 text-sm text-black outline-none focus:border-[#686D55]"
        />
      </div>

      {/* Error message */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Collection count */}
      <p className="text-sm text-gray-500">
        Showing {filteredPaintings.length} of {paintings.length} paintings
      </p>

      {/* Painting grid */}
      {filteredPaintings.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPaintings.map((painting) => (
            <PaintingCard
              key={painting.id}
              painting={painting}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D8D8D0] bg-white px-6 py-16 text-center">
          <h2 className="font-medium text-[#34372F]">
            {paintings.length === 0
              ? "Your collection is empty"
              : "No paintings found"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {paintings.length === 0
              ? "Add your first painting to get started."
              : "Try searching with a different title."}
          </p>

          {paintings.length === 0 && (
            <Link
              href="/admin/paintings/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#34372F] px-4 py-2 text-sm text-white"
            >
              <Plus size={16} />
              Add Painting
            </Link>
          )}
        </div>
      )}
    </div>
  );
}