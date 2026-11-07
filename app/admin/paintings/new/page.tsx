"use client";

import { useState } from "react";
import ImageUpload from "../components/ImageUpload";

export default function NewPaintingPage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
  return (
    <div className="space-y-8">

      {/* Form */}
      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Painting Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 p-1 block w-full border border-gray-300 rounded-lg bg-grey text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
            placeholder="Enter the painting title"
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
          />
        </div>

        <ImageUpload onImageChange={setImageFile} />

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center mr-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4A4D42] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Painting
          </button>
        </div>
      </form>

    </div>
  );
}