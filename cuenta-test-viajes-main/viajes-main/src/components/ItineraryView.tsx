// src/components/ItineraryView.tsx — Rediseño visual completo. Lógica 100% intacta.
import React, { useState } from "react";
import type { ItineraryData, ItineraryDay, ItineraryItem, UserEdits, Locale, TripFormData } from "@/lib/types";
import { t } from "@/lib/i18n";
import TravelExtrasTabs from "@/components/TravelExtrasTabs";

// ── Badges de tipo — colores actualizados al nuevo sistema visual ──
const BADGE: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  sight:     { label: "sight",     bg: "hsl(160 60% 20% / 0.25)", color: "hsl(160 70% 55%)",  dot: "hsl(160 70% 50%)"  },
  food:      { label: "food",      bg: "hsl(38 90% 50% / 0.2)",   color: "hsl(38 95% 65%)",   dot: "hsl(38 95% 60%)"   },
  transport: { label: "move",      bg: "rgba(255,255,255,0.07)",   color: "rgba(255,255,255,0.5)", dot: "rgba(255,255,255,0.4)" },
  event:     { label: "event",     bg: "hsl(280 70% 50% / 0.2)",  color: "hsl(280 70% 72%)",  dot: "hsl(280 70% 65%)"  },
  alert:     { label: "alert",     bg: "hsl(0 75% 50% / 0.2)",    color: "hsl(0 75% 70%)",    dot: "hsl(0 75% 60%)"    },
  beach:     { label: "beach",     bg: "hsl(200 80% 50% / 0.2)",  color: "hsl(200 85% 70%)",  dot: "hsl(200 85% 60%)"  },
  night:     { label: "night",     bg: "hsl(250 60% 40% / 0.3)",  color: "hsl(250 80% 80%)",  dot: "hsl(250 80% 70%)"  },
};

// Colores de riesgo de seguridad
const RISK = {
  alto:  { bar: "hsl(0 75% 60%)",   badge: { bg: "hsl(0 75% 50%/0.2)",   color: "hsl(0 75% 70%)" } },
  medio: { bar: "hsl(38 95% 60%)",  badge: { bg: "hsl(38 90%50%/0.2)",   color: "hsl(38 95% 65%)" } },
  bajo:  { bar: "hsl(160 70% 50%)", badge: { bg: "hsl(160 60%20%/0.25)", color: "hsl(160 70% 55%)" } },
};

// Colores de plataformas de hoteles
const HOTEL_COLORS: Record<string, { accent: string; label: string }> = {
  "Booking.com": { accent: "#0071c2", label: "Booking" },
  "Hotels.com":  { accent: "#d32d20", label: "Hotels.com" },
  "Expedia":     { accent: "#1a3286", label: "Expedia" },
  "Airbnb":      { accent: "#ff385c", label: "Airbnb" },
  "Trivago":     { accent: "#c8102e", label: "Trivago" },
  "Kayak":       { accent: "#ff690f", label: "Kayak" },
};


// ── WikiPhoto — foto real desde Wikimedia Commons (gratuito, sin API key) ─────
// Busca la imagen más relevante por nombre exacto del lugar/plato.
// Si no encuentra nada muestra un placeholder con emoji.
function WikiPhoto({ query, width, height, radius, emoji }: {
  query: string; width: number; height: number; radius: number; emoji?: string;
}) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const encoded = encodeURIComponent(query.trim());
    // Wikimedia Commons API: busca el primer resultado y obtiene su thumbnail
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=${Math.max(width,height)*2}&origin=*`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const pages = data?.query?.pages ?? {};
        const page = Object.values(pages)[0] as { thumbnail?: { source: string } };
        if (page?.thumbnail?.source) {
          setSrc(page.thumbnail.source);
        } else {
          // fallback: buscar en Wikimedia Commons directamente
          return fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encoded}&prop=imageinfo&iiprop=url&iiurlwidth=${Math.max(width,height)*2}&format=json&origin=*`)
            .then(r => r.json())
            .then(d2 => {
              if (cancelled) return;
              const pages2 = d2?.query?.pages ?? {};
              const first = Object.values(pages2)[0] as { imageinfo?: { thumburl: string }[] };
              if (first?.imageinfo?.[0]?.thumburl) {
                setSrc(first.imageinfo[0].thumburl);
              } else {
                setFailed(true);
              }
            });
        }
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [query, width, height]);

  const style: React.CSSProperties = {
    width: "100%", height: "100%", minHeight: height, borderRadius: radius, overflow: "hidden",
    background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: Math.round(height * 0.35),
  };

  if (failed || (!src && query === "")) {
    return <div style={style}>{emoji ?? "🏛"}</div>;
  }
  if (!src) {
    // skeleton loader
    return (
      <div style={{ ...style, background: "linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%)", backgroundSize: "200% 100%", animation: "iv-shimmer 1.4s infinite" }}>
      </div>
    );
  }
  return (
    <div style={style}>
      <img src={src} alt={query} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88 }}
        onError={() => setFailed(true)} />
    </div>
  );
}

interface Props {
  data: ItineraryData;
  locale: Locale;
  onReset: () => void;
  form?: TripFormData | null;
  cityResults?: ItineraryData[];
  onRetryCity?: (cityIndex: number) => Promise<void>;
}

