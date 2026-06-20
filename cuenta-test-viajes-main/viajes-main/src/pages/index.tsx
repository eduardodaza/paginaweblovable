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

// ── Llamada de RETRY PARCIAL: solo regenera la sección indicada ────────────
// (días faltantes, metadata, o eventos) sin repetir todo el itinerario,
// para no gastar tokens de nuevo en lo que ya salió bien.
type RetrySection = "days" | "metadata" | "events";
async function fetchItinerarySection(
  form: TripFormData,
  section: RetrySection,
  missingDayNums?: number[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, section, missingDayNums }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Espera N ms (para respetar rate limit de Groq entre ciudades) ───────────
function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Placeholder para una ciudad que falló en multidestino ───────────────────
// Se guarda en vez de descartar la ciudad, para que el conteo de resultados
// sea correcto y el botón "Reintentar [ciudad]" pueda aparecer.
function emptyCityPlaceholder(form: TripFormData): ItineraryData {
  return {
    city: form.city,
    country: form.country,
    tagline: "",
    summary: "",
    weather: { maxTemp: 0, minTemp: 0, description: "" },
    estimatedBudgetPerDay: "",
    days: [],
    restaurants: [],
    events: [],
    alerts: [],
    hotels: [],
    preparation: [],
    gastronomy: [],
    tips: [],
  };
}

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
    // Nuevas secciones: se toman de la primera ciudad (ciudad principal)
    preparation:     results[0]?.preparation,
    gastronomy:      results.flatMap(r => r.gastronomy ?? []),
    tips:            results[0]?.tips,
    budgetBreakdown: results[0]?.budgetBreakdown,
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
        } else {
          // La ciudad no entregó días: guardamos un placeholder vacío
          // (en vez de omitirla) para que el botón "Reintentar [ciudad]"
          // aparezca correctamente y el conteo de ciudades sea el correcto.
          results.push(emptyCityPlaceholder(stop.form));
        }
      } catch (err) {
        console.error(`[multi] Error en ${stop.form.city}:`, err);
        // Continuar con las demás ciudades aunque una falle, pero sin
        // perder el lugar de esa ciudad en los resultados.
        results.push(emptyCityPlaceholder(stop.form));
      }
    }

    if (results.every(r => !r.days?.length)) {
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

  // ── Retry parcial de UNA sección (pestaña) que falló ───────────────────────
  // Se llama desde ItineraryView cuando el usuario pulsa "Reintentar" en una
  // pestaña vacía. Solo regenera esa sección y la fusiona con lo que ya
  // estaba bien, sin repetir toda la búsqueda ni gastar tokens de más.
  // Solo aplica a destino único (multidestino ya tiene su propio retry por ciudad).
  async function handleRetrySection(section: RetrySection) {
    if (!lastForm || !itinerary) return;
    try {
      if (section === "days") {
        const sd = new Date(lastForm.startDate + "T12:00:00");
        const ed = new Date(lastForm.endDate + "T12:00:00");
        const totalDays = Math.round((ed.getTime() - sd.getTime()) / 86400000) + 1;
        const existingNums = new Set((itinerary.days ?? []).map(d => d.dayNum));
        const missing: number[] = [];
        for (let n = 1; n <= totalDays; n++) if (!existingNums.has(n)) missing.push(n);
        if (missing.length === 0) return;

        const partial = await fetchItinerarySection(lastForm, "days", missing);
        setItinerary(prev => {
          if (!prev) return prev;
          const merged = [...(prev.days ?? []), ...(partial.days ?? [])]
            .sort((a, b) => (a.dayNum ?? 0) - (b.dayNum ?? 0));
          return { ...prev, days: merged };
        });
      } else if (section === "events") {
        const partial = await fetchItinerarySection(lastForm, "events");
        setItinerary(prev => {
          if (!prev) return prev;
          const seen = new Set((prev.events ?? []).map(e => (e.name ?? "").toLowerCase().trim()));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newEvents = (partial.events ?? []).filter((e: any) => e?.name && !seen.has(e.name.toLowerCase().trim()));
          return { ...prev, events: [...(prev.events ?? []), ...newEvents] };
        });
      } else if (section === "metadata") {
        const partial = await fetchItinerarySection(lastForm, "metadata");
        setItinerary(prev => {
          if (!prev) return prev;
          const seen = new Set((prev.events ?? []).map(e => (e.name ?? "").toLowerCase().trim()));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newEvents = (partial.metaEvents ?? []).filter((e: any) => e?.name && !seen.has(e.name.toLowerCase().trim()));
          return {
            ...prev,
            tagline: prev.tagline || partial.tagline,
            summary: prev.summary || partial.summary,
            weather: prev.weather ?? partial.weather,
            estimatedBudgetPerDay: prev.estimatedBudgetPerDay || partial.estimatedBudgetPerDay,
            restaurants: (prev.restaurants?.length ? prev.restaurants : partial.restaurants) ?? [],
            alerts: (prev.alerts?.length ? prev.alerts : partial.alerts) ?? [],
            preparation: (prev.preparation?.length ? prev.preparation : partial.preparation) ?? [],
            gastronomy: (prev.gastronomy?.length ? prev.gastronomy : partial.gastronomy) ?? [],
            tips: (prev.tips?.length ? prev.tips : partial.tips) ?? [],
            budgetBreakdown: prev.budgetBreakdown ?? partial.budgetBreakdown,
            events: [...(prev.events ?? []), ...newEvents],
          };
        });
      }
    } catch (err) {
      console.error(`[retry-section:${section}] Error:`, err);
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
          onRetrySection={cityResults.length <= 1 ? handleRetrySection : undefined}
        />
      )}
    </>
  );
}
