'use client';
import Image from 'next/image';

export default function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div>
      <Image src={src} alt={alt} width={500} height={500} />
      <p className="text-2xl">{alt}</p>
    </div>
  );
}