
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ImageUpload({
  onImageChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Create and clean up the image preview URL.
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleFile(file: File | undefined) {
    if (!file) return;

    // Validate file type.
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size.
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    onImageChange(file);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleFile(event.target.files?.[0]);

    // Allow selecting the same file again.
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onImageChange(null);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">
        Artwork Image
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {selectedFile && previewUrl ? (
        // Image preview
        <div className="relative overflow-hidden rounded-lg border border-[#E5E5DF] bg-gray">
          <div className="aspect-[3/2] p-5 w-full bg-gray">
            <img
              src={previewUrl}
              alt="Selected painting preview"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E5DF] p-3 bg-white">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#34372F]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-sm font-medium text-[#686D55] hover:text-[#34372F]"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload drop zone
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-[#686D55] bg-[#F0F1EB]"
              : "border-[#D8D8D0] bg-grey hover:border-[#A4A791]"
          }`}
        >
          <div className="mb-3 rounded-full bg-[#F0F1EB] p-3">
            <ImagePlus size={26} className="text-[#686D55]" />
          </div>

          <p className="text-sm font-medium text-gray-500">
            Drag and drop your painting here
          </p>

          <p className="mt-1 text-sm text-gray-500">
            or
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#34372F] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A4D42]"
          >
            <Upload size={16} />
            Browse Files
          </button>

          <p className="mt-4 text-xs text-gray-500">
            JPEG, PNG, or WebP · Maximum 10 MB
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
