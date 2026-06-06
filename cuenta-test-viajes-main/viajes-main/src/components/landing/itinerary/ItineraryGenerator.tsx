// src/components/landing/itinerary/ItineraryGenerator.tsx
// ⚠️ LÓGICA FUNCIONAL 100% INTACTA — cambios: UI multiciudad + diseño ampliado

import React, { useState, useEffect } from "react";
import type { TripFormData, Budget, TravelerType, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { MapPin, Calendar, Users, Clock, Sparkles, Globe2, Plus, Trash2, ArrowRight } from "lucide-react";

// ── Constantes (intactas) ─────────────────────────────────────────────────────
const INTERESTS = [
  "🏛️ Historia & Cultura","🍽️ Gastronomía","🌿 Naturaleza",
  "🎵 Vida nocturna","🛍️ Compras","🎨 Arte & Museos",
  "🧗 Aventura","📷 Fotografía","🧘 Bienestar","👨‍👩‍👧 Familiar",
  "🏖️ Playas","⚽ Deporte",
];
const BUDGETS: Budget[] = ["economico","moderado","premium","lujo"];
const BUDGET_META: Record<Budget,{es:string;en:string;symbol:string;color:string}> = {
  economico:{ es:"Económico", en:"Budget",   symbol:"$",    color:"hsl(160 70% 50%)" },
  moderado: { es:"Moderado",  en:"Moderate", symbol:"$$",   color:"hsl(38 95% 60%)"  },
  premium:  { es:"Premium",   en:"Premium",  symbol:"$$$",  color:"hsl(280 70% 65%)" },
  lujo:     { es:"Lujo ✦",   en:"Luxury ✦", symbol:"ELITE",color:"hsl(12 85% 60%)"  },
};
const TRAVELER_ICONS: Record<TravelerType,string> = {
  pareja:"💑", familia:"👨‍👩‍👧", amigos:"👯", solo:"🧳", negocios:"💼",
};

// ── Tipo de ciudad del itinerario múltiple ────────────────────────────────────
interface CityStop { city: string; country: string; days: number; }
interface StopWithForm { form: TripFormData; days: number; }

interface StopWithForm { form: TripFormData; days: number; }

interface Props {
  onSubmit: (data: TripFormData) => void;
  onMultiSubmit: (stops: StopWithForm[], baseForm: TripFormData) => void;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}

export function ItineraryGenerator({ onSubmit, onMultiSubmit, locale, onLocaleChange }: Props) {
  // ── Estado original (intacto) ─────────────────────────────────────────────
  const [city, setCity]               = useState("");
  const [country, setCountry]         = useState("");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [travelers, setTravelers]     = useState(2);
  const [travelerType, setTravelerType] = useState<TravelerType>("pareja");
  const [budget, setBudget]           = useState<Budget>("moderado");
  const [interests, setInterests]     = useState<string[]>(["🏛️ Historia & Cultura","🍽️ Gastronomía"]);
  const [dayStartTime, setDayStartTime] = useState("08:00");
  const [dayEndTime, setDayEndTime]   = useState("23:00");
  const [errors, setErrors]           = useState<Record<string,string>>({});
  const [dateRange, setDateRange]     = useState("");
  const [citySuggestions, setCitySuggestions] = useState<{city:string;country:string}[]>([]);
  const [showCitySuggest, setShowCitySuggest] = useState(false);

  // ── Estado NUEVO: modo multiciudad ────────────────────────────────────────
  const [multiMode, setMultiMode] = useState(false);
  const [stops, setStops]         = useState<CityStop[]>([
    { city:"", country:"", days:3 },
  ]);
  const [stopSuggestions, setStopSuggestions] = useState<{city:string;country:string}[]>([]);
  const [activeSuggestIdx, setActiveSuggestIdx] = useState<number|null>(null);

  // ── Effects originales (intactos) ─────────────────────────────────────────
  useEffect(() => {
    const q = city.trim();
    if (q.length < 2 || multiMode) { setCitySuggestions([]); return; }
    const ctrl = new AbortController();
    const tm = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&accept-language=${locale}`;
        const res = await fetch(url, { signal: ctrl.signal, headers:{ "Accept":"application/json" } });
        if (!res.ok) return;
        const data: any[] = await res.json();
        const seen = new Set<string>();
        const list: {city:string;country:string}[] = [];
        for (const r of data) {
          const a = r.address || {};
          const cityName = a.city||a.town||a.village||a.municipality||a.county||r.display_name?.split(",")[0];
          const countryName = a.country;
          if (!cityName||!countryName) continue;
          const k = `${cityName}|${countryName}`.toLowerCase();
          if (seen.has(k)) continue;
          seen.add(k);
          list.push({ city:cityName, country:countryName });
          if (list.length>=6) break;
        }
        setCitySuggestions(list);
      } catch {}
    }, 300);
    return () => { ctrl.abort(); clearTimeout(tm); };
  }, [city, locale, multiMode]);

  // Autocomplete para paradas múltiples
  useEffect(() => {
    if (activeSuggestIdx === null) { setStopSuggestions([]); return; }
    const q = stops[activeSuggestIdx]?.city.trim();
    if (!q || q.length < 2) { setStopSuggestions([]); return; }
    const ctrl = new AbortController();
    const tm = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5&accept-language=${locale}`;
        const res = await fetch(url, { signal: ctrl.signal, headers:{ "Accept":"application/json" } });
        if (!res.ok) return;
        const data: any[] = await res.json();
        const seen = new Set<string>();
        const list: {city:string;country:string}[] = [];
        for (const r of data) {
          const a = r.address || {};
          const cn = a.city||a.town||a.village||a.municipality||a.county||r.display_name?.split(",")[0];
          const co = a.country;
          if (!cn||!co) continue;
          const k = `${cn}|${co}`.toLowerCase();
          if (seen.has(k)) continue;
          seen.add(k);
          list.push({ city:cn, country:co });
          if (list.length>=5) break;
        }
        setStopSuggestions(list);
      } catch {}
    }, 300);
    return () => { ctrl.abort(); clearTimeout(tm); };
  }, [stops, activeSuggestIdx, locale]);

  useEffect(() => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate()+3);
    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    const sd = new Date(startDate+"T12:00:00");
    const ed = new Date(endDate+"T12:00:00");
    if (ed < sd) { setDateRange(""); return; }
    const days = Math.round((ed.getTime()-sd.getTime())/86400000)+1;
    const fmt = (d:Date) => d.toLocaleDateString(locale==="es"?"es-ES":"en-US",{ day:"numeric",month:"short",year:"numeric" });
    setDateRange(`${fmt(sd)} → ${fmt(ed)} · ${days} ${days>1?(locale==="es"?"días":"days"):(locale==="es"?"día":"day")}`);
  }, [startDate, endDate, locale]);

  // ── Funciones originales (intactas) ───────────────────────────────────────
  function toggleInterest(i:string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i]);
  }

  function validate(): boolean {
    const errs: Record<string,string> = {};
    if (multiMode) {
      const valid = stops.filter(s => s.city.trim() && s.country.trim());
      if (valid.length === 0) errs.stops = t("errorRequired", locale);
    } else {
      if (!city.trim())    errs.city    = t("errorRequired", locale);
      if (!country.trim()) errs.country = t("errorRequired", locale);
    }
    if (!startDate) errs.startDate = t("errorRequired", locale);
    if (!endDate)   errs.endDate   = t("errorRequired", locale);
    if (startDate && endDate && new Date(endDate)<new Date(startDate))
      errs.endDate = t("errorDateRange", locale);
    if (dayStartTime && dayEndTime && dayEndTime<=dayStartTime)
      errs.dayEndTime = locale==="es"?"Debe ser posterior a la hora de inicio":"Must be after start time";
    setErrors(errs);
    return Object.keys(errs).length===0;
  }

  function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (multiMode) {
      const validStops = stops.filter(s => s.city.trim() && s.country.trim() && s.days > 0);

      // Calcular fecha de inicio de cada ciudad en base a su posición en la ruta
      let currentDate = new Date(startDate + "T12:00:00");

      const stopsWithForm: StopWithForm[] = validStops.map((stop) => {
        const stopStart = currentDate.toISOString().split("T")[0];
        const stopEnd   = new Date(currentDate);
        stopEnd.setDate(stopEnd.getDate() + stop.days - 1);
        const stopEndStr = stopEnd.toISOString().split("T")[0];

        // Avanzar la fecha al siguiente día después de esta parada
        currentDate = new Date(stopEnd);
        currentDate.setDate(currentDate.getDate() + 1);

        const form: TripFormData = {
          city:        stop.city,
          country:     stop.country,
          startDate:   stopStart,
          endDate:     stopEndStr,
          travelers,
          travelerType,
          budget,
          interests,
          locale,
          dayStartTime,
          dayEndTime,
        };
        return { form, days: stop.days };
      });

      // baseForm para el Loader y ItineraryView
      const totalDays = validStops.reduce((a, s) => a + s.days, 0);
      const totalEnd  = new Date(startDate + "T12:00:00");
      totalEnd.setDate(totalEnd.getDate() + totalDays - 1);

      const baseForm: TripFormData = {
        city:    validStops.map(s => s.city).join(" → "),
        country: validStops.map(s => s.country).filter((c, i, arr) => arr.indexOf(c) === i).join(" / "),
        startDate,
        endDate: totalEnd.toISOString().split("T")[0],
        travelers, travelerType, budget, interests, locale, dayStartTime, dayEndTime,
      };

      onMultiSubmit(stopsWithForm, baseForm);
    } else {
      onSubmit({ city, country, startDate, endDate, travelers, travelerType, budget, interests, locale, dayStartTime, dayEndTime });
    }
  }

  // Funciones de paradas múltiples
  function updateStop(idx:number, field:keyof CityStop, value:string|number) {
    setStops(prev => prev.map((s,i) => i===idx ? {...s,[field]:value} : s));
  }
  function addStop() {
    setStops(prev => [...prev, { city:"", country:"", days:3 }]);
  }
  function removeStop(idx:number) {
    if (stops.length<=1) return;
    setStops(prev => prev.filter((_,i)=>i!==idx));
  }

  const tz = typeof Intl!=="undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  const es = locale==="es";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="generador" className="relative py-28 px-4 overflow-hidden"
      style={{ background:"linear-gradient(135deg, hsl(220 40% 8%) 0%, hsl(260 45% 12%) 40%, hsl(290 35% 10%) 100%)" }}>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[
          { top:"8%",  left:"3%",   w:350, color:"hsl(12 85% 55% / 0.14)"  },
          { top:"55%", left:"72%",  w:420, color:"hsl(260 80% 60% / 0.12)" },
          { top:"35%", left:"52%",  w:220, color:"hsl(180 70% 50% / 0.08)" },
          { top:"78%", left:"12%",  w:260, color:"hsl(320 70% 55% / 0.09)" },
        ].map((s,i) => (
          <div key={i} className="absolute rounded-full blur-3xl"
            style={{ top:s.top, left:s.left, width:s.w, height:s.w, background:s.color }} />
        ))}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"36px 36px" }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Cabecera */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-5 border"
            style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)" }}>
            <Sparkles style={{ width:12, height:12, color:"hsl(38 95% 65%)" }} />
            {es ? "Planificador de viajes" : "Trip Planner"}
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            {es ? "Cuéntanos tu" : "Tell us about your"}{" "}
            <span style={{ backgroundImage:"linear-gradient(135deg, hsl(12 85% 65%), hsl(38 95% 65%), hsl(280 80% 75%))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              {es ? "viaje" : "trip"}
            </span>
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color:"rgba(255,255,255,0.5)" }}>
            {es ? "y nosotros organizamos el resto. Completa un único formulario y recibe un itinerario completo listo para usar."
                : "and we organize the rest. Fill one form and get a complete ready-to-use itinerary."}
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="rounded-3xl relative overflow-hidden"
          style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

          {/* Barra arcoíris */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ background:"linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 80% 65%), hsl(200 80% 60%), hsl(160 70% 50%))" }} />

          {/* Header idioma */}
          <div className="flex justify-between items-center px-8 pt-8 pb-0">
            <div className="flex items-center gap-2">
              <Globe2 style={{ width:13, height:13, color:"rgba(255,255,255,0.35)" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.35)" }}>
                {es ? "Manifiesto del viaje" : "Trip Manifest"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-full p-1 text-[10px] font-mono" style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
                {(["es","en"] as Locale[]).map(loc => (
                  <button key={loc} type="button" onClick={() => onLocaleChange(loc)}
                    className="px-3 py-1 rounded-full transition-all"
                    style={{ background:locale===loc?"rgba(255,255,255,0.15)":"transparent", color:locale===loc?"#fff":"rgba(255,255,255,0.4)", fontWeight:locale===loc?600:400 }}>
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="hidden sm:inline text-[10px] font-mono" style={{ color:"rgba(255,255,255,0.25)" }}>{tz}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ── Toggle modo de viaje ── */}
            <div className="flex items-center gap-3 p-1 rounded-2xl" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
              {[
                { val:false, icon:"📍", label:es?"Destino único":"Single destination" },
                { val:true,  icon:"🗺️", label:es?"Múltiples ciudades":"Multi-city trip" },
              ].map(opt => (
                <button type="button" key={String(opt.val)} onClick={() => setMultiMode(opt.val)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={multiMode===opt.val ? {
                    background:"linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 58%))",
                    color:"#fff", boxShadow:"0 4px 16px hsl(12 85% 55%/0.4)",
                  } : { color:"rgba(255,255,255,0.5)" }}>
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>

            {/* ── Destino único ── */}
            {!multiMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Ciudad */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>
                    <MapPin style={{ width:11, height:11 }} /> {t("city",locale)}
                  </label>
                  <div className="relative">
                    <input type="text" value={city} autoComplete="off"
                      placeholder={es?"Ej. Barcelona":"e.g. Kyoto"}
                      className="w-full bg-transparent outline-none transition-all py-3 px-4 rounded-2xl placeholder:font-normal"
                      style={{ color:"#fff", border:`1.5px solid ${errors.city?"#f87171":"rgba(255,255,255,0.15)"}`, background:"rgba(255,255,255,0.06)", fontSize:18, fontWeight:700 }}
                      onChange={e => { setCity(e.target.value); setShowCitySuggest(true); }}
                      onFocus={e => { setShowCitySuggest(true); e.currentTarget.style.borderColor="hsl(12 85% 65%)"; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
                      onBlur={e => { setTimeout(()=>setShowCitySuggest(false),200); e.currentTarget.style.borderColor=errors.city?"#f87171":"rgba(255,255,255,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
                    />
                    {showCitySuggest && citySuggestions.length>0 && (
                      <ul className="absolute left-0 right-0 top-full z-30 mt-1 rounded-2xl border overflow-auto"
                        style={{ background:"hsl(240 30% 12%)", border:"1px solid rgba(255,255,255,0.15)", maxHeight:220, boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
                        {citySuggestions.map((s,i) => (
                          <li key={i} onMouseDown={e=>{ e.preventDefault(); setCity(s.city); setCountry(s.country); setShowCitySuggest(false); }}
                            className="px-4 py-3 cursor-pointer flex items-center gap-2 text-sm"
                            style={{ borderBottom:i<citySuggestions.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}
                            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.08)")}
                            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <MapPin style={{ width:12, height:12, color:"hsl(12 85% 65%)", flexShrink:0 }} />
                            <span className="font-semibold text-white">{s.city}</span>
                            <span style={{ color:"rgba(255,255,255,0.45)" }}>· {s.country}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.city && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.city}</p>}
                </div>
                {/* País */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>
                    <Globe2 style={{ width:11, height:11 }} /> {t("country",locale)}
                  </label>
                  <input type="text" value={country} autoComplete="off"
                    placeholder={es?"España":"Japan"}
                    className="w-full bg-transparent outline-none transition-all py-3 px-4 rounded-2xl placeholder:font-normal"
                    style={{ color:"#fff", border:`1.5px solid ${errors.country?"#f87171":"rgba(255,255,255,0.15)"}`, background:"rgba(255,255,255,0.06)", fontSize:18, fontWeight:700 }}
                    onChange={e=>setCountry(e.target.value)}
                    onFocus={e=>{ e.currentTarget.style.borderColor="hsl(38 95% 65%)"; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
                    onBlur={e=>{ e.currentTarget.style.borderColor=errors.country?"#f87171":"rgba(255,255,255,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
                  />
                  {errors.country && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.country}</p>}
                </div>
              </div>
            )}

            {/* ── Modo múltiples ciudades ── */}
            {multiMode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color:"rgba(255,255,255,0.5)" }}>
                    🗺️ {es?"Ciudades y días por destino":"Cities & days per destination"}
                  </label>
                  <span className="text-[11px] font-mono" style={{ color:"hsl(38 95% 65%)" }}>
                    {es?"Total:":"Total:"} {stops.reduce((a,s)=>a+s.days,0)} {es?"días":"days"}
                  </span>
                </div>

                {stops.map((stop, idx) => (
                  <div key={idx} className="relative rounded-2xl p-4 gap-3"
                    style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                    {/* Número de parada */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background:"linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color:"#fff" }}>
                        {idx+1}
                      </span>
                      <span className="text-xs font-semibold" style={{ color:"rgba(255,255,255,0.5)" }}>
                        {es?`Parada ${idx+1}`:`Stop ${idx+1}`}
                      </span>
                      {stops.length>1 && (
                        <button type="button" onClick={()=>removeStop(idx)} className="ml-auto"
                          style={{ color:"rgba(255,255,255,0.3)", transition:"color 0.2s" }}
                          onMouseEnter={e=>(e.currentTarget.style.color="#f87171")}
                          onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
                          <Trash2 style={{ width:14, height:14 }} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {/* Ciudad */}
                      <div className="sm:col-span-2 relative">
                        <input type="text" value={stop.city} autoComplete="off"
                          placeholder={es?"Ciudad":"City"}
                          className="w-full bg-transparent outline-none py-2.5 px-3 rounded-xl text-sm font-semibold"
                          style={{ color:"#fff", border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)" }}
                          onChange={e=>{ updateStop(idx,"city",e.target.value); setActiveSuggestIdx(idx); }}
                          onFocus={e=>{ setActiveSuggestIdx(idx); e.currentTarget.style.borderColor="hsl(12 85% 65%)"; }}
                          onBlur={e=>{ setTimeout(()=>setActiveSuggestIdx(null),200); e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
                        />
                        {activeSuggestIdx===idx && stopSuggestions.length>0 && (
                          <ul className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border overflow-auto"
                            style={{ background:"hsl(240 30% 12%)", border:"1px solid rgba(255,255,255,0.15)", maxHeight:180, boxShadow:"0 16px 40px rgba(0,0,0,0.5)" }}>
                            {stopSuggestions.map((s,si) => (
                              <li key={si}
                                onMouseDown={e=>{ e.preventDefault(); updateStop(idx,"city",s.city); updateStop(idx,"country",s.country); setActiveSuggestIdx(null); }}
                                className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs"
                                style={{ borderBottom:si<stopSuggestions.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.08)")}
                                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <MapPin style={{ width:10, height:10, color:"hsl(12 85% 65%)", flexShrink:0 }} />
                                <span className="font-semibold text-white">{s.city}</span>
                                <span style={{ color:"rgba(255,255,255,0.4)" }}>· {s.country}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {/* País */}
                      <div className="sm:col-span-2">
                        <input type="text" value={stop.country} autoComplete="off"
                          placeholder={es?"País":"Country"}
                          className="w-full bg-transparent outline-none py-2.5 px-3 rounded-xl text-sm font-semibold"
                          style={{ color:"#fff", border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)" }}
                          onChange={e=>updateStop(idx,"country",e.target.value)}
                          onFocus={e=>{ e.currentTarget.style.borderColor="hsl(38 95% 65%)"; }}
                          onBlur={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
                        />
                      </div>
                      {/* Días */}
                      <div className="sm:col-span-1">
                        <div className="flex items-center gap-1 h-full">
                          <button type="button" onClick={()=>updateStop(idx,"days",Math.max(1,stop.days-1))}
                            className="w-8 h-full rounded-lg flex items-center justify-center text-lg font-bold transition-all"
                            style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.12)" }}>−</button>
                          <div className="flex-1 text-center">
                            <div className="text-xl font-bold text-white">{stop.days}</div>
                            <div className="text-[9px] font-mono" style={{ color:"rgba(255,255,255,0.35)" }}>{es?"días":"days"}</div>
                          </div>
                          <button type="button" onClick={()=>updateStop(idx,"days",Math.min(30,stop.days+1))}
                            className="w-8 h-full rounded-lg flex items-center justify-center text-lg font-bold transition-all"
                            style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.12)" }}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {errors.stops && <p className="text-red-400 text-[11px] ml-1">{errors.stops}</p>}

                {/* Botón agregar parada */}
                {stops.length < 8 && (
                  <button type="button" onClick={addStop}
                    className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all border-2 border-dashed hover:border-solid"
                    style={{ borderColor:"hsl(12 85% 55%/0.4)", color:"hsl(12 85% 65%)", background:"hsl(12 85% 55%/0.05)" }}>
                    <Plus style={{ width:16, height:16 }} /> {es?"Agregar otra ciudad":"Add another city"}
                  </button>
                )}

                {/* Resumen de ruta */}
                {stops.filter(s=>s.city.trim()).length>0 && (
                  <div className="rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-center"
                    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-xs font-mono" style={{ color:"rgba(255,255,255,0.4)" }}>🗺️ Ruta:</span>
                    {stops.filter(s=>s.city.trim()).map((s,i,arr) => (
                      <React.Fragment key={i}>
                        <span className="text-xs font-semibold text-white">{s.city} <span style={{ color:"hsl(38 95% 65%)" }}>({s.days}d)</span></span>
                        {i<arr.length-1 && <ArrowRight style={{ width:12, height:12, color:"rgba(255,255,255,0.3)" }} />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Fechas + Viajeros ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label:t("startDate",locale), val:startDate, set:setStartDate, type:"date", err:errors.startDate, accent:"hsl(160 70% 55%)" },
                { label:t("endDate",locale),   val:endDate,   set:setEndDate,   type:"date", err:errors.endDate,   accent:"hsl(200 80% 60%)" },
                { label:t("travelers",locale),  val:travelers, set:(v:any)=>setTravelers(Number(v)), type:"number", err:"", accent:"hsl(280 75% 65%)" },
              ].map(({ label, val, set, type, err, accent }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>
                    {type==="date"?<Calendar style={{ width:11, height:11 }}/>:<Users style={{ width:11, height:11 }}/>} {label}
                  </label>
                  <input type={type} value={val} onChange={e=>set(e.target.value)}
                    min={type==="number"?1:undefined} max={type==="number"?20:undefined}
                    className="w-full font-mono text-sm py-3 px-4 rounded-2xl outline-none transition-all"
                    style={{ color:"#fff", background:"rgba(255,255,255,0.06)", border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,0.15)"}`, colorScheme:"dark" }}
                    onFocus={e=>{ e.currentTarget.style.borderColor=accent; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
                    onBlur={e=>{ e.currentTarget.style.borderColor=err?"#f87171":"rgba(255,255,255,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
                  />
                  {err && <p className="text-red-400 text-[11px] mt-1 ml-1">{err}</p>}
                </div>
              ))}
            </div>

            {/* ── Horario del día ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label:es?"Hora de inicio del día":"Day start time", val:dayStartTime, set:setDayStartTime, err:"",               accent:"hsl(38 95% 65%)"  },
                { label:es?"Hora de cierre del día":"Day end time",   val:dayEndTime,   set:setDayEndTime,   err:errors.dayEndTime, accent:"hsl(320 80% 65%)" },
              ].map(({ label, val, set, err, accent }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>
                    <Clock style={{ width:11, height:11 }} /> {label}
                  </label>
                  <input type="time" value={val} onChange={e=>set(e.target.value)}
                    className="w-full font-mono text-sm py-3 px-4 rounded-2xl outline-none transition-all"
                    style={{ color:"#fff", background:"rgba(255,255,255,0.06)", border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,0.15)"}`, colorScheme:"dark" }}
                    onFocus={e=>{ e.currentTarget.style.borderColor=accent; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
                    onBlur={e=>{ e.currentTarget.style.borderColor=err?"#f87171":"rgba(255,255,255,0.15)"; e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
                  />
                  {err && <p className="text-red-400 text-[11px] mt-1 ml-1">{err}</p>}
                </div>
              ))}
            </div>

            {/* Resumen de fechas */}
            {dateRange && !multiMode && (
              <div className="flex items-center gap-3 text-xs font-mono px-4 py-2.5 rounded-xl -mt-2"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)" }}>
                <span>🗓</span><span>{dateRange}</span>
                <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
                <span>⏰ {dayStartTime} → {dayEndTime}</span>
              </div>
            )}

            <div style={{ height:1, background:"rgba(255,255,255,0.08)" }} />

            {/* ── Tipo de viajero ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.5)" }}>
                <Users style={{ width:11, height:11 }} /> {t("travelerType",locale)}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["pareja","familia","amigos","solo","negocios"] as TravelerType[]).map(tt => (
                  <button type="button" key={tt} onClick={()=>setTravelerType(tt)}
                    className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 flex items-center gap-1.5"
                    style={travelerType===tt ? {
                      background:"linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))",
                      color:"#fff", border:"1.5px solid transparent",
                      boxShadow:"0 4px 16px hsl(12 85% 55%/0.4)", transform:"scale(1.05)",
                    } : { background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.65)", border:"1.5px solid rgba(255,255,255,0.1)" }}>
                    <span>{TRAVELER_ICONS[tt]}</span> {t(tt,locale)}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Presupuesto ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 block" style={{ color:"rgba(255,255,255,0.5)" }}>
                {t("budget",locale)}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {BUDGETS.map(b => {
                  const active = budget===b;
                  const meta = BUDGET_META[b];
                  return (
                    <button type="button" key={b} onClick={()=>setBudget(b)}
                      className="py-3 rounded-2xl text-center transition-all duration-200"
                      style={active ? {
                        background:`linear-gradient(135deg, ${meta.color}99, ${meta.color})`,
                        border:`1.5px solid ${meta.color}`,
                        boxShadow:`0 6px 20px ${meta.color}44`,
                        transform:"scale(1.05) translateY(-2px)",
                      } : { background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)" }}>
                      <div className="text-lg font-bold" style={{ color:active?"#fff":"rgba(255,255,255,0.7)" }}>{meta.symbol}</div>
                      <div className="text-[9px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color:active?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.35)" }}>
                        {es?meta.es:meta.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Intereses ── */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4 block" style={{ color:"rgba(255,255,255,0.5)" }}>
                {t("interests",locale)}
                <span className="ml-2 normal-case text-[9px]" style={{ color:"rgba(255,255,255,0.3)" }}>
                  ({interests.length} {es?"seleccionados":"selected"})
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => {
                  const on = interests.includes(interest);
                  return (
                    <button type="button" key={interest} onClick={()=>toggleInterest(interest)}
                      className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200"
                      style={on ? {
                        background:"linear-gradient(135deg, hsl(260 60% 35%), hsl(280 70% 45%))",
                        color:"#fff", border:"1.5px solid hsl(280 70% 55%)",
                        boxShadow:"0 4px 12px hsl(260 60% 30%/0.4)", transform:"scale(1.04)",
                      } : { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.6)", border:"1.5px solid rgba(255,255,255,0.1)" }}>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Botón submit ── */}
            <button type="submit"
              className="w-full group relative overflow-hidden rounded-2xl py-5 flex items-center justify-center gap-3 font-bold text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background:"linear-gradient(135deg, hsl(12 85% 55%) 0%, hsl(38 95% 60%) 50%, hsl(12 85% 55%) 100%)", backgroundSize:"200% 100%", color:"#fff", boxShadow:"0 12px 40px -8px hsl(12 85% 55%/0.6), inset 0 1px 0 rgba(255,255,255,0.2)", letterSpacing:"0.08em" }}
              onMouseEnter={e=>e.currentTarget.style.backgroundPosition="100% 0"}
              onMouseLeave={e=>e.currentTarget.style.backgroundPosition="0 0"}>
              <Sparkles style={{ width:18, height:18 }} />
              <span className="uppercase tracking-[0.15em] text-sm font-bold">
                {es?"✦ Crear mi plan de viaje":"✦ Create my travel plan"}
              </span>
              <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>

            <p className="text-center text-[11px] font-mono" style={{ color:"rgba(255,255,255,0.3)" }}>
              ⚡ {es?"Resultados listos en ~10 segundos · 100% gratis · Sin registro":"Results ready in ~10s · 100% free · No sign-up required"}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
