// src/pages/index.tsx
import React, { useState } from "react";
import Head from "next/head";
import type { TripFormData, ItineraryData, Locale } from "@/lib/types";
import Loader from "@/components/Loader";
import ItineraryView from "@/components/ItineraryView";

import { Navbar } from "@/components/landing/sections/Navbar";
import { Hero } from "@/components/landing/sections/Hero";
import { Footer } from "@/components/landing/sections/Footer";
import { Destinations } from "@/components/landing/destinations/Destinations";
import { ItineraryGenerator } from "@/components/landing/itinerary/ItineraryGenerator";
import { Blog } from "@/components/landing/blog/Blog";
import {
  BannerPublicidadTop,
  BannerPublicidadFooter,
} from "@/components/landing/ads/AdBanners";

type AppState = "landing" | "loading" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastForm, setLastForm] = useState<TripFormData | null>(null);
  const [locale, setLocale] = useState<Locale>("es");

  async function handleSubmit(form: TripFormData) {
    setLastForm(form);
    setLocale(form.locale);
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ItineraryData = await res.json();
      setItinerary(data);
      setState("result");
    } catch (err) {
      setError("Failed to generate itinerary. Please try again.");
      setState("landing");
    }
  }

  function handleReset() {
    setState("landing");
    setItinerary(null);
    setError(null);
  }

  return (
    <>
      <Head>
        <title>Smart Travel — Itinerarios turísticos inteligentes</title>
        <meta
          name="description"
          content="Genera itinerarios turísticos personalizados con IA. Lugares, restaurantes, eventos y alertas de seguridad en segundos."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {state === "landing" && (
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Navbar />
          <BannerPublicidadTop />
          <Hero />
          <Destinations />
          <ItineraryGenerator />
          <Blog />
          <BannerPublicidadFooter />
          <Footer />
        </div>
      )}

      {state === "loading" && lastForm && (
        <Loader city={`${lastForm.city}, ${lastForm.country}`} locale={locale} />
      )}

      {state === "result" && itinerary && (
        <ItineraryView
          data={itinerary}
          locale={locale}
          onReset={handleReset}
          form={lastForm}
        />
      )}
    </>
  );
}
