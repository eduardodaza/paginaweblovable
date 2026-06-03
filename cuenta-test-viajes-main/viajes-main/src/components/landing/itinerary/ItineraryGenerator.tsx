// src/components/landing/itinerary/ItineraryGenerator.tsx
// ⚠️ LÓGICA FUNCIONAL INTACTA — solo cambios de presentación/estilo visual

import React, { useState, useEffect } from "react";
import type { TripFormData, Budget, TravelerType, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { MapPin, Calendar, Users, Clock, Sparkles, Globe2, ChevronDown } from "lucide-react";

const INTERESTS = [
  "🏛️ Historia & Cultura", "🍽️ Gastronomía", "🌿 Naturaleza",
  "🎵 Vida nocturna", "🛍️ Compras", "🎨 Arte & Museos",
  "🧗 Aventura", "📷 Fotografía", "🧘 Bienestar", "👨‍👩‍👧 Familiar",
  "🏖️ Playas", "⚽ Deporte",
];

const BUDGETS: Budget[] = ["economico", "moderado", "premium", "lujo"];
const BUDGET_SHORT: Record<Budget, string> = {
  economico: "$", moderado: "$$", premium: "$$$", lujo: "ELITE",
};
const BUDGET_LABELS: Record<Budget, { es: string; en: string; color: string; bg: string }> = {
  economico: { es: "Económico",  en: "Budget",   color: "#0f6e56", bg: "#e1f5ee" },
  moderado:  { es: "Moderado",   en: "Moderate", color: "#633806", bg: "#faeeda" },
  premium:   { es: "Premium",    en: "Premium",  color: "#3c3489", bg: "#eeedfe" },
  lujo:      { es: "Lujo ✦",    en: "Luxury ✦", color: "#7d4400", bg: "#fff0d0" },
};
const TRAVELER_ICONS: Record<TravelerType, string> = {
  pareja: "💑", familia: "👨‍👩‍👧", amigos: "👯", solo: "🧳", negocios: "💼",
};

interface Props {
  onSubmit: (data: TripFormData) => void;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}

export function ItineraryGenerator({ onSubmit, locale, onLocaleChange }: Props) {
  // ── Estado (intacto) ──────────────────────────────────────────────────────
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [travelerType, setTravelerType] = useState<TravelerType>("pareja");
  const [budget, setBudget] = useState<Budget>("moderado");
  const [interests, setInterests] = useState<string[]>([
    "🏛️ Historia & Cultura", "🍽️ Gastronomía",
  ]);
  const [dayStartTime, setDayStartTime] = useState("08:00");
  const [dayEndTime, setDayEndTime] = useState("23:00");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<{ city: string; country: string }[]>([]);
  const [showCitySuggest, setShowCitySuggest] = useState(false);

  // ── Effects (intactos) ────────────────────────────────────────────────────
  useEffect(() => {
    const q = city.trim();
    if (q.length < 2) { setCitySuggestions([]); return; }
    const ctrl = new AbortController();
    const tm = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&accept-language=${locale}`;
        const res = await fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } });
        if (!res.ok) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = await res.json();
        const seen = new Set<string>();
        const list: { city: string; country: string }[] = [];
        for (const r of data) {
          const a = r.address || {};
          const cityName = a.city || a.town || a.village || a.municipality || a.county || r.display_name?.split(",")[0];
          const countryName = a.country;
          if (!cityName || !countryName) continue;
          const k = `${cityName}|${countryName}`.toLowerCase();
          if (seen.has(k)) continue;
          seen.add(k);
          list.push({ city: cityName, country: countryName });
          if (list.length >= 6) break;
        }
        setCitySuggestions(list);
      } catch { /* silent */ }
    }, 300);
    return () => { ctrl.abort(); clearTimeout(tm); };
  }, [city, locale]);

  useEffect(() => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + 3);
    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    const sd = new Date(startDate + "T12:00:00");
    const ed = new Date(endDate + "T12:00:00");
    if (ed < sd) { setDateRange(""); return; }
    const days = Math.round((ed.getTime() - sd.getTime()) / 86400000) + 1;
    const fmt = (d: Date) =>
      d.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
        day: "numeric", month: "short", year: "numeric",
      });
    setDateRange(`${fmt(sd)} → ${fmt(ed)} · ${days} ${days > 1 ? (locale === "es" ? "días" : "days") : locale === "es" ? "día" : "day"}`);
  }, [startDate, endDate, locale]);

  // ── Funciones (intactas) ──────────────────────────────────────────────────
  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!city.trim()) errs.city = t("errorRequired", locale);
    if (!country.trim()) errs.country = t("errorRequired", locale);
    if (!startDate) errs.startDate = t("errorRequired", locale);
    if (!endDate) errs.endDate = t("errorRequired", locale);
    if (startDate && endDate && new Date(endDate) < new Date(startDate))
      errs.endDate = t("errorDateRange", locale);
    if (dayStartTime && dayEndTime && dayEndTime <= dayStartTime)
      errs.dayEndTime = locale === "es" ? "Debe ser posterior a la hora de inicio" : "Must be after start time";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ city, country, startDate, endDate, travelers, travelerType, budget, interests, locale, dayStartTime, dayEndTime });
  }

  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  const es = locale === "es";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="generador"
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(260 45% 12%) 40%, hsl(290 35% 10%) 100%)",
      }}
    >
      {/* Fondo decorativo: imagen de destino con overlay */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1800&q=60"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Partículas decorativas */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[
          { top: "10%",  left: "5%",   w: 300, color: "hsl(12 85% 55% / 0.12)" },
          { top: "60%",  left: "75%",  w: 400, color: "hsl(260 80% 60% / 0.1)" },
          { top: "30%",  left: "55%",  w: 200, color: "hsl(180 70% 50% / 0.08)" },
          { top: "80%",  left: "15%",  w: 250, color: "hsl(320 70% 55% / 0.08)" },
        ].map((s, i) => (
          <div key={i} className="absolute rounded-full blur-3xl"
            style={{ top: s.top, left: s.left, width: s.w, height: s.w, background: s.color }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Cabecera de sección ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-5 border"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
            <Sparkles style={{ width: 12, height: 12, color: "hsl(12 85% 65%)" }} />
            {es ? "Generador con IA" : "AI Generator"}
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            {es ? "Diseña tu" : "Design your"}{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, hsl(12 85% 65%), hsl(38 95% 65%), hsl(280 80% 75%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {es ? "viaje perfecto" : "perfect trip"}
            </span>
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            {es
              ? "Completa el formulario y nuestra IA construye un itinerario completo en segundos."
              : "Fill in the form and our AI builds a full itinerary in seconds."}
          </p>
        </div>

        {/* ── Tarjeta del formulario ── */}
        <div
          className="rounded-3xl relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Barra superior arcoíris */}
          <div className="absolute top-0 left-0 w-full h-1"
            style={{ background: "linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 80% 65%), hsl(200 80% 60%), hsl(160 70% 50%))" }} />

          {/* Header con idioma */}
          <div className="flex justify-between items-center px-8 pt-8 pb-0">
            <div className="flex items-center gap-2">
              <Globe2 style={{ width: 14, height: 14, color: "rgba(255,255,255,0.4)" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                {es ? "Manifiesto del viaje (v.01)" : "Trip Manifest (v.01)"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-full p-1 text-[10px] font-mono"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {(["es", "en"] as Locale[]).map((loc) => (
                  <button key={loc} type="button" onClick={() => onLocaleChange(loc)}
                    className={`px-3 py-1 rounded-full transition-all ${locale === loc
                      ? "text-white font-semibold"
                      : "text-white/40 hover:text-white/70"
                    }`}
                    style={locale === loc ? { background: "rgba(255,255,255,0.15)" } : {}}>
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="hidden sm:inline text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{tz}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ── Ciudad + País ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Ciudad */}
              <div className="relative">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  <MapPin style={{ width: 11, height: 11 }} /> {t("city", locale)}
                </label>
                <div className="relative">
                  <input
                    type="text" value={city}
                    onChange={(e) => { setCity(e.target.value); setShowCitySuggest(true); }}
                    onFocus={(e) => { setShowCitySuggest(true); e.currentTarget.style.borderColor = "hsl(12 85% 65%)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onBlur={(e) => { setTimeout(() => setShowCitySuggest(false), 200); e.currentTarget.style.borderColor = errors.city ? "#f87171" : "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    autoComplete="off"
                    placeholder={es ? "Ej. Barcelona" : "e.g. Kyoto"}
                    className="w-full text-xl font-bold bg-transparent outline-none transition-all py-3 px-4 rounded-2xl placeholder:font-normal"
                    style={{
                      color: "#fff",
                      border: `1.5px solid ${errors.city ? "#f87171" : "rgba(255,255,255,0.15)"}`,
                      background: "rgba(255,255,255,0.06)",
                      fontSize: 18,
                    }}
                  />
                  {showCitySuggest && citySuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full z-30 mt-1 overflow-auto text-sm rounded-2xl border"
                      style={{ background: "hsl(240 30% 12%)", border: "1px solid rgba(255,255,255,0.15)", maxHeight: 220, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                      {citySuggestions.map((s, i) => (
                        <li key={i}
                          onMouseDown={(e) => { e.preventDefault(); setCity(s.city); setCountry(s.country); setShowCitySuggest(false); }}
                          className="px-4 py-3 cursor-pointer flex items-center gap-2 transition-colors"
                          style={{ borderBottom: i < citySuggestions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <MapPin style={{ width: 12, height: 12, color: "hsl(12 85% 65%)", flexShrink: 0 }} />
                          <span className="font-semibold text-white">{s.city}</span>
                          <span style={{ color: "rgba(255,255,255,0.45)" }}>· {s.country}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.city && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.city}</p>}
              </div>

              {/* País */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Globe2 style={{ width: 11, height: 11 }} /> {t("country", locale)}
                </label>
                <input
                  type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                  placeholder={es ? "España" : "Japan"}
                  autoComplete="off"
                  className="w-full text-xl font-bold bg-transparent outline-none transition-all py-3 px-4 rounded-2xl placeholder:font-normal placeholder:text-white/25"
                  style={{
                    color: "#fff",
                    border: `1.5px solid ${errors.country ? "#f87171" : "rgba(255,255,255,0.15)"}`,
                    background: "rgba(255,255,255,0.06)",
                    fontSize: 18,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(38 95% 65%)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.country ? "#f87171" : "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                />
                {errors.country && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.country}</p>}
              </div>
            </div>

            {/* ── Fechas + Viajeros ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: t("startDate", locale), icon: Calendar, val: startDate, set: setStartDate, type: "date", err: errors.startDate, accentColor: "hsl(160 70% 55%)" },
                { label: t("endDate", locale),   icon: Calendar, val: endDate,   set: setEndDate,   type: "date", err: errors.endDate,   accentColor: "hsl(200 80% 60%)" },
                { label: t("travelers", locale),  icon: Users,    val: travelers, set: (v: any) => setTravelers(Number(v)), type: "number", err: "", accentColor: "hsl(280 75% 65%)" },
              ].map(({ label, icon: Icon, val, set, type, err, accentColor }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Icon style={{ width: 11, height: 11 }} /> {label}
                  </label>
                  <input
                    type={type} value={val} onChange={(e) => set(e.target.value)}
                    min={type === "number" ? 1 : undefined} max={type === "number" ? 20 : undefined}
                    className="w-full font-mono text-sm py-3 px-4 rounded-2xl outline-none transition-all"
                    style={{
                      color: "#fff", background: "rgba(255,255,255,0.06)",
                      border: `1.5px solid ${err ? "#f87171" : "rgba(255,255,255,0.15)"}`,
                      colorScheme: "dark",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = err ? "#f87171" : "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  />
                  {err && <p className="text-red-400 text-[11px] mt-1 ml-1">{err}</p>}
                </div>
              ))}
            </div>

            {/* ── Horario del día ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: es ? "Hora de inicio del día" : "Day start time", val: dayStartTime, set: setDayStartTime, err: "", accentColor: "hsl(38 95% 65%)" },
                { label: es ? "Hora de cierre del día" : "Day end time",   val: dayEndTime,   set: setDayEndTime,   err: errors.dayEndTime, accentColor: "hsl(320 80% 65%)" },
              ].map(({ label, val, set, err, accentColor }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Clock style={{ width: 11, height: 11 }} /> {label}
                  </label>
                  <input
                    type="time" value={val} onChange={(e) => set(e.target.value)}
                    className="w-full font-mono text-sm py-3 px-4 rounded-2xl outline-none transition-all"
                    style={{
                      color: "#fff", background: "rgba(255,255,255,0.06)",
                      border: `1.5px solid ${err ? "#f87171" : "rgba(255,255,255,0.15)"}`,
                      colorScheme: "dark",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = err ? "#f87171" : "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  />
                  {err && <p className="text-red-400 text-[11px] mt-1 ml-1">{err}</p>}
                </div>
              ))}
            </div>

            {/* Resumen de fechas */}
            {dateRange && (
              <div className="flex items-center gap-3 text-xs font-mono px-4 py-2.5 rounded-xl -mt-2"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                <span>🗓</span>
                <span>{dateRange}</span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <span>⏰ {dayStartTime} → {dayEndTime}</span>
              </div>
            )}

            {/* Separador */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

            {/* ── Tipo de viajero ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 flex items-center gap-1.5"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                <Users style={{ width: 11, height: 11 }} /> {t("travelerType", locale)}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["pareja", "familia", "amigos", "solo", "negocios"] as TravelerType[]).map((tt) => {
                  const active = travelerType === tt;
                  return (
                    <button type="button" key={tt} onClick={() => setTravelerType(tt)}
                      className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 flex items-center gap-1.5"
                      style={active ? {
                        background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))",
                        color: "#fff",
                        border: "1.5px solid transparent",
                        boxShadow: "0 4px 16px hsl(12 85% 55% / 0.4)",
                        transform: "scale(1.05)",
                      } : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.65)",
                        border: "1.5px solid rgba(255,255,255,0.1)",
                      }}>
                      <span>{TRAVELER_ICONS[tt]}</span>
                      {t(tt, locale)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Presupuesto ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 block"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("budget", locale)}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {BUDGETS.map((b) => {
                  const active = budget === b;
                  const meta = BUDGET_LABELS[b];
                  return (
                    <button type="button" key={b} onClick={() => setBudget(b)}
                      title={es ? meta.es : meta.en}
                      className="py-3 rounded-2xl text-center transition-all duration-200 relative overflow-hidden"
                      style={active ? {
                        background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color})`,
                        border: `1.5px solid ${meta.color}`,
                        boxShadow: `0 6px 20px ${meta.color}55`,
                        transform: "scale(1.05) translateY(-2px)",
                      } : {
                        background: "rgba(255,255,255,0.06)",
                        border: "1.5px solid rgba(255,255,255,0.1)",
                      }}>
                      <div className="text-lg font-bold" style={{ color: active ? "#fff" : "rgba(255,255,255,0.7)" }}>
                        {BUDGET_SHORT[b]}
                      </div>
                      <div className="text-[9px] font-semibold mt-0.5 uppercase tracking-wide"
                        style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                        {es ? meta.es : meta.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Intereses ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 block"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("interests", locale)}
                <span className="ml-2 normal-case text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  ({interests.length} {es ? "seleccionados" : "selected"})
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const on = interests.includes(interest);
                  return (
                    <button type="button" key={interest} onClick={() => toggleInterest(interest)}
                      className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200"
                      style={on ? {
                        background: "linear-gradient(135deg, hsl(260 60% 35%), hsl(280 70% 45%))",
                        color: "#fff",
                        border: "1.5px solid hsl(280 70% 55%)",
                        boxShadow: "0 4px 12px hsl(260 60% 30% / 0.4)",
                        transform: "scale(1.04)",
                      } : {
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.6)",
                        border: "1.5px solid rgba(255,255,255,0.1)",
                      }}>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Botón submit ── */}
            <button
              type="submit"
              className="w-full group relative overflow-hidden rounded-2xl py-5 flex items-center justify-center gap-3 font-bold text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, hsl(12 85% 55%) 0%, hsl(38 95% 60%) 50%, hsl(12 85% 55%) 100%)",
                backgroundSize: "200% 100%",
                color: "#fff",
                boxShadow: "0 12px 40px -8px hsl(12 85% 55% / 0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0 0")}
            >
              <Sparkles style={{ width: 18, height: 18 }} />
              <span className="uppercase tracking-[0.15em] text-sm font-bold">
                {es ? "✦ Diseñar mi viaje ahora" : "✦ Design my trip now"}
              </span>
              <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>

            <p className="text-center text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
              ⚡ {es ? "Resultados listos en ~10 segundos · 100% gratis · Sin registro" : "Results ready in ~10s · 100% free · No sign-up required"}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
