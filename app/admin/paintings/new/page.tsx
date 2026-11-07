"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";

export default function NewPaintingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError(null);

    // Basic frontend validation.
    if (!imageFile) {
      setSubmitError("Please select an image for your painting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);

      const response = await fetch("/api/paintings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create painting.");
      }

      // We'll add the success behavior next.
      router.push("/admin");
      router.refresh();

    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the painting."
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="space-y-8">

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Painting Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 p-1 block w-full border border-gray-300 rounded-lg bg-grey text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
            placeholder="Enter the painting title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 p-1 block w-full border border-gray-300 rounded-lg bg-grey text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
            placeholder="Enter the painting description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <ImageUpload onImageChange={setImageFile} />
        
        {/* Submission error */}
        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center mr-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4A4D42] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? "Saving Painting..." : "Save Painting"}
          </button>
        </div>
      </form>

    </div>
  );
}