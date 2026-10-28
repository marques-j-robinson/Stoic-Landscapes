import Image from "next/image";
import GalleryImage from "@/components/GalleryImage";

const images = [
  { src: "https://placehold.co/500x500.png", alt: "Example image" },
  { src: "https://placehold.co/500x500.png", alt: "Another example image" },
  { src: "https://placehold.co/500x500.png", alt: "Yet another example image" },
  { src: "https://placehold.co/500x500.png", alt: "One more example image" },
  { src: "https://placehold.co/500x500.png", alt: "Final example image" },
  { src: "https://placehold.co/500x500.png", alt: "Yet another example image" },
  { src: "https://placehold.co/500x500.png", alt: "One more example image" },
  { src: "https://placehold.co/500x500.png", alt: "Final example image" },
  { src: "https://placehold.co/500x500.png", alt: "Final example image" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image spanning across the screen */}
        <Image
          src='/hero-bg.jpg'
          alt="Hero background"
          fill
          priority
          className="object-cover object-center z-1"
        />

        <div className="absolute inset-0 bg-black/40 z-2" />

        {/* Optional gradient/dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        {/* Hero Content */}
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Stoic Landscapes</h1>
          <p className="mt-4 text-lg md:text-xl">The Art of Quiet Strength</p>
          <p className="mt-4 text-lg md:text-xl">Marques Robinson</p>
        </div>
      </section>
      
      {/* Gallery Section */}
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {images.map((image, index) => (
          <GalleryImage key={index} src={image.src} alt={image.alt} />
        ))}
        </div>
      </main>
    </div>
  );
}
