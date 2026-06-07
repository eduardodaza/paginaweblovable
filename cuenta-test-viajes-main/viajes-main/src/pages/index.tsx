// src/pages/index.tsx — lógica multi-ciudad con retry por ciudad
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

// ── Llamada a la API para UNA ciudad (sin cambios) ─────────────────────────
async function fetchItinerary(form: TripFormData): Promise<ItineraryData> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Espera N ms (para respetar rate limit de Groq entre ciudades) ───────────
function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Fusionar varios ItineraryData en uno solo ───────────────────────────────
function mergeItineraries(results: ItineraryData[]): ItineraryData {
  if (results.length === 1) return results[0];

  const offsets: number[] = [];
  let acc = 0;
  for (const r of results) {
    offsets.push(acc);
    acc += (r.days ?? []).length;
  }

  const allDays = results.flatMap((r, ri) =>
    (r.days ?? []).map((d, di) => ({
      ...d,
      dayNum: offsets[ri] + di + 1,
      theme: `${r.city}: ${d.theme}`,
      items: (d.items ?? []).map(item => ({
        ...item,
        id: `c${ri}_${item.id}`,
      })),
    }))
  );

  const primary = results[0];
  return {
    ...primary,
    city:    results.map(r => r.city).join(" → "),
    country: results.map(r => r.country).filter((c, i, a) => a.indexOf(c) === i).join(" / "),
    tagline: results.map(r => r.city).join(" → ") + " — Viaje multidestino",
    summary: results.map(r => `${r.city}: ${r.summary ?? ""}`).join(" | "),
    days:    allDays,
    restaurants: results.flatMap(r => r.restaurants ?? []),
    events:      results.flatMap(r => r.events ?? []),
    alerts:      results.flatMap(r => r.alerts ?? []),
    hotels:      results.flatMap(r => r.hotels ?? []),
    estimatedBudgetPerDay: results
      .map(r => `${r.city}: ${r.estimatedBudgetPerDay ?? ""}`).join(" | "),
  };
}

export default function Home() {
  const [state, setState]         = useState<AppState>("landing");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [lastForm, setLastForm]   = useState<TripFormData | null>(null);
  const [locale, setLocale]       = useState<Locale>("es");
  const [loadingCity, setLoadingCity] = useState("");
  const [cityResults, setCityResults] = useState<ItineraryData[]>([]);

  // Guardamos los forms originales para poder hacer retry por ciudad
  const [stopForms, setStopForms] = useState<TripFormData[]>([]);

  // ── Destino único ──────────────────────────────────────────────────────────
  async function handleSubmit(form: TripFormData) {
    setLastForm(form);
    setLocale(form.locale);
    setLoadingCity(`${form.city}, ${form.country}`);
    setState("loading");
    setError(null);
    setCityResults([]);
    setStopForms([form]);
    try {
      const data = await fetchItinerary(form);
      setCityResults([data]);
      setItinerary(data);
      setState("result");
    } catch {
      setError("No se pudo generar el itinerario. Intenta de nuevo.");
      setState("landing");
    }
  }

  // ── Múltiples ciudades — una llamada por ciudad con delay entre ellas ───────
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
    setStopForms(stops.map(s => s.form));

    const results: ItineraryData[] = [];
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      setLoadingCity(`${stop.form.city}, ${stop.form.country} (${i + 1}/${stops.length})`);

      // Esperar entre ciudades para respetar el rate limit de Groq (6000 TPM)
      if (i > 0) await wait(15000);

      try {
        const data = await fetchItinerary(stop.form);
        if (data?.days?.length > 0) {
          results.push(data);
        }
      } catch (err) {
        console.error(`[multi] Error en ${stop.form.city}:`, err);
        // Continuar con las demás ciudades aunque una falle
      }
    }

    if (results.length === 0) {
      setError("No se pudo generar el itinerario. Intenta de nuevo.");
      setState("landing");
      return;
    }

    setCityResults(results);
    setItinerary(mergeItineraries(results));
    setState("result");
  }

  // ── Retry de UNA ciudad que falló ─────────────────────────────────────────
  // Se llama desde ItineraryView cuando el usuario pulsa "Reintentar" en una sección
  async function handleRetryCity(cityIndex: number) {
    const form = stopForms[cityIndex];
    if (!form) return;
    try {
      const data = await fetchItinerary(form);
      if (data?.days?.length > 0) {
        const newResults = [...cityResults];
        newResults[cityIndex] = data;
        setCityResults(newResults);
        setItinerary(mergeItineraries(newResults));
      }
    } catch (err) {
      console.error(`[retry] Error en ${form.city}:`, err);
    }
  }

  function handleReset() {
    setState("landing");
    setItinerary(null);
    setCityResults([]);
    setStopForms([]);
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
          onRetryCity={handleRetryCity}
        />
      )}
    </>
  );
}