// ── CSS global inyectado una vez ──────────────────────────────────────────────
const GLOBAL_CSS = `
  .iv-root { background: linear-gradient(135deg, hsl(240 45% 8%) 0%, hsl(260 55% 13%) 50%, hsl(220 50% 9%) 100%); min-height: 100vh; }
  .iv-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 28px; backdrop-filter: blur(16px); }
  .iv-card-inner { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 20px; }
  .iv-btn-ghost { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 6px 14px; font-size: 12px; cursor: pointer; color: rgba(255,255,255,0.7); transition: all 0.2s; }
  .iv-btn-ghost:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .iv-link { font-size: 11px; padding: 3px 9px; border-radius: 8px; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 3px; }
  .iv-tl-row { display: grid; grid-template-columns: 64px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .iv-tl-row:last-child { border-bottom: none; }
  @keyframes iv-ping { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(2);opacity:0} }
  @keyframes iv-fade-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .iv-animate { animation: iv-fade-in 0.3s ease forwards; }
  @keyframes iv-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .iv-layout { display: flex; min-height: 100vh; }
  .iv-sidebar { width: 240px; min-width: 240px; position: sticky; top: 0; height: 100vh; overflow-y: auto; background: hsl(230 30% 10%); border-right: 1px solid rgba(255,255,255,0.07); z-index: 10; padding: 0 0 40px; flex-shrink: 0; }
  .iv-sidebar::-webkit-scrollbar { width: 3px; } .iv-sidebar::-webkit-scrollbar-track { background: transparent; } .iv-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
  .iv-main { flex: 1; min-width: 0; padding: 0 32px 80px; max-width: 1100px; }
  .iv-nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 13px 20px; border: none; background: transparent; color: rgba(255,255,255,0.55); cursor: pointer; font-size: 14px; font-weight: 400; transition: all 0.15s; text-align: left; white-space: nowrap; border-radius: 0; }
  .iv-nav-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
  .iv-nav-btn.active { background: rgba(255,120,30,0.12); color: #fff; font-weight: 600; border-left: 3px solid hsl(22 95% 55%); padding-left: 17px; }
  .iv-tabs-scroll { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }
  .iv-tabs-scroll::-webkit-scrollbar { height: 4px; } .iv-tabs-scroll::-webkit-scrollbar-track { background: transparent; } .iv-tabs-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
  .iv-day-item { display: flex; flex-direction: column; margin-bottom: 20px; border-radius: 16px; overflow: hidden; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); transition: box-shadow 0.2s; }
  .iv-day-item:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.18); }
  .iv-day-photo { width: 100%; height: 220px; position: relative; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
  .iv-day-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .iv-day-photo > div { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; }
  .iv-day-body { padding: 18px 22px 20px; }
  .iv-events-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  @media (max-width: 1200px) { .iv-events-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) { .iv-day-photo { width: 150px; min-width: 150px; } .iv-events-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px) { .iv-sidebar { display: none; } .iv-main { padding: 0 14px 60px; } .iv-day-photo { width: 110px; min-width: 110px; } .iv-events-grid { grid-template-columns: repeat(2, 1fr); } }
`;

