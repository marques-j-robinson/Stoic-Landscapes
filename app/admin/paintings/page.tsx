
import { Suspense } from "react";
import PaintingsContent from "./components/PaintingsContent";
import { Painting } from "./components/PaintingCard";

async function PaintingsData() {
  const response = await fetch(
    `${process.env.APP_URL}/api/paintings`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to retrieve paintings.");
  }

  const paintings: Painting[] = await response.json();

  return <PaintingsContent initialPaintings={paintings} />;
}

export default function PaintingsPage() {
  return (
    <Suspense fallback={<div>Loading paintings...</div>}>
      <PaintingsData />
    </Suspense>
  );
}
