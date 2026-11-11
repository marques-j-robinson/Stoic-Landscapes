
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "./ImageUpload";

interface Painting {
    id: number;
    title: string;
    description: string;
    imageKey: string;
    contentType: string;
    imageUrl: string;
}

interface EditPaintingFormProps {
    painting: Painting;
}

export default function EditPaintingForm({
    painting,
}: EditPaintingFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(painting.title);
    const [description, setDescription] = useState(
        painting.description
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSubmitError(null);
        setIsSubmitting(true);

        try {
            // Step 1: Update painting details.
            const response = await fetch(`/api/paintings/${painting.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to update painting details."
                );
            }

            // Step 2: Replace image only if a new one was selected.
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const imageResponse = await fetch(
                    `/api/paintings/${painting.id}/image`,
                    {
                        method: "PUT",
                        body: formData,
                    }
                );

                const imageResult = await imageResponse.json();

                if (!imageResponse.ok) {
                    throw new Error(
                        imageResult.error || "Painting details were saved, but the image could not be replaced."
                    );
                }
            }

            // Return to the paintings collection.
            window.location.href = "/admin/paintings";

        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while updating the painting."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

            {/* Painting details */}
            <section className="space-y-5 rounded-xl border border-[#E5E5DF] bg-white p-6">
                <div>
                    <h2 className="text-lg font-semibold text-[#34372F]">
                        Painting Details
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Update the information associated with this artwork.
                    </p>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-[#34372F]"
                    >
                        Painting Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                        className="w-full rounded-md border border-[#E5E5DF] text-black px-3 py-2.5 text-sm outline-none focus:border-[#686D55]"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-[#34372F]"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={5}
                        required
                        className="w-full resize-y rounded-md border border-[#E5E5DF] text-black px-3 py-2.5 text-sm outline-none focus:border-[#686D55]"
                    />
                </div>
            </section>

            {/* Current image and replacement upload */}
            <section className="space-y-5 rounded-xl border border-[#E5E5DF] bg-white p-6">
                <div>
                    <h2 className="text-lg font-semibold text-[#34372F]">
                        Artwork Image
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Your current image is shown below. Select a new image
                        only if you want to replace it.
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-[#34372F]">
                        Current Image
                    </p>

                    <div className="relative aspect-[3/2] max-w-lg overflow-hidden rounded-lg bg-[#F0F0EB]">
                        <img
                            src={painting.imageUrl}
                            alt={painting.title}
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>

                <div className="border-t border-[#E5E5DF] pt-5">
                    <ImageUpload onImageChange={setImageFile} />
                </div>
            </section>

            {/* Submission error */}
            {submitError && (
                <p role="alert" className="text-sm text-red-600">
                    {submitError}
                </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
                <Link
                    href="/admin/paintings"
                    className="rounded-md border border-[#E5E5DF] px-4 py-2.5 text-sm font-medium text-[#34372F] hover:bg-gray-50"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-[#34372F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4A4D42] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
