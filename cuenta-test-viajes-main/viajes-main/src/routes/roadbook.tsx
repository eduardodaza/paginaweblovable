import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/sections/Navbar";
import { Footer } from "@/components/landing/sections/Footer";
import { Roadbook } from "@/components/landing/roadbook/Roadbook";

export const Route = createFileRoute("/roadbook")({
  head: () => ({
    meta: [
      { title: "Roadbook · Smart Travel" },
      { name: "description", content: "Itinerario, gastronomía y eventos personalizados con Smart Travel." },
    ],
  }),
  component: RoadbookPage,
});

function RoadbookPage() {
  return (
    <>
      <Navbar />
      <Roadbook />
      <Footer />
    </>
  );
}
