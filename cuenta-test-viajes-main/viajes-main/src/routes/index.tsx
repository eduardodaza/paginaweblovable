import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/sections/Navbar";
import { Hero } from "@/components/landing/sections/Hero";
import { Destinations } from "@/components/landing/destinations/Destinations";
import { ItineraryGenerator } from "@/components/landing/itinerary/ItineraryGenerator";
import { Blog } from "@/components/landing/blog/Blog";
import { Footer } from "@/components/landing/sections/Footer";
import { BannerPublicidadTop, BannerPublicidadFooter } from "@/components/landing/ads/AdBanners";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Travel — Itinerarios de viaje con IA en segundos" },
      { name: "description", content: "Genera itinerarios personalizados con inteligencia artificial según tus fechas, presupuesto e intereses. Descubre los mejores destinos del mundo." },
      { property: "og:title", content: "Smart Travel — Itinerarios de viaje con IA" },
      { property: "og:description", content: "El viaje perfecto creado por ti mismo. Itinerarios personalizados generados con IA en segundos." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Smart Travel — Itinerarios de viaje con IA" },
      { name: "twitter:description", content: "Itinerarios personalizados generados con IA en segundos." },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Smart Travel",
          applicationCategory: "TravelApplication",
          description: "Generador de itinerarios de viaje personalizados con IA.",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <BannerPublicidadTop />
      <main>
        <Hero />
        <Destinations />
        <ItineraryGenerator />
        <Blog />
      </main>
      <BannerPublicidadFooter />
      <Footer />
    </div>
  );
}
