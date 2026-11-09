import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export interface Painting {
  id: number;
  title: string;
  description: string;
  imageKey: string;
  contentType: string;
  imageUrl: string; // Added property for the image URL
}

interface PaintingCardProps {
  painting: Painting;
  onDelete: (id: number) => void;
}

export default function PaintingCard({
  painting,
  onDelete,
}: PaintingCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#E5E5DF] bg-white transition-shadow hover:shadow-md">
      {/* Painting image */}
      <div className="relative aspect-[3/2] bg-[#F0F0EB]">
        <Image
          src={painting.imageUrl}
          alt={painting.title}
          fill
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>

      {/* Painting information */}
      <div className="space-y-3 p-4">
        <div>
          <h2 className="font-semibold text-[#34372F]">
            {painting.title}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {painting.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-[#E5E5DF] pt-3">
          <Link
            href={`/admin/paintings/${painting.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#686D55] hover:text-[#34372F]"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(painting.id)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
