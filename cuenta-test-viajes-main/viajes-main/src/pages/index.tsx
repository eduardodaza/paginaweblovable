// src/pages/index.tsx — INTOCABLE la lógica funcional; solo mejoras visuales en landing
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
import { Pricing } from "@/components/landing/sections/Pricing";
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
    } catch {
      setError("No se pudo generar el itinerario. Por favor intenta de nuevo.");
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
        <title>Smart Travel — Planifica tu viaje completo en minutos</title>
        <meta name="description" content="Planifica tu viaje completo en menos de un minuto. Lugares, restaurantes, eventos y alertas de seguridad en segundos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── LANDING ── */}
      {state === "landing" && (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
          <Navbar locale={locale} onLocaleChange={setLocale} />
          <BannerPublicidadTop />
          <Hero locale={locale} />
          <Destinations locale={locale} />
          <ItineraryGenerator
            onSubmit={handleSubmit}
            locale={locale}
            onLocaleChange={setLocale}
          />
          {error && (
            <div className="max-w-5xl mx-auto px-6 -mt-6 mb-6">
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                ⚠️ {error}
              </div>
            </div>
          )}
          <Blog locale={locale} />
          <Pricing locale={locale} />
          <BannerPublicidadFooter />
          <Footer locale={locale} />
        </div>
      )}

      {/* ── LOADING ── */}
      {state === "loading" && lastForm && (
        <Loader city={`${lastForm.city}, ${lastForm.country}`} locale={locale} />
      )}

      {/* ── RESULT ── */}
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
