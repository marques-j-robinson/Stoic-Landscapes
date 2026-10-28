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
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {images.map((image, index) => (
          <GalleryImage key={index} src={image.src} alt={image.alt} />
        ))}
        </div>
      </main>
    </div>
  );
}
