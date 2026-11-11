
import { notFound } from "next/navigation";
import EditPaintingForm from "../components/EditPaintingForm";

interface Painting {
    id: number;
    title: string;
    description: string;
    imageKey: string;
    contentType: string;
    imageUrl: string;
}

export default async function EditPaintingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const response = await fetch(
        `${process.env.APP_URL}/api/paintings/${id}`,
        { cache: "no-store" }
    );

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error("Failed to retrieve painting.");
    }

    const painting: Painting = await response.json();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#34372F]">
                    Edit Painting
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update your artwork and its details.
                </p>
            </div>

            <EditPaintingForm painting={painting} />
        </div>
    );
}