export default function ItineraryView({ data, locale, onReset, form, cityResults = [], onRetryCity }: Props) {
  const [tab, setTab] = useState<"days"|"restaurants"|"events"|"hotels"|"extras"|"security"|"preparation"|"gastronomy"|"tips"|"budget">("days");
  const totalDays = (data.days ?? []).length;

  // Set con TODOS los índices siempre — garantiza que todos los días estén abiertos
  // Se recalcula si cambian los datos (nuevo itinerario)
  const allIndices = React.useMemo(
    () => new Set<number>(Array.from({ length: totalDays }, (_, i) => i)),
    [totalDays]
  );
  const [openDays, setOpenDays] = useState<Set<number>>(allIndices);
  const allOpen = openDays.size === totalDays;

  // Si llegan nuevos datos (ej: multiciudad termina de cargar), abrir todos
  React.useEffect(() => {
    setOpenDays(new Set<number>(Array.from({ length: totalDays }, (_, i) => i)));
  }, [totalDays]);
  const [edits, setEdits] = useState<UserEdits>({});
  const [editModal, setEditModal] = useState<ItineraryItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editAltIdx, setEditAltIdx] = useState<number>(-1);

  function toggleDay(i: number) {
    setOpenDays(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  }
  function toggleAllDays() {
    setOpenDays(allOpen
      ? new Set<number>()
      : new Set<number>(Array.from({ length: totalDays }, (_, i) => i))
    );
  }
  function openEdit(item: ItineraryItem) {
    setEditModal(item);
    setEditName(edits[item.id]?.name ?? item.name);
    setEditNote(edits[item.id]?.note ?? "");
    setEditAltIdx(-1);
  }
  function saveEdit() {
    if (!editModal) return;
    const alt = editAltIdx >= 0 ? editModal.alternatives?.[editAltIdx] : undefined;
    setEdits(prev => ({ ...prev, [editModal.id]: { name: alt ? alt.name : editName, note: editNote, replacement: alt } }));
    setEditModal(null);
  }

  const tabs: { key: typeof tab; icon: string; label: string }[] = [
    { key: "days",        icon: "📅", label: locale === "es" ? "Días" : "Days" },
    { key: "restaurants", icon: "🍽️", label: locale === "es" ? "Restaurantes" : "Restaurants" },
    { key: "events",      icon: "🎭", label: locale === "es" ? "Eventos" : "Events" },
    { key: "hotels",      icon: "🏨", label: "Hotels" },
    { key: "extras",      icon: "✈️", label: "Vuelos · Tours" },
    { key: "security",    icon: "🛡️", label: locale === "es" ? "Seguridad" : "Safety" },
    { key: "preparation", icon: "🎒", label: locale === "es" ? "Preparación" : "Preparation" },
    { key: "gastronomy",  icon: "🍜", label: locale === "es" ? "Gastronomía" : "Gastronomy" },
    { key: "tips",        icon: "💡", label: locale === "es" ? "Consejos" : "Tips" },
    { key: "budget",      icon: "💰", label: locale === "es" ? "Presupuesto" : "Budget" },
  ];

  return (
    <div className="iv-root">
      <style>{GLOBAL_CSS}</style>

      {/* Orbes de fondo */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "5%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, hsl(12 90% 55% / 0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, hsl(280 80% 60% / 0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── LAYOUT: SIDEBAR + MAIN ── */}
      <div className="iv-layout" style={{ position: "relative", zIndex: 1 }}>

        {/* ── SIDEBAR FIJO IZQUIERDO ── */}
        <nav className="iv-sidebar">
          {/* Logo / título — estilo QEEQ */}
          <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(22 95% 58%)", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8 }}>✦ TripCraft AI</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{data.city}</div>
            {data.days?.length > 1 && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>{data.country}</div>
            )}
            {!data.days?.length || data.days.length <= 1 && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>{data.country}</div>
            )}
          </div>
          {tabs.map(tb => (
            <button key={tb.key}
              className={`iv-nav-btn${tab === tb.key ? " active" : ""}`}
              onClick={() => setTab(tb.key)}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{tb.icon}</span>
              {tb.label}
            </button>
          ))}
          {/* Botón volver */}
          <div style={{ padding: "16px 20px 0", marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={onReset}
              style={{ width: "100%", padding: "10px 0", fontSize: 13, borderRadius: 10, cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", transition: "all 0.2s", fontWeight: 500 }}>
              ← {locale === "es" ? "Nueva búsqueda" : "New search"}
            </button>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <div className="iv-main">

        {/* ── HEADER ── */}
        <div style={{ paddingTop: 28, paddingBottom: 16 }}>

          {/* Barra superior solo en mobile */}
          <div style={{ display: "none" }}>
            <button onClick={onReset} className="iv-btn-ghost">← {t("newSearch", locale)}</button>
          </div>

          {/* Tarjeta hero de ciudad */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "36px 36px 28px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Barra arcoíris */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 80% 65%), hsl(200 80% 60%))" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(38 95% 65%)", marginBottom: 6, fontWeight: 600 }}>
                  ✦ {locale === "es" ? "Tu itinerario" : "Your itinerary"}
                </div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond','Georgia',serif",
                  fontSize: "clamp(2.4rem,6vw,3.8rem)",
                  fontStyle: "italic", fontWeight: 600, lineHeight: 1.1, margin: 0,
                  backgroundImage: "linear-gradient(135deg, #fff 0%, hsl(38 95% 80%) 60%, hsl(12 85% 75%) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {data.city}, {data.country}
                </h2>
                {data.tagline && <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "8px 0 0", fontStyle: "italic" }}>{data.tagline}</p>}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.68)", lineHeight: 1.8, margin: "20px 0 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {data.summary}
              </p>
            )}
            {data.cityWikipediaExtract && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "8px 0 0", fontStyle: "italic" }}>
                {data.cityWikipediaExtract}
              </p>
            )}

            {/* Pills de clima y presupuesto */}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {data.weather && (
                <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                  🌤 {data.weather.maxTemp}° / {data.weather.minTemp}° · {data.weather.description}
                </span>
              )}
              {data.estimatedBudgetPerDay && (
                <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, background: "hsl(160 60% 20% / 0.3)", border: "1px solid hsl(160 70% 50% / 0.3)", color: "hsl(160 70% 55%)", fontWeight: 600 }}>
                  💰 {data.estimatedBudgetPerDay} {t("perDayPerson", locale)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="iv-tabs-scroll" style={{ marginBottom: 16 }}>
          {tabs.map(tb => {
            const active = tab === tb.key;
            return (
              <button key={tb.key} onClick={() => setTab(tb.key)}
                style={{
                  padding: "10px 20px", fontSize: 13, borderRadius: 24, cursor: "pointer",
                  whiteSpace: "nowrap", fontWeight: active ? 600 : 400,
                  border: `1px solid ${active ? "hsl(12 85% 55%)" : "rgba(255,255,255,0.1)"}`,
                  background: active
                    ? "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 58%))"
                    : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  transition: "all 0.2s",
                  boxShadow: active ? "0 4px 16px hsl(12 85% 55% / 0.4)" : "none",
                }}>
                {tb.icon} {tb.label}
              </button>
            );
          })}
        </div>

        {/* ── DAYS ── */}
        {tab === "days" && (
          <>
            {/* Aviso si alguna ciudad no generó días — con botón retry */}
            {cityResults.length > 1 && cityResults.some(r => !r.days?.length) && (
              <div style={{ marginBottom: 12, padding: "12px 18px", borderRadius: 16, background: "hsl(38 90% 50%/0.1)", border: "1px solid hsl(38 90% 50%/0.3)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "hsl(38 95% 65%)" }}>
                  ⚠️ {locale === "es" ? "Algunas ciudades no se generaron correctamente." : "Some cities did not generate correctly."}
                </span>
                {cityResults.map((r, i) => !r.days?.length && onRetryCity ? (
                  <RetryButton key={i} label={r.city} locale={locale} onRetry={() => onRetryCity(i)} />
                ) : null)}
              </div>
            )}
            {/* Botón expandir/colapsar todos */}
            {totalDays > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button onClick={toggleAllDays}
                  style={{ fontSize: 12, padding: "6px 16px", borderRadius: 12, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)"; }}>
                  {allOpen
                    ? (locale === "es" ? "⊖ Colapsar todos" : "⊖ Collapse all")
                    : (locale === "es" ? "⊕ Expandir todos" : "⊕ Expand all")}
                </button>
              </div>
            )}
            {data.days?.map((day, di) => (
              <DayCard key={di} day={day} index={di} open={openDays.has(di)}
                onToggle={() => toggleDay(di)} edits={edits} onEdit={openEdit} locale={locale} />
            ))}
          </>
        )}

        {/* ── RESTAURANTS ── */}
        {tab === "restaurants" && (
          cityResults.length > 1
            ? <MultiCitySection cityResults={cityResults} locale={locale} onRetry={onRetryCity} renderCity={(r, ri) =>
                <RestaurantsPanel restaurants={r.restaurants} locale={locale} city={r.city} />
              } />
            : <RestaurantsPanel restaurants={data.restaurants} locale={locale} city={data.city} />
        )}

        {/* ── EVENTS ── */}
        {tab === "events" && (
          cityResults.length > 1
            ? <MultiCitySection cityResults={cityResults} locale={locale} onRetry={onRetryCity} renderCity={(r, ri) =>
                <EventsPanel events={r.events} locale={locale} city={r.city} />
              } />
            : <EventsPanel events={data.events} locale={locale} city={data.city} />
        )}

        {/* ── HOTELS ── */}
        {tab === "hotels" && (
          cityResults.length > 1
            ? <MultiCitySection cityResults={cityResults} locale={locale} onRetry={onRetryCity} renderCity={(r, ri) =>
                <HotelsPanel hotels={r.hotels} locale={locale} city={r.city} />
              } />
            : <HotelsPanel hotels={data.hotels} locale={locale} city={data.city} />
        )}

        {/* ── EXTRAS: Vuelos / Autos / Transporte / Tours ── */}
        {tab === "extras" && (
          <div className="iv-animate">
            {cityResults.length > 1 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {cityResults.map((r, ri) => {
                  const cityAccents = ["hsl(12 85% 55%)","hsl(280 70% 60%)","hsl(200 80% 55%)","hsl(38 95% 58%)","hsl(160 70% 50%)","hsl(320 70% 60%)"];
                  const accent = cityAccents[ri % cityAccents.length];
                  return (
                    <div key={ri}>
                      <CityHeader city={r.city} country={r.country} accent={accent} />
                      <TravelExtrasTabs
                        city={r.city}
                        country={r.country}
                        from={r.days?.[0] ? (() => { const d = new Date(form?.startDate ?? ""); const offset = cityResults.slice(0,ri).reduce((a,c)=>a+(c.days?.length??0),0); d.setDate(d.getDate()+offset); return d.toISOString().split("T")[0]; })() : (form?.startDate ?? "")}
                        to={r.days?.length ? (() => { const d = new Date(form?.startDate ?? ""); const offset = cityResults.slice(0,ri+1).reduce((a,c)=>a+(c.days?.length??0),0); d.setDate(d.getDate()+offset-1); return d.toISOString().split("T")[0]; })() : (form?.endDate ?? "")}
                        pax={form?.travelers ?? 1}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <TravelExtrasTabs
                city={form?.city ?? data.city}
                country={form?.country ?? data.country}
                from={form?.startDate ?? ""}
                to={form?.endDate ?? ""}
                pax={form?.travelers ?? 1}
              />
            )}
          </div>
        )}

        {/* ── SECURITY ── */}
        {tab === "security" && (
          cityResults.length > 1
            ? <MultiCitySection cityResults={cityResults} locale={locale} onRetry={onRetryCity} renderCity={(r, ri) =>
                <SecurityPanel alerts={r.alerts} locale={locale} />
              } />
            : <SecurityPanel alerts={data.alerts} locale={locale} />
        )}

        {/* ── PREPARATION ── */}
        {tab === "preparation" && (
          <PreparationPanel preparation={data.preparation} locale={locale} />
        )}

        {/* ── GASTRONOMY ── */}
        {tab === "gastronomy" && (
          <GastronomyPanel gastronomy={data.gastronomy} locale={locale} />
        )}

        {/* ── TIPS ── */}
        {tab === "tips" && (
          <TipsPanel tips={data.tips} locale={locale} />
        )}

        {/* ── BUDGET BREAKDOWN ── */}
        {tab === "budget" && (
          <BudgetPanel budgetBreakdown={data.budgetBreakdown} estimatedBudgetPerDay={data.estimatedBudgetPerDay} locale={locale} form={form} />
        )}

                {/* ── EDIT MODAL ── */}
        {editModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}>
            <div style={{
              width: 460, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto",
              background: "hsl(250 40% 12%)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 24, padding: 28,
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Barra arcoíris */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 80% 65%))" }} />

              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                ✏️ {locale === "es" ? "Editar" : "Edit"}: <span style={{ color: "hsl(38 95% 65%)" }}>{editModal.name}</span>
              </h3>

              {/* Alternativas */}
              {editModal.alternatives && editModal.alternatives.length > 0 && (
                <div style={{ marginBottom: 18, padding: 14, background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <label style={{ fontSize: 11, color: "hsl(160 70% 55%)", fontWeight: 700, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    🔄 {locale === "es" ? "Reemplazar por alternativa" : "Replace with alternative"}
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, cursor: "pointer", padding: "8px 10px", borderRadius: 8, background: editAltIdx === -1 ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid transparent", transition: "all 0.15s" }}>
                      <input type="radio" name="alt" checked={editAltIdx === -1} onChange={() => setEditAltIdx(-1)} style={{ accentColor: "hsl(12 85% 55%)", marginTop: 2 }} />
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{locale === "es" ? "Mantener:" : "Keep:"} <strong style={{ color: "#fff" }}>{editModal.name}</strong></span>
                    </label>
                    {editModal.alternatives.map((a, i) => (
                      <label key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, cursor: "pointer", padding: "8px 10px", borderRadius: 8, background: editAltIdx === i ? "hsl(160 60% 20%/0.3)" : "transparent", border: `1px solid ${editAltIdx === i ? "hsl(160 70%50%/0.3)" : "transparent"}`, transition: "all 0.15s" }}>
                        <input type="radio" name="alt" checked={editAltIdx === i} onChange={() => setEditAltIdx(i)} style={{ accentColor: "hsl(12 85% 55%)", marginTop: 2 }} />
                        <span>
                          <strong style={{ color: "#fff" }}>{a.name}</strong>
                          {a.price && <span style={{ color: "hsl(160 70% 55%)", marginLeft: 6 }}>· {a.price}</span>}
                          {a.rating && <span style={{ color: "hsl(38 95% 65%)", marginLeft: 6 }}>· ★ {a.rating}</span>}
                          <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 2, lineHeight: 1.5 }}>{a.description}</div>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Nombre */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t("placeName", locale)}</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} disabled={editAltIdx >= 0}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 14, background: "rgba(255,255,255,0.06)", color: "#fff", outline: "none", opacity: editAltIdx >= 0 ? 0.4 : 1, boxSizing: "border-box" }} />
              </div>

              {/* Nota personal */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t("personalNote", locale)}</label>
                <textarea value={editNote} onChange={e => setEditNote(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 13, height: 80, resize: "vertical", background: "rgba(255,255,255,0.06)", color: "#fff", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setEditModal(null)}
                  className="iv-btn-ghost" style={{ flex: 1, padding: "10px 0", fontSize: 13 }}>
                  {t("cancel", locale)}
                </button>
                <button onClick={saveEdit}
                  style={{ flex: 2, padding: "10px 0", background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, boxShadow: "0 6px 20px hsl(12 85% 55%/0.45)" }}>
                  {t("saveChanges", locale)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {data.generatedBy && (
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 24, fontFamily: "monospace" }}>
            {data.generatedBy}
          </div>
        )}
        </div>{/* /iv-main */}
      </div>{/* /iv-layout */}
    </div>
  );
}

// ── DayCard ────────────────────────────────────────────────────────────────────
function DayCard({ day, index, open, onToggle, edits, onEdit, locale }: {
  day: ItineraryDay; index: number; open: boolean;
  onToggle: () => void; edits: UserEdits;
  onEdit: (item: ItineraryItem) => void; locale: Locale;
}) {
  const routeStops = day.items.filter(it => ["sight","food","event","beach","night"].includes(it.type));
  const q = (s: string) => encodeURIComponent(s.trim());
  const waypoints = routeStops.map(it => it.lat && it.lon ? `${it.lat},${it.lon}` : q(`${it.name} ${day.zone ?? ""}`)).join("/");
  const routeUrl = routeStops.length >= 2
    ? `https://www.google.com/maps/dir/${waypoints}`
    : routeStops.length === 1 ? `https://www.google.com/maps/search/?api=1&query=${q(`${routeStops[0].name} ${day.zone ?? ""}`)}` : null;

  // Color del acento por día (ciclo)
  const accentColors = ["hsl(12 85% 55%)", "hsl(280 70% 60%)", "hsl(200 80% 55%)", "hsl(38 95% 58%)", "hsl(160 70% 50%)", "hsl(320 70% 60%)"];
  const accent = accentColors[index % accentColors.length];

  return (
    <div style={{
      marginBottom: 10, borderRadius: 20, overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(16px)",
      transition: "box-shadow 0.2s",
    }}>
      {/* Cabecera del día */}
      <div
        onClick={onToggle}
        style={{ padding: "20px 28px", borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, cursor: "pointer", position: "relative" }}
      >
        {/* Línea de color izquierda */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent, borderRadius: "20px 0 0 20px" }} />

        <div style={{ paddingLeft: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent, marginBottom: 4 }}>
            {t("day", locale)} {day.dayNum} · {day.date}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{day.theme}</div>
          {day.zone && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>📍 {day.zone}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {routeUrl && (
            <a href={routeUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 11, padding: "5px 12px", background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "white", borderRadius: 12, textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 4px 12px hsl(12 85% 55%/0.4)" }}>
              🗺 Ruta en Maps ↗
            </a>
          )}
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s", display: "inline-block" }}>⌄</span>
        </div>
      </div>

      {/* Items del día */}
      {open && (
        <div style={{ padding: "12px 20px 16px" }}>
          {day.items.map(item => {
            const edit = edits[item.id] ?? {};
            const rep = edit.replacement;
            const displayItem: ItineraryItem = rep
              ? { ...item, name: rep.name, description: rep.description, type: (rep.type ?? item.type) as ItineraryItem["type"],
                  duration: rep.duration ?? item.duration, transport: rep.transport ?? item.transport,
                  transportTime: rep.transportTime ?? item.transportTime, price: rep.price ?? item.price,
                  rating: rep.rating ?? item.rating, tip: rep.tip ?? item.tip, links: undefined, wikidataDescription: undefined, viatorUrl: undefined }
              : item;
            const name = edit.name ?? displayItem.name;
            const bd = BADGE[displayItem.type] ?? BADGE.sight;
            const isSight = ["sight","beach","event","food","night"].includes(displayItem.type);
            const isTransport = displayItem.type === "transport";

            if (isTransport) return (
              <div key={item.id} style={{ padding: "8px 12px", margin: "6px 0", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{item.time}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>🚶 {name}</span>
                {displayItem.duration && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>· {displayItem.duration}</span>}
              </div>
            );

            return (
              <div key={item.id} className="iv-day-item">
                {/* FOTO IZQUIERDA — sin overlay, limpia como QEEQ */}
                <div className="iv-day-photo">
                  <WikiPhoto query={name} width={600} height={220} radius={0}
                    emoji={displayItem.type === "food" ? "🍽️" : displayItem.type === "beach" ? "🏖️" : displayItem.type === "night" ? "🌙" : "🏛️"} />
                </div>

                {/* CONTENIDO DEBAJO — layout QEEQ */}
                <div className="iv-day-body">
                  {/* Hora · duración — igual que QEEQ */}
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 8, fontWeight: 500, letterSpacing: "0.01em" }}>
                    {item.time}{displayItem.duration ? ` · ${displayItem.duration}` : ""}
                  </div>

                  {/* Título — H3 style igual que QEEQ */}
                  <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{name}</div>

                  {/* Descripción */}
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 10 }}>{displayItem.description}</div>

                  {/* Tip */}
                  {displayItem.tip && (
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 10, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, borderLeft: "3px solid hsl(38 95% 58%)", lineHeight: 1.6, fontStyle: "italic" }}>
                      {displayItem.tip}
                    </div>
                  )}
                  {edit.note && (
                    <div style={{ fontSize: 12, color: "hsl(160 70% 55%)", marginBottom: 8, padding: "5px 10px", background: "hsl(160 60% 20%/0.2)", borderRadius: 8, borderLeft: "3px solid hsl(160 70% 50%)" }}>📝 {edit.note}</div>
                  )}

                  {/* Fila inferior: badge · transporte · rating · precio · links · editar */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: "auto" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "2px 9px", borderRadius: 20, background: bd.bg, color: bd.color, fontWeight: 700, border: `1px solid ${bd.color}33` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: bd.dot, display: "inline-block" }} />
                      {displayItem.type}
                    </span>
                    {displayItem.transport && (
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>🚶 {displayItem.transport}{displayItem.transportTime ? ` ${displayItem.transportTime}` : ""}</span>
                    )}
                    {displayItem.rating && (
                      <span style={{ fontSize: 11, color: "hsl(38 95% 65%)", fontWeight: 600 }}>★ {displayItem.rating}</span>
                    )}
                    {displayItem.price && (
                      <span style={{ fontSize: 12, fontWeight: 800, color: "hsl(38 95% 65%)" }}>{displayItem.price}</span>
                    )}
                    {isSight && displayItem.links?.googleMaps && (
                      <a href={displayItem.links.googleMaps} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)" }}>🗺 Maps</a>
                    )}
                    {displayItem.viatorUrl && (
                      <a href={displayItem.viatorUrl} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid hsl(12 85% 55%/0.4)", color: "hsl(12 85% 65%)", background: "hsl(12 85% 55%/0.1)" }}>🎫 Reservar</a>
                    )}
                    <button onClick={() => onEdit(item)}
                      style={{ fontSize: 11, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", cursor: "pointer", marginLeft: "auto" }}>
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── RetryButton — botón de reintento reutilizable ────────────────────────────
function RetryButton({ label, locale, onRetry }: { label: string; locale: Locale; onRetry: () => Promise<void> }) {
  const [loading, setLoading] = React.useState(false);
  async function handle() {
    setLoading(true);
    try { await onRetry(); } finally { setLoading(false); }
  }
  return (
    <button onClick={handle} disabled={loading}
      style={{ padding: "6px 16px", borderRadius: 14, cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", fontWeight: 600, fontSize: 12, border: "none", opacity: loading ? 0.7 : 1, transition: "all 0.2s", boxShadow: loading ? "none" : "0 4px 12px hsl(12 85% 55%/0.4)" }}>
      {loading ? "⏳..." : `🔄 ${locale === "es" ? "Reintentar" : "Retry"} ${label}`}
    </button>
  );
}

// ── CityHeader — separador visual entre ciudades ───────────────────────────────
function CityHeader({ city, country, accent }: { city: string; country: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${accent}` }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
      <div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{city}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginLeft: 8 }}>{country}</span>
      </div>
    </div>
  );
}

// ── MultiCitySection — wrapper que itera por ciudad con retry ─────────────────
function MultiCitySection({ cityResults, locale, onRetry, renderCity }: {
  cityResults: ItineraryData[];
  locale: Locale;
  onRetry?: (idx: number) => Promise<void>;
  renderCity: (r: ItineraryData, idx: number) => React.ReactNode;
}) {
  const accents = ["hsl(12 85% 55%)","hsl(280 70% 60%)","hsl(200 80% 55%)","hsl(38 95% 58%)","hsl(160 70% 50%)","hsl(320 70% 60%)"];
  const [retrying, setRetrying] = React.useState<number | null>(null);

  async function handleRetry(i: number) {
    if (!onRetry) return;
    setRetrying(i);
    try { await onRetry(i); } finally { setRetrying(null); }
  }

  return (
    <div className="iv-animate" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {cityResults.map((r, i) => {
        const accent = accents[i % accents.length];
        // Detectar si esta ciudad no tiene datos útiles
        const hasData =
          (r.days?.length ?? 0) > 0 ||
          (r.restaurants?.length ?? 0) > 0 ||
          (r.events?.length ?? 0) > 0 ||
          (r.alerts?.length ?? 0) > 0;

        return (
          <div key={i} className="iv-card" style={{ borderTop: `3px solid ${accent}` }}>
            <CityHeader city={r.city} country={r.country} accent={accent} />

            {!hasData ? (
              // Ciudad sin datos — mostrar botón retry
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
                  {locale === "es"
                    ? `No se pudieron cargar los datos de ${r.city}. Esto puede ocurrir por límite de velocidad.`
                    : `Could not load data for ${r.city}. This may occur due to rate limiting.`}
                </div>
                {onRetry && (
                  <button
                    onClick={() => handleRetry(i)}
                    disabled={retrying === i}
                    style={{
                      padding: "10px 28px", borderRadius: 20, cursor: retrying === i ? "not-allowed" : "pointer",
                      background: retrying === i ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))",
                      color: "#fff", fontWeight: 700, fontSize: 13, border: "none",
                      boxShadow: retrying === i ? "none" : "0 4px 16px hsl(12 85% 55%/0.4)",
                      opacity: retrying === i ? 0.7 : 1, transition: "all 0.2s",
                    }}>
                    {retrying === i
                      ? (locale === "es" ? "⏳ Reintentando..." : "⏳ Retrying...")
                      : (locale === "es" ? "🔄 Reintentar esta ciudad" : "🔄 Retry this city")}
                  </button>
                )}
              </div>
            ) : (
              renderCity(r, i)
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── EventsPanel ───────────────────────────────────────────────────────────────
function EventsPanel({ events, locale, city: _city }: { events: ItineraryData["events"]; locale: Locale; city?: string }) {
  if (!events?.length) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "2rem 0", fontSize: 13 }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>🎭</div>
      {locale === "es" ? "No se encontraron eventos para estas fechas." : "No events found for these dates."}
    </div>
  );

  const typeColor: Record<string, string> = {
    festival: "hsl(12 85% 60%)", concert: "hsl(280 70% 65%)", permanent: "hsl(160 70% 50%)",
    sport: "hsl(200 80% 55%)", market: "hsl(38 95% 60%)", cinema: "hsl(320 70% 60%)",
  };

  return (
    <div className="iv-events-grid">
      {events.map((ev, i) => {
        const tc = typeColor[ev.type] ?? "hsl(280 70% 65%)";
        return (
          <div key={i} className="iv-card iv-animate" style={{ padding: 0, overflow: "hidden", cursor: ev.ticketUrl ? "pointer" : "default" }}
            onClick={() => ev.ticketUrl && window.open(ev.ticketUrl, "_blank")}>
            {/* Foto grande */}
            <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
              <WikiPhoto query={ev.venue ? ev.name + " " + ev.venue : ev.name} width={300} height={160} radius={0} emoji="🎭" />
              {/* Badge tipo encima */}
              <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: tc, color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 2px 8px ${tc}88` }}>
                  {ev.type}
                </span>
              </div>
              {/* Precio encima derecha */}
              <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
                <span style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20, background: "rgba(0,0,0,0.7)", color: "hsl(38 95% 65%)", fontWeight: 800, backdropFilter: "blur(8px)" }}>
                  {ev.price}
                </span>
              </div>
              {/* Gradiente inferior */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, rgba(10,8,24,0.9) 0%, transparent 100%)" }} />
            </div>

            {/* Contenido */}
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.3 }}>{ev.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>📅 {ev.when}{ev.venue ? ` · ${ev.venue}` : ""}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.65, marginBottom: 12 }}>{ev.description}</div>
              {ev.ticketUrl && (
                <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, padding: "8px 18px", background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "white", borderRadius: 20, textDecoration: "none", fontWeight: 700, boxShadow: "0 4px 12px hsl(12 85% 55%/0.4)" }}>
                  🎟 {locale === "es" ? "Reservar entradas" : "Book tickets"} ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── HotelsPanel ───────────────────────────────────────────────────────────────
function HotelsPanel({ hotels, locale, city }: { hotels: ItineraryData["hotels"]; locale: Locale; city: string }) {
  if (!hotels?.length) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "2rem 0", fontSize: 13 }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🏨</div>
      <div>{locale === "es" ? "Generando links de hoteles..." : "Loading hotel links..."}</div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
      {hotels.map((hotel, i) => {
        const pc = HOTEL_COLORS[hotel.platform ?? ""] ?? { accent: "hsl(12 85% 55%)", label: hotel.name };
        return (
          <a key={i} href={hotel.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ borderRadius: 16, padding: "16px 16px 14px", cursor: "pointer", background: "rgba(255,255,255,0.05)", border: `1.5px solid ${pc.accent}55`, transition: "all 0.2s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${pc.accent}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: pc.accent }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{pc.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{city}</div>
              <div style={{ background: pc.accent, color: "white", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                {locale === "es" ? "Buscar hoteles ↗" : "Search hotels ↗"}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

// ── SecurityPanel ─────────────────────────────────────────────────────────────
function SecurityPanel({ alerts, locale }: { alerts: ItineraryData["alerts"]; locale: Locale }) {
  if (!alerts?.length) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "1.5rem 0", fontSize: 13 }}>
      ✅ {locale === "es" ? "Sin alertas de seguridad registradas." : "No security alerts registered."}
    </div>
  );
  const riskLabels = { alto: t("riskHigh", locale), medio: t("riskMed", locale), bajo: t("riskLow", locale) };
  return (
    <>
      {alerts.map((al, i) => {
        const r = RISK[al.level] ?? RISK.bajo;
        return (
          <div key={i} style={{ padding: "14px 0", borderBottom: i < alerts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", display: "flex", gap: 14 }}>
            <div style={{ width: 4, borderRadius: 2, background: r.bar, flexShrink: 0, alignSelf: "stretch", boxShadow: `0 0 8px ${r.bar}88` }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {al.zone}
                <span style={{ fontSize: 10, background: r.badge.bg, color: r.badge.color, padding: "2px 9px", borderRadius: 8, fontWeight: 600 }}>{riskLabels[al.level]}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.65 }}>{al.description}</div>
              <div style={{ fontSize: 13, color: "hsl(160 70% 55%)", marginTop: 6, display: "flex", alignItems: "flex-start", gap: 5 }}>
                <span>💡</span> {al.tip}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── RestaurantsPanel ───────────────────────────────────────────────────────────
function RestaurantsPanel({ restaurants, locale, city }: { restaurants: ItineraryData["restaurants"]; locale: Locale; city: string }) {
  const tiers = ["$","$$","$$$","$$$$"] as const;
  const tierLabels: Record<string, string> = { "$": t("economico",locale), "$$": t("moderado",locale), "$$$": t("premium",locale), "$$$$": t("lujo",locale) };
  const tierColors: Record<string, string> = { "$": "hsl(160 70% 50%)", "$$": "hsl(38 95% 60%)", "$$$": "hsl(280 70% 65%)", "$$$$": "hsl(12 85% 60%)" };

  const all = restaurants ?? [];
  const byTier: Record<string, typeof all> = { "$":[], "$$":[], "$$$":[], "$$$$":[], other:[] };
  for (const r of all) {
    const key = r.priceRange?.trim() as string;
    if (byTier[key]) byTier[key].push(r); else byTier["other"].push(r);
  }
  byTier["$"] = [...byTier["$"], ...byTier["other"]];

  if (!all.length) return (
    <div className="iv-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "2.5rem" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
      <div style={{ fontSize: 14 }}>No restaurant data available</div>
    </div>
  );

  const q = (s: string) => encodeURIComponent(s.trim());
  const luckySearch = (site: string, name: string) => `https://www.google.com/search?q=${q(`site:${site} ${name} ${city}`)}`;

  return (
    <>
      {tiers.map(tier => {
        const list = byTier[tier] ?? [];
        if (!list.length) return null;
        const accentColor = tierColors[tier];
        const routeWaypoints = list.map(r => `${r.name} ${r.address ?? ""} ${city}`.trim()).map(q).join("/");
        const routeUrl = `https://www.google.com/maps/dir/${routeWaypoints}`;

        return (
          <div key={tier} className="iv-card iv-animate" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, color: accentColor }}>{tier}</span>
                <span style={{ color: "#fff" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{tierLabels[tier]}</span>
              </h3>
              {list.length >= 2 && (
                <a href={routeUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, padding: "5px 12px", background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "white", borderRadius: 12, textDecoration: "none", fontWeight: 600, boxShadow: "0 4px 12px hsl(12 85% 55%/0.4)" }}>
                  🛣 Ruta sugerida ↗
                </a>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {list.map((r, i) => {
                const website = (r as { website?: string }).website;
                const gMapsUrl = (r as { googleMapsUrl?: string }).googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${q(`${r.name} ${r.address ?? ""} ${city}`)}`;
                const reviewsCount = (r as { reviewsCount?: number }).reviewsCount;
                return (
                  <div key={i} className="iv-card-inner" style={{ borderLeft: `3px solid ${accentColor}55` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.name}</div>
                      <span style={{ fontSize: 12, color: accentColor, fontWeight: 700, flexShrink: 0 }}>{r.priceRange}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.type}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
                      {r.rating && <span style={{ fontSize: 11, color: "hsl(38 95% 65%)", fontWeight: 600 }}>★ {r.rating}{reviewsCount ? ` (${reviewsCount})` : ""}</span>}
                      {r.zone && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📍 {r.zone}</span>}
                    </div>
                    {r.specialty && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>✦ {r.specialty}</div>}
                    {r.address && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>🏠 {r.address}</div>}

                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      <a href={gMapsUrl} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.07)" }}>🗺 Maps</a>
                      {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer"
                          className="iv-link" style={{ border: `1px solid ${accentColor}44`, color: accentColor, background: `${accentColor}15` }}>🌐 Web oficial</a>
                      )}
                      <a href={luckySearch("tripadvisor.com", r.name)} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.05)" }}>⭐ TripAdvisor</a>
                      <a href={luckySearch("yelp.com", r.name)} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.05)" }}>🍴 Yelp</a>
                      <a href={luckySearch("thefork.com", r.name)} target="_blank" rel="noopener noreferrer"
                        className="iv-link" style={{ border: "1px solid hsl(180 70%45%/0.35)", color: "hsl(180 70% 60%)", background: "hsl(180 70%45%/0.1)" }}>🍽 TheFork</a>
                    </div>
                    {r.source && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>via {r.source}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── PreparationPanel ──────────────────────────────────────────────────────────
function PreparationPanel({ preparation, locale }: { preparation?: import("@/lib/types").PrepItem[]; locale: Locale }) {
  if (!preparation?.length) return (
    <div className="iv-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "2.5rem" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🎒</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{locale === "es" ? "Sin datos de preparación" : "No preparation data"}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16, lineHeight: 1.6 }}>
        {locale === "es" ? "Esta sección se genera junto al itinerario. Si no cargó, genera el itinerario de nuevo." : "This section is generated with the itinerary. If it didn't load, regenerate."}
      </div>
      <button onClick={() => window.location.reload()}
        style={{ padding: "9px 24px", borderRadius: 20, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 4px 16px hsl(12 85% 55%/0.4)" }}>
        🔄 {locale === "es" ? "Reintentar" : "Retry"}
      </button>
    </div>
  );

  const categoryColors: Record<string, string> = {
    document: "hsl(200 80% 55%)",
    health: "hsl(160 70% 50%)",
    money: "hsl(38 95% 60%)",
    transport: "hsl(280 70% 65%)",
    connectivity: "hsl(12 85% 60%)",
    packing: "hsl(320 70% 65%)",
    other: "rgba(255,255,255,0.5)",
  };

  return (
    <div className="iv-animate">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          🎒 {locale === "es" ? "Preparación del viaje" : "Trip Preparation"}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
          {locale === "es" ? "Lo que necesitas tener listo antes de salir" : "Everything you need ready before departure"}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {preparation.map((item, i) => {
          const color = categoryColors[item.category] ?? categoryColors.other;
          return (
            <div key={i} className="iv-card-inner" style={{ borderLeft: `3px solid ${color}66`, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{item.description}</div>
                <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, padding: "2px 9px", borderRadius: 8, background: `${color}22`, color, border: `1px solid ${color}44`, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── GastronomyPanel ───────────────────────────────────────────────────────────
function GastronomyPanel({ gastronomy, locale }: { gastronomy?: import("@/lib/types").GastronomyItem[]; locale: Locale }) {
  if (!gastronomy?.length) return (
    <div className="iv-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "2.5rem" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🍜</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{locale === "es" ? "Sin datos de gastronomía" : "No gastronomy data"}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16, lineHeight: 1.6 }}>
        {locale === "es" ? "Esta sección se genera junto al itinerario. Si no cargó, genera el itinerario de nuevo." : "This section is generated with the itinerary. If it didn't load, regenerate."}
      </div>
      <button onClick={() => window.location.reload()}
        style={{ padding: "9px 24px", borderRadius: 20, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 4px 16px hsl(12 85% 55%/0.4)" }}>
        🔄 {locale === "es" ? "Reintentar" : "Retry"}
      </button>
    </div>
  );

  const priceColors: Record<string, string> = { "$": "hsl(160 70% 50%)", "$$": "hsl(38 95% 60%)", "$$$": "hsl(280 70% 65%)" };

  return (
    <div className="iv-animate">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          🍜 {locale === "es" ? "Gastronomía local · Platos imperdibles" : "Local Gastronomy · Must-Try Dishes"}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
          {locale === "es" ? "Sabores auténticos que no puedes dejar de probar" : "Authentic flavours you cannot miss"}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {gastronomy.map((item, i) => {
          const priceColor = priceColors[item.priceRange ?? "$$"] ?? "hsl(38 95% 60%)";
          return (
            <div key={i} className="iv-card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
              {item.mustTry && (
                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "linear-gradient(135deg,hsl(38 95% 55%),hsl(12 85% 55%))", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
                  ★ {locale === "es" ? "Imprescindible" : "Must Try"}
                </div>
              )}
              <WikiPhoto query={item.city ? item.name + " " + item.city + " food" : item.name + " dish"} width={400} height={140} radius={0} emoji="🍽️" />
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.name}</div>
                {item.city && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>📍 {item.city}</div>}
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{item.description}</div>
                {item.priceRange && (
                  <span style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: priceColor, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: `${priceColor}22`, border: `1px solid ${priceColor}44` }}>
                    {item.priceRange}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TipsPanel ─────────────────────────────────────────────────────────────────
function TipsPanel({ tips, locale }: { tips?: import("@/lib/types").TipItem[]; locale: Locale }) {
  if (!tips?.length) return (
    <div className="iv-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "2.5rem" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>💡</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{locale === "es" ? "Sin consejos cargados" : "No tips loaded"}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16, lineHeight: 1.6 }}>
        {locale === "es" ? "Esta sección se genera junto al itinerario. Si no cargó, genera el itinerario de nuevo." : "This section is generated with the itinerary. If it didn't load, regenerate."}
      </div>
      <button onClick={() => window.location.reload()}
        style={{ padding: "9px 24px", borderRadius: 20, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", boxShadow: "0 4px 16px hsl(12 85% 55%/0.4)" }}>
        🔄 {locale === "es" ? "Reintentar" : "Retry"}
      </button>
    </div>
  );

  const catColor: Record<string, string> = {
    transport: "hsl(200 80% 55%)",
    safety: "hsl(0 75% 65%)",
    culture: "hsl(280 70% 65%)",
    money: "hsl(38 95% 60%)",
    tech: "hsl(160 70% 50%)",
    general: "rgba(255,255,255,0.5)",
  };

  return (
    <div className="iv-animate">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          💡 {locale === "es" ? "Consejos útiles para tu viaje" : "Useful Tips for Your Trip"}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
          {locale === "es" ? "Conocimiento local para viajar mejor" : "Local knowledge to travel smarter"}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {tips.map((tip, i) => {
          const color = catColor[tip.category] ?? catColor.general;
          return (
            <div key={i} className="iv-card-inner" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {tip.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{tip.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{tip.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── BudgetPanel ───────────────────────────────────────────────────────────────
function BudgetPanel({ budgetBreakdown, estimatedBudgetPerDay, locale, form }: {
  budgetBreakdown?: import("@/lib/types").BudgetBreakdown;
  estimatedBudgetPerDay?: string;
  locale: Locale;
  form?: import("@/lib/types").TripFormData | null;
}) {
  const rows = budgetBreakdown ? [
    { label: locale === "es" ? "Alojamiento" : "Accommodation", icon: "🏨", value: budgetBreakdown.accommodation },
    { label: locale === "es" ? "Transporte" : "Transport", icon: "🚗", value: budgetBreakdown.transport },
    { label: locale === "es" ? "Comidas y restaurantes" : "Food & Restaurants", icon: "🍽️", value: budgetBreakdown.food },
    { label: locale === "es" ? "Eventos y actividades" : "Events & Activities", icon: "🎭", value: budgetBreakdown.activities },
  ] : [];

  return (
    <div className="iv-animate">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          💰 {locale === "es" ? "Presupuesto estimado del viaje" : "Estimated Trip Budget"}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
          {locale === "es"
            ? `Estimación para ${form?.travelers ?? 1} persona(s) · ${form?.budget ?? "moderado"}`
            : `Estimate for ${form?.travelers ?? 1} traveler(s) · ${form?.budget ?? "moderate"}`}
        </p>
      </div>

      {/* Presupuesto por día */}
      {estimatedBudgetPerDay && (
        <div className="iv-card" style={{ marginBottom: 12, background: "hsl(160 60% 20% / 0.2)", border: "1px solid hsl(160 70% 50% / 0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "hsl(160 70% 55%)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {locale === "es" ? "Presupuesto diario estimado" : "Estimated daily budget"}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 4 }}>{estimatedBudgetPerDay}</div>
            </div>
            <div style={{ fontSize: 36 }}>📊</div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            {locale === "es" ? "por persona · por día (estimación)" : "per person · per day (estimate)"}
          </div>
        </div>
      )}

      {/* Desglose total */}
      {budgetBreakdown ? (
        <div className="iv-card">
          <div style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
              {locale === "es" ? "Desglose total del viaje" : "Total trip breakdown"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {rows.map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{(row as {icon:string}).icon}</span>{row.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", marginTop: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                {locale === "es" ? "Total estimado" : "Estimated total"}
              </span>
              <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,hsl(38 95% 65%),hsl(12 85% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {budgetBreakdown.total}
              </span>
            </div>
          </div>
          {budgetBreakdown.notes && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, borderLeft: "3px solid rgba(255,255,255,0.1)", lineHeight: 1.6 }}>
              💡 {budgetBreakdown.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="iv-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "2rem" }}>
          <div style={{ fontSize: 13 }}>{locale === "es" ? "Generando desglose de presupuesto..." : "Generating budget breakdown..."}</div>
        </div>
      )}

      {/* Nota aclaratoria */}
      <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
        ⚠️ {locale === "es"
          ? "Valores aproximados. Los precios reales pueden variar según temporada, disponibilidad y tipo de cambio al momento del viaje."
          : "Approximate values. Actual prices may vary based on season, availability, and exchange rate at the time of travel."}
      </div>
    </div>
  );
}
