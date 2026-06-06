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
import { Pricing } from "@/components/landing/sections/Pricing";
import { BannerPublicidadTop, BannerPublicidadFooter } from "@/components/landing/ads/AdBanners";

type AppState = "landing" | "loading" | "result";

// ── Llamada a la API para UNA ciudad (sin cambios) ─────────────────────────────
async function fetchItinerary(form: TripFormData): Promise<ItineraryData> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Fusionar varios ItineraryData en uno solo ──────────────────────────────────
function mergeItineraries(results: ItineraryData[]): ItineraryData {
  if (results.length === 1) return results[0];

  // Calcular offsets acumulados ANTES del flatMap
  const offsets: number[] = [];
  let acc = 0;
  for (const r of results) {
    offsets.push(acc);
    acc += (r.days ?? []).length;
  }

  const allDays = results.flatMap((r, ri) => {
    const offset = offsets[ri];
    return (r.days ?? []).map((d, di) => ({
      ...d,
      dayNum: offset + di + 1,
      theme: `${r.city}: ${d.theme}`,
      items: (d.items ?? []).map(item => ({
        ...item,
        id: `c${ri}_${item.id}`,
      })),
    }));
  });

  const primary = results[0];
  const citiesLabel = results.map(r => r.city).join(" → ");
  const countriesLabel = results.map(r => r.country)
    .filter((c, i, arr) => arr.indexOf(c) === i).join(" / ");

  return {
    ...primary,
    city: citiesLabel,
    country: countriesLabel,
    tagline: `${citiesLabel} — Viaje multidestino`,
    summary: results.map(r => `${r.city}: ${r.summary ?? ""}`).join(" | "),
    days: allDays,
    restaurants: results.flatMap(r => r.restaurants ?? []),
    events:      results.flatMap(r => r.events ?? []),
    alerts:      results.flatMap(r => r.alerts ?? []),
    hotels:      results.flatMap(r => r.hotels ?? []),
    estimatedBudgetPerDay: results
      .map(r => `${r.city}: ${r.estimatedBudgetPerDay ?? ""}`)
      .join(" | "),
  };
}

export default function Home() {
  const [state, setState]         = useState<AppState>("landing");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [lastForm, setLastForm]   = useState<TripFormData | null>(null);
  const [locale, setLocale]       = useState<Locale>("es");
  const [loadingCity, setLoadingCity] = useState("");

  // ── Array de resultados por ciudad — clave para discriminar tabs ───────────
  const [cityResults, setCityResults] = useState<ItineraryData[]>([]);

  // ── Handler destino único ──────────────────────────────────────────────────
  async function handleSubmit(form: TripFormData) {
    setLastForm(form);
    setLocale(form.locale);
    setLoadingCity(`${form.city}, ${form.country}`);
    setState("loading");
    setError(null);
    setCityResults([]);
    try {
      const data = await fetchItinerary(form);
      setCityResults([data]);
      setItinerary(data);
      setState("result");
    } catch {
      setError("No se pudo generar el itinerario. Por favor intenta de nuevo.");
      setState("landing");
    }
  }

  // ── Handler múltiples ciudades ─────────────────────────────────────────────
  async function handleMultiSubmit(
    stops: { form: TripFormData; days: number }[],
    baseForm: TripFormData
  ) {
    if (stops.length === 0) return;
    setLastForm(baseForm);
    setLocale(baseForm.locale);
    setState("loading");
    setError(null);
    setCityResults([]);

    try {
      const results: ItineraryData[] = [];
      for (const stop of stops) {
        setLoadingCity(`${stop.form.city}, ${stop.form.country}`);
        const data = await fetchItinerary(stop.form);
        results.push(data);
      }
      setCityResults(results);
      setItinerary(mergeItineraries(results));
      setState("result");
    } catch {
      setError("No se pudo generar el itinerario. Por favor intenta de nuevo.");
      setState("landing");
    }
  }

  function handleReset() {
    setState("landing");
    setItinerary(null);
    setCityResults([]);
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

      {state === "landing" && (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
          <Navbar locale={locale} onLocaleChange={setLocale} />
          <BannerPublicidadTop />
          <Hero locale={locale} />
          <Destinations locale={locale} />
          <ItineraryGenerator
            onSubmit={handleSubmit}
            onMultiSubmit={handleMultiSubmit}
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

      {state === "loading" && (
        <Loader city={loadingCity} locale={locale} />
      )}

      {state === "result" && itinerary && (
        <ItineraryView
          data={itinerary}
          locale={locale}
          onReset={handleReset}
          form={lastForm}
          cityResults={cityResults}
        />
      )}
    </>
  );
}
