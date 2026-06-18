// src/components/ItineraryView.tsx — Rediseño QEEQ-inspired. Lógica 100% intacta.
import React, { useState, useEffect, useRef } from "react";
import type { ItineraryData, ItineraryDay, ItineraryItem, UserEdits, Locale, TripFormData, Restaurant, Event, Hotel, SecurityAlert, PrepItem, GastronomyItem, TipItem, BudgetBreakdown } from "@/lib/types";
import { t } from "@/lib/i18n";
import TravelExtrasTabs from "@/components/TravelExtrasTabs";

// ── Badges de tipo ────────────────────────────────────────────────────────────
const BADGE: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  sight:     { label: "sight",     bg: "hsl(160 60% 20% / 0.25)", color: "hsl(160 70% 55%)", dot: "hsl(160 70% 50%)" },
  food:      { label: "food",      bg: "hsl(38 90% 50% / 0.2)",   color: "hsl(38 95% 65%)",  dot: "hsl(38 95% 60%)"  },
  transport: { label: "move",      bg: "rgba(255,255,255,0.07)",   color: "rgba(255,255,255,0.5)", dot: "rgba(255,255,255,0.4)" },
  event:     { label: "event",     bg: "hsl(280 70% 50% / 0.2)",  color: "hsl(280 70% 72%)", dot: "hsl(280 70% 65%)" },
  alert:     { label: "alert",     bg: "hsl(0 75% 50% / 0.2)",    color: "hsl(0 75% 70%)",   dot: "hsl(0 75% 60%)"   },
  beach:     { label: "beach",     bg: "hsl(200 80% 50% / 0.2)",  color: "hsl(200 85% 70%)", dot: "hsl(200 85% 60%)" },
  night:     { label: "night",     bg: "hsl(250 60% 40% / 0.3)",  color: "hsl(250 80% 80%)", dot: "hsl(250 80% 70%)" },
};

const BADGE_DAY: Record<string, { label: string; bg: string; color: string }> = {
  sight:     { label: "Monumento",   bg: "#FFF3E0", color: "#E65100" },
  food:      { label: "Gastronomía", bg: "#FFF3E0", color: "#E65100" },
  transport: { label: "Transporte",  bg: "#F3F4F6", color: "#6B7280" },
  event:     { label: "Evento",      bg: "#FFF3E0", color: "#E65100" },
  alert:     { label: "Alerta",      bg: "#FEE2E2", color: "#DC2626" },
  beach:     { label: "Playa",       bg: "#DBEAFE", color: "#1D4ED8" },
  night:     { label: "Vida nocturna", bg: "#F3E8FF", color: "#7C3AED" },
};

const RISK = {
  alto:  { bar: "hsl(0 75% 60%)",   badge: { bg: "hsl(0 75% 50%/0.2)",   color: "hsl(0 75% 70%)"   } },
  medio: { bar: "hsl(38 95% 60%)",  badge: { bg: "hsl(38 90% 50%/0.2)",  color: "hsl(38 95% 65%)"  } },
  bajo:  { bar: "hsl(160 70% 50%)", badge: { bg: "hsl(160 60%20%/0.25)", color: "hsl(160 70% 55%)" } },
};

const HOTEL_COLORS: Record<string, { accent: string; label: string }> = {
  "Booking.com": { accent: "#0071c2", label: "Booking"    },
  "Hotels.com":  { accent: "#d32d20", label: "Hotels.com" },
  "Expedia":     { accent: "#1a3286", label: "Expedia"    },
  "Airbnb":      { accent: "#ff385c", label: "Airbnb"     },
  "Trivago":     { accent: "#c8102e", label: "Trivago"    },
  "Kayak":       { accent: "#ff690f", label: "Kayak"      },
};

// ── Fotos Pexels para el carrusel hero ───────────────────────────────────────
const CAROUSEL_PHOTOS = [
  { url: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",    caption: "Descubre el mundo" },
  { url: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  caption: "Experiencias únicas" },
  { url: "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  caption: "Aventura sin límites" },
  { url: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  caption: "Paisajes memorables" },
  { url: "https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  caption: "Momentos que inspiran" },
  { url: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  caption: "Tu próximo destino" },
];

// ── WikiPhoto ─────────────────────────────────────────────────────────────────
function WikiPhoto({ query, width, height, radius, emoji }: {
  query: string; width: number; height: number; radius: number; emoji?: string;
}) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const encoded = encodeURIComponent(query.trim());
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=${Math.max(width, height) * 2}&origin=*`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const pages = data?.query?.pages ?? {};
        const page = Object.values(pages)[0] as { thumbnail?: { source: string } };
        if (page?.thumbnail?.source) {
          setSrc(page.thumbnail.source);
        } else {
          return fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encoded}&prop=imageinfo&iiprop=url&iiurlwidth=${Math.max(width, height) * 2}&format=json&origin=*`)
            .then(r => r.json())
            .then(d2 => {
              if (cancelled) return;
              const pages2 = d2?.query?.pages ?? {};
              const first = Object.values(pages2)[0] as { imageinfo?: { thumburl: string }[] };
              if (first?.imageinfo?.[0]?.thumburl) {
                setSrc(first.imageinfo[0].thumburl);
              } else { setFailed(true); }
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
  if (failed || (!src && query === "")) return <div style={style}>{emoji ?? "🏛"}</div>;
  if (!src) return <div style={{ ...style, background: "linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%)", backgroundSize: "200% 100%", animation: "iv-shimmer 1.4s linear infinite" }} />;
  return (
    <div style={style}>
      <img src={src} alt={query} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: radius }} onError={() => setFailed(true)} />
    </div>
  );
}

// ── Pexels fallback photos por categoría (garantizan imagen siempre visible) ─
const PEXELS_FALLBACKS: Record<string, string> = {
  // Tipos de actividad
  sight:      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  food:       "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  transport:  "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  event:      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  beach:      "https://images.pexels.com/photos/1021073/pexels-photo-1021073.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  night:      "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  alert:      "https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  // Tipos de evento
  festival:   "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  concert:    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  permanent:  "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  sport:      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  market:     "https://images.pexels.com/photos/1550318/pexels-photo-1550318.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  cinema:     "https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  // Gastronomía y default
  gastronomy: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  default:    "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
};

// ── SmartPhoto — Wikipedia primero, Pexels como garantía si falla ─────────────
// A diferencia de WikiPhoto, usa height en px fijo y SIEMPRE muestra imagen.
function SmartPhoto({ query, fallbackUrl, height, radius = 0 }: {
  query: string;
  fallbackUrl: string;
  height: number;
  radius?: number;
}) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) { setSrc(fallbackUrl); return; }
    let cancelled = false;
    const encoded = encodeURIComponent(query.trim());

    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=800&origin=*`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const pages = data?.query?.pages ?? {};
        const page = Object.values(pages)[0] as { thumbnail?: { source: string } };
        if (page?.thumbnail?.source) {
          setSrc(page.thumbnail.source);
        } else {
          // Fallback: Wikimedia Commons (más amplio que Wikipedia)
          return fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encoded}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`)
            .then(r => r.json())
            .then(d2 => {
              if (cancelled) return;
              const pages2 = d2?.query?.pages ?? {};
              const first = Object.values(pages2)[0] as { imageinfo?: { thumburl: string }[] };
              if (first?.imageinfo?.[0]?.thumburl) {
                setSrc(first.imageinfo[0].thumburl);
              } else {
                setSrc(fallbackUrl); // Pexels garantizado
              }
            });
        }
      })
      .catch(() => { if (!cancelled) setSrc(fallbackUrl); });
    return () => { cancelled = true; };
  }, [query, fallbackUrl]);

  // Loading skeleton
  if (!src) {
    return (
      <div style={{
        width: "100%", height, flexShrink: 0, borderRadius: radius,
        background: "linear-gradient(90deg, #EEEDEA 25%, #E4E3DF 50%, #EEEDEA 75%)",
        backgroundSize: "200% 100%", animation: "iv-shimmer 1.4s linear infinite",
      }} />
    );
  }

  return (
    <div style={{ width: "100%", height, borderRadius: radius, overflow: "hidden", flexShrink: 0 }}>
      <img
        src={imgFailed ? fallbackUrl : src}
        alt={query}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={() => setImgFailed(true)}
      />
    </div>
  );
}

// ── HeroCarousel — autoplay con fotos Pexels ─────────────────────────────────
function HeroCarousel({ city, country, isDayTheme }: { city: string; country: string; isDayTheme: boolean }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % CAROUSEL_PHOTOS.length);
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: isDayTheme ? 320 : 280, overflow: "hidden", borderRadius: isDayTheme ? 0 : 20, background: "#1a1a2e" }}>
      {CAROUSEL_PHOTOS.map((photo, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, transition: "opacity 1s ease",
          opacity: i === current ? 1 : 0,
        }}>
          <img src={photo.url} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
      {/* Overlay gradient */}
      <div style={{ position: "absolute", inset: 0, background: isDayTheme ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
      {/* City name */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B1A", background: "rgba(255,107,26,0.15)", padding: "3px 10px", borderRadius: 999, backdropFilter: "blur(4px)" }}>Tu itinerario</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.2, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          {city}, <span style={{ fontWeight: 400, opacity: 0.85 }}>{country}</span>
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{CAROUSEL_PHOTOS[current].caption}</p>
      </div>
      {/* Dots */}
      <div style={{ position: "absolute", bottom: 14, right: 24, display: "flex", gap: 5 }}>
        {CAROUSEL_PHOTOS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 20 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer",
            background: i === current ? "#FF6B1A" : "rgba(255,255,255,0.4)", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  data: ItineraryData;
  locale: Locale;
  onReset: () => void;
  form?: TripFormData | null;
  cityResults?: ItineraryData[];
  onRetryCity?: (cityIndex: number) => Promise<void>;
}

// ── NIGHT CSS (tema oscuro QEEQ-style — MISMO LAYOUT QUE DÍA) ───────────────
const NIGHT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
.iv-root { background: linear-gradient(180deg, hsl(240 45% 8%) 0%, hsl(260 35% 10%) 50%, hsl(230 40% 7%) 100%); min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: -0.01em; }
.iv-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; backdrop-filter: blur(16px); }
.iv-card-inner { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 18px; }
.iv-btn-ghost { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 6px 14px; font-size: 12px; cursor: pointer; color: rgba(255,255,255,0.7); transition: all 0.2s; }
.iv-btn-ghost:hover { background: rgba(255,107,26,0.15); border-color: #FF6B1A; color: #FF6B1A; }
.iv-link { font-size: 11px; padding: 3px 9px; border-radius: 8px; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 3px; }
.iv-tl-row { display: grid; grid-template-columns: 64px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.iv-tl-row:last-child { border-bottom: none; }
@keyframes iv-ping { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(2);opacity:0} }
@keyframes iv-fade-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.iv-animate { animation: iv-fade-in 0.3s ease forwards; }
@keyframes iv-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.iv-layout { display: flex; min-height: 100vh; }
.iv-sidebar { width: 240px; min-width: 240px; position: sticky; top: 0; height: 100vh; overflow-y: auto; background: hsl(240 45% 8%); border-right: 1px solid rgba(255,255,255,0.08); z-index: 10; padding: 0 0 40px; flex-shrink: 0; box-shadow: 2px 0 16px rgba(0,0,0,0.3); }
.iv-sidebar::-webkit-scrollbar { width: 3px; } .iv-sidebar::-webkit-scrollbar-track { background: transparent; } .iv-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
.iv-main { flex: 1; min-width: 0; padding: 0 0 80px; background: transparent; }
.iv-nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 20px; border: none; background: transparent; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 13.5px; font-weight: 500; transition: all 0.15s; text-align: left; white-space: nowrap; border-radius: 0; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; }
.iv-nav-btn:hover { background: rgba(255,107,26,0.1); color: rgba(255,255,255,0.95); }
.iv-nav-btn.active { background: rgba(255,107,26,0.15); color: #FF6B1A; font-weight: 600; border-left: 3px solid #FF6B1A; padding-left: 17px; }
.iv-tabs-scroll { display: flex; gap: 6px; overflow-x: auto; padding: 12px 24px; scrollbar-width: thin; border-bottom: 1px solid rgba(255,255,255,0.08); background: hsl(240 45% 10%); }
.iv-tabs-scroll::-webkit-scrollbar { height: 4px; } .iv-tabs-scroll::-webkit-scrollbar-track { background: transparent; } .iv-tabs-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
.iv-day-item { display: flex; flex-direction: column; margin: 24px 24px 0; border-radius: 0; overflow: visible; background: transparent; border: none; transition: none; width: auto; }
.iv-day-item:hover { box-shadow: none; border-color: transparent; }
.iv-day-header-night { display: flex; align-items: flex-start; gap: 16px; padding: 24px; background: rgba(255,255,255,0.04); border-radius: 16px; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
.iv-day-num-badge-night { width: 40px; height: 40px; border-radius: 10px; background: #FF6B1A; color: #fff; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify: center; flex-shrink: 0; }
.iv-day-photo { width: 100%; height: 0; position: relative; overflow: hidden; display: none; }
.iv-day-body { padding: 0; }
.iv-items-wrap { padding: 0; }
.iv-events-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 24px; }
.iv-activity-row-night { display: flex; gap: 0; padding: 0; margin: 8px 0; background: rgba(255,255,255,0.04); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: box-shadow 0.2s, transform 0.2s; }
.iv-activity-row-night:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.3); transform: translateY(-1px); }
.iv-activity-thumb-night { width: 160px; min-width: 160px; height: 130px; overflow: hidden; border-radius: 0; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.iv-activity-content-night { padding: 14px 18px; flex: 1; min-width: 0; }
.iv-activity-time-tag-night { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.iv-activity-title-night { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 6px; line-height: 1.3; letter-spacing: -0.02em; }
.iv-activity-desc-night { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; margin: 0; }
.iv-tip-box-blue-night { background: rgba(52,152,219,0.12); border-left: 3px solid #3498DB; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: rgba(130,200,255,0.9); line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; }
.iv-tip-box-amber-night { background: rgba(245,158,11,0.12); border-left: 3px solid #F59E0B; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: rgba(255,200,100,0.9); line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; }
.iv-cta-btn-night { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 12px; padding: 10px 16px; background: #FF6B1A; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; }
.iv-cta-btn-night:hover { background: #E55A0F; }
.iv-timeline-line { width: 1px; background: rgba(255,255,255,0.1); margin: 0 24px; position: relative; }
.iv-timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: #FF6B1A; border: 3px solid hsl(240 45% 10%); box-shadow: 0 0 0 2px #FF6B1A; position: absolute; left: 50%; transform: translateX(-50%); top: 0; }
.iv-event-card-night { background: rgba(255,255,255,0.04); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 2px 12px rgba(0,0,0,0.2); transition: box-shadow 0.2s, transform 0.2s; }
.iv-event-card-night:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.35); transform: translateY(-2px); }
.iv-event-img-night { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; }
.iv-event-body-night { padding: 16px; }
.iv-cat-badge-night { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; }
.iv-rest-card-night { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: box-shadow 0.2s; }
.iv-rest-card-night:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
.iv-hotel-card-night { background: rgba(255,255,255,0.04); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 2px 12px rgba(0,0,0,0.2); transition: box-shadow 0.2s; }
.iv-hotel-card-night:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.iv-section-title-night { font-size: 21px; font-weight: 700; color: #fff; margin: 0 0 4px; letter-spacing: -0.03em; }
.iv-section-sub-night { font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 20px; font-weight: 400; }
@media (max-width: 900px) { .iv-events-grid { grid-template-columns: 1fr; } .iv-activity-thumb-night { width: 100px; min-width: 100px; } }
@media (max-width: 700px) { .iv-sidebar { display: none; } .iv-main { padding: 0 0 60px; } .iv-events-grid { grid-template-columns: 1fr; padding: 12px; } .iv-activity-row-night { margin: 8px 12px; } .iv-day-item { margin: 16px 12px 0; } }
`;

// ── DAY CSS (tema diurno QEEQ-inspired) ──────────────────────────────────────
const DAY_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
.iv-root { background: #F5F4F0; min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: -0.01em; }
.iv-card { background: #fff; border: 1px solid #E8E7E3; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.iv-card-inner { background: #F9F8F5; border: 1px solid #EEEDE9; border-radius: 12px; padding: 16px 18px; }
.iv-btn-ghost { background: #fff; border: 1px solid #D1D0CC; border-radius: 8px; padding: 6px 14px; font-size: 12px; cursor: pointer; color: #555; transition: all 0.2s; }
.iv-btn-ghost:hover { background: #FFF4EF; border-color: #FF6B1A; color: #FF6B1A; }
.iv-link { font-size: 11px; padding: 3px 9px; border-radius: 8px; text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 3px; }
.iv-tl-row { display: grid; grid-template-columns: 64px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid #F0EFE9; }
.iv-tl-row:last-child { border-bottom: none; }
@keyframes iv-ping { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(2);opacity:0} }
@keyframes iv-fade-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.iv-animate { animation: iv-fade-in 0.3s ease forwards; }
@keyframes iv-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.iv-layout { display: flex; min-height: 100vh; }
.iv-sidebar { width: 240px; min-width: 240px; position: sticky; top: 0; height: 100vh; overflow-y: auto; background: #FFFFFF; border-right: 1px solid #E8E7E3; z-index: 10; padding: 0 0 40px; flex-shrink: 0; box-shadow: 2px 0 8px rgba(0,0,0,0.04); }
.iv-sidebar::-webkit-scrollbar { width: 3px; } .iv-sidebar::-webkit-scrollbar-track { background: transparent; } .iv-sidebar::-webkit-scrollbar-thumb { background: #D1D0CC; border-radius: 4px; }
.iv-main { flex: 1; min-width: 0; padding: 0 0 80px; background: #F4F3EF; }
.iv-nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 20px; border: none; background: transparent; color: #666; cursor: pointer; font-size: 13.5px; font-weight: 500; transition: all 0.15s; text-align: left; white-space: nowrap; border-radius: 0; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; }
.iv-nav-btn:hover { background: #FFF4EF; color: #FF6B1A; }
.iv-nav-btn.active { background: #FFF4EF; color: #FF6B1A; font-weight: 600; border-left: 3px solid #FF6B1A; padding-left: 17px; }
.iv-tabs-scroll { display: flex; gap: 6px; overflow-x: auto; padding: 12px 24px; scrollbar-width: thin; border-bottom: 1px solid #E8E7E3; background: #fff; }
.iv-tabs-scroll::-webkit-scrollbar { height: 4px; } .iv-tabs-scroll::-webkit-scrollbar-track { background: transparent; } .iv-tabs-scroll::-webkit-scrollbar-thumb { background: #D1D0CC; border-radius: 4px; }
.iv-day-item { display: flex; flex-direction: column; margin: 24px 24px 0; border-radius: 0; overflow: visible; background: transparent; border: none; transition: none; width: auto; }
.iv-day-item:hover { box-shadow: none; border-color: transparent; }
.iv-day-header-qeeq { display: flex; align-items: flex-start; gap: 16px; padding: 24px; background: #fff; border-radius: 16px; margin-bottom: 4px; border: 1px solid #E8E7E3; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
.iv-day-num-badge { width: 40px; height: 40px; border-radius: 10px; background: #FF6B1A; color: #fff; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.iv-day-photo { width: 100%; height: 0; position: relative; overflow: hidden; display: none; }
.iv-day-body { padding: 0; }
.iv-items-wrap { padding: 0; }
.iv-events-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 24px; }
.iv-activity-row-qeeq { display: flex; gap: 0; padding: 0; margin: 8px 24px; background: #fff; border-radius: 12px; border: 1px solid #E8E7E3; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: box-shadow 0.2s, transform 0.2s; }
.iv-activity-row-qeeq:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); transform: translateY(-1px); }
.iv-activity-thumb { width: 160px; min-width: 160px; height: 130px; overflow: hidden; border-radius: 0; background: #F0EFE9; flex-shrink: 0; }
.iv-activity-content { padding: 14px 18px; flex: 1; min-width: 0; }
.iv-activity-time-tag { font-size: 11px; color: #888; font-weight: 500; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.iv-activity-title { font-size: 15px; font-weight: 700; color: #18181B; margin: 0 0 6px; line-height: 1.3; letter-spacing: -0.02em; }
.iv-activity-desc { font-size: 13px; color: #52525B; line-height: 1.6; margin: 0; }
.iv-tip-box-blue { background: #EBF5FB; border-left: 3px solid #3498DB; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: #1A5276; line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; }
.iv-tip-box-amber { background: #FFFBEB; border-left: 3px solid #F59E0B; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: #78350F; line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; }
.iv-cta-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 12px; padding: 10px 16px; background: #FF6B1A; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; }
.iv-cta-btn:hover { background: #E55A0F; }
.iv-timeline-line { width: 1px; background: #E0DED8; margin: 0 24px; position: relative; }
.iv-timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: #FF6B1A; border: 3px solid #fff; box-shadow: 0 0 0 2px #FF6B1A; position: absolute; left: 50%; transform: translateX(-50%); top: 0; }
.iv-event-card-day { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #E8E7E3; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.2s, transform 0.2s; }
.iv-event-card-day:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
.iv-event-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; }
.iv-event-body { padding: 16px; }
.iv-cat-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; }
.iv-rest-card { background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #E8E7E3; box-shadow: 0 1px 4px rgba(0,0,0,0.05); transition: box-shadow 0.2s; }
.iv-rest-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
.iv-hotel-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #E8E7E3; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.iv-hotel-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
.iv-section-title { font-size: 21px; font-weight: 700; color: #18181B; margin: 0 0 4px; letter-spacing: -0.03em; }
.iv-section-sub { font-size: 14px; color: #71717A; margin: 0 0 20px; font-weight: 400; }
@media (max-width: 900px) { .iv-events-grid { grid-template-columns: 1fr; } .iv-activity-thumb { width: 100px; min-width: 100px; } }
@media (max-width: 700px) { .iv-sidebar { display: none; } .iv-main { padding: 0 0 60px; } .iv-events-grid { grid-template-columns: 1fr; padding: 12px; } .iv-activity-row-qeeq { margin: 8px 12px; } .iv-day-item { margin: 16px 12px 0; } }
`;

// ── ActivityItem (night theme — QEEQ layout, dark colors) ─────────────────────
function NightActivityItem({ item, edits, onEdit, locale }: {
  item: ItineraryItem;
  edits: UserEdits;
  onEdit: (item: ItineraryItem) => void;
  locale: Locale;
}) {
  const edit = edits[item.id];
  const displayName = edit?.replacement?.name ?? edit?.name ?? item.name;
  const displayDesc = edit?.replacement?.description ?? item.description;
  const badge = BADGE[item.type] ?? { label: item.type, bg: "rgba(255,255,255,0.1)", color: "#FF6B1A", dot: "#FF6B1A" };

  return (
    <div className="iv-activity-row-night iv-animate">
      {/* Thumbnail — SmartPhoto: Wikipedia primero, Pexels garantizado */}
      <div className="iv-activity-thumb-night">
        <SmartPhoto
          query={displayName}
          fallbackUrl={PEXELS_FALLBACKS[item.type] ?? PEXELS_FALLBACKS.default}
          height={130}
          radius={0}
        />
      </div>
      {/* Content */}
      <div className="iv-activity-content-night">
        <div className="iv-activity-time-tag-night">
          <span style={{ background: badge.bg, color: badge.color, padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{badge.label}</span>
          <span>{item.time}{item.duration && <> · {item.duration}</>}</span>
        </div>
        <h4 className="iv-activity-title-night">{displayName}</h4>
        <p className="iv-activity-desc-night">{displayDesc}</p>
        {edit?.note && (
          <div className="iv-tip-box-amber-night">
            <span>📝</span>
            <span>{edit.note}</span>
          </div>
        )}
        {item.tip && (
          <div className={item.type === "food" ? "iv-tip-box-amber-night" : "iv-tip-box-blue-night"}>
            <span>{item.type === "food" ? "🍴" : "💡"}</span>
            <span>{item.tip}</span>
          </div>
        )}
        {item.bookingUrl && (
          <a href={item.bookingUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn-night">
            <span>🎫 {locale === "es" ? "Reservar experiencia" : "Book experience"}</span>
            <span>→</span>
          </a>
        )}
        {item.viatorUrl && !item.bookingUrl && (
          <a href={item.viatorUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn-night">
            <span>🎫 {locale === "es" ? "Ver en Viator" : "View on Viator"}</span>
            <span>→</span>
          </a>
        )}
        {/* Edit button */}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A", fontSize: 12, padding: 0, textDecoration: "underline" }}>
            ✏️ {locale === "es" ? "Editar" : "Edit"}
          </button>
          {item.links?.googleMaps && (
            <a href={item.links.googleMaps} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, color: "#3498DB", fontSize: 12, textDecoration: "none" }}>📍 Maps</a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ActivityItem (day theme) ──────────────────────────────────────────────────
function DayActivityItem({ item, edits, onEdit, locale }: {
  item: ItineraryItem;
  edits: UserEdits;
  onEdit: (item: ItineraryItem) => void;
  locale: Locale;
}) {
  const edit = edits[item.id];
  const displayName = edit?.replacement?.name ?? edit?.name ?? item.name;
  const displayDesc = edit?.replacement?.description ?? item.description;
  const badge = BADGE_DAY[item.type] ?? { label: item.type, bg: "#FFF3E0", color: "#E65100" };

  return (
    <div className="iv-activity-row-qeeq iv-animate">
      {/* Thumbnail — SmartPhoto: Wikipedia primero, Pexels garantizado */}
      <div className="iv-activity-thumb">
        <SmartPhoto
          query={displayName}
          fallbackUrl={PEXELS_FALLBACKS[item.type] ?? PEXELS_FALLBACKS.default}
          height={130}
          radius={0}
        />
      </div>
      {/* Content */}
      <div className="iv-activity-content">
        <div className="iv-activity-time-tag">
          <span style={{ background: badge.bg, color: badge.color, padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{badge.label}</span>
          <span>{item.time}{item.duration && <> · {item.duration}</>}</span>
        </div>
        <h4 className="iv-activity-title">{displayName}</h4>
        <p className="iv-activity-desc">{displayDesc}</p>
        {edit?.note && (
          <div className="iv-tip-box-amber">
            <span>📝</span>
            <span>{edit.note}</span>
          </div>
        )}
        {item.tip && (
          <div className={item.type === "food" ? "iv-tip-box-amber" : "iv-tip-box-blue"}>
            <span>{item.type === "food" ? "🍴" : "💡"}</span>
            <span>{item.tip}</span>
          </div>
        )}
        {item.bookingUrl && (
          <a href={item.bookingUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn">
            <span>🎫 {locale === "es" ? "Reservar experiencia" : "Book experience"}</span>
            <span>→</span>
          </a>
        )}
        {item.viatorUrl && !item.bookingUrl && (
          <a href={item.viatorUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn">
            <span>🎫 {locale === "es" ? "Ver en Viator" : "View on Viator"}</span>
            <span>→</span>
          </a>
        )}
        {/* Edit button */}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A", fontSize: 12, padding: 0, textDecoration: "underline" }}>
            ✏️ {locale === "es" ? "Editar" : "Edit"}
          </button>
          {item.links?.googleMaps && (
            <a href={item.links.googleMaps} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, color: "#3498DB", fontSize: 12, textDecoration: "none" }}>📍 Maps</a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DayCard (day theme — QEEQ timeline style) ─────────────────────────────────
function DayCardDay({ day, isOpen, onToggle, edits, onEdit, locale }: {
  day: ItineraryDay; isOpen: boolean; onToggle: () => void;
  edits: UserEdits; onEdit: (item: ItineraryItem) => void; locale: Locale;
}) {
  const difficultyLabel = (day.items?.length ?? 0) > 5 ? "Intenso" : (day.items?.length ?? 0) > 3 ? "Moderado" : "Tranquilo";
  const difficultyColor = (day.items?.length ?? 0) > 5 ? "#FEE2E2" : (day.items?.length ?? 0) > 3 ? "#FEF3C7" : "#D1FAE5";
  const difficultyText = (day.items?.length ?? 0) > 5 ? "#DC2626" : (day.items?.length ?? 0) > 3 ? "#D97706" : "#059669";

  return (
    <div className="iv-day-item">
      {/* QEEQ-style day header */}
      <div className="iv-day-header-qeeq" style={{ cursor: "pointer" }} onClick={onToggle}>
        <div className="iv-day-num-badge">{day.dayNum}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}>
            {locale === "es" ? "Día" : "Day"} {day.dayNum} · {day.theme}
          </h3>
          {day.zone && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>
              📍 {day.zone}
              {day.date && <span style={{ marginLeft: 8, color: "#aaa" }}>· {day.date}</span>}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ background: difficultyColor, color: difficultyText, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
            {difficultyLabel}
          </span>
          <span style={{ color: "#aaa", fontSize: 18, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
        </div>
      </div>
      {/* Activities timeline */}
      {isOpen && (
        <div className="iv-day-body">
          <div className="iv-items-wrap">
            {day.items?.map((item, ii) => (
              <DayActivityItem key={`${day.dayNum}-${ii}`} item={item} edits={edits} onEdit={onEdit} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DayCard (night theme — QEEQ layout, dark colors) ───────────────────────────
function DayCardNight({ day, isOpen, onToggle, edits, onEdit, locale }: {
  day: ItineraryDay; isOpen: boolean; onToggle: () => void;
  edits: UserEdits; onEdit: (item: ItineraryItem) => void; locale: Locale;
}) {
  const difficultyLabel = (day.items?.length ?? 0) > 5 ? (locale === "es" ? "Intenso" : "Intense") : (day.items?.length ?? 0) > 3 ? (locale === "es" ? "Moderado" : "Moderate") : (locale === "es" ? "Tranquilo" : "Relaxed");
  const difficultyColor = (day.items?.length ?? 0) > 5 ? "rgba(220,38,38,0.2)" : (day.items?.length ?? 0) > 3 ? "rgba(217,119,6,0.2)" : "rgba(5,150,105,0.2)";
  const difficultyText = (day.items?.length ?? 0) > 5 ? "#F87171" : (day.items?.length ?? 0) > 3 ? "#FBBF24" : "#34D399";

  return (
    <div className="iv-day-item">
      {/* QEEQ-style day header (night version) */}
      <div className="iv-day-header-night" style={{ cursor: "pointer" }} onClick={onToggle}>
        <div className="iv-day-num-badge-night">{day.dayNum}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            {locale === "es" ? "Día" : "Day"} {day.dayNum} · {day.theme}
          </h3>
          {day.zone && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              📍 {day.zone}
              {day.date && <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.35)" }}>· {day.date}</span>}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ background: difficultyColor, color: difficultyText, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
            {difficultyLabel}
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
        </div>
      </div>
      {/* Activities timeline */}
      {isOpen && (
        <div className="iv-day-body">
          <div className="iv-items-wrap">
            {day.items?.map((item, ii) => (
              <NightActivityItem key={`${day.dayNum}-${ii}`} item={item} edits={edits} onEdit={onEdit} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── RestaurantsList (mismo layout QEEQ día/noche) ───────────────────────────
function RestaurantsList({ restaurants, locale, isDayTheme }: { restaurants: Restaurant[]; locale: Locale; isDayTheme: boolean }) {
  if (!restaurants?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "No hay restaurantes disponibles" : "No restaurants available"}
    </div>
  );
  return (
    <div>
      {/* Section header (coincidente con diseño QEEQ) */}
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Restaurantes recomendados" : "Recommended restaurants"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Donde comer en tu destino" : "Where to eat at your destination"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {restaurants.map((r, i) => (
          <div key={i} className={isDayTheme ? "iv-rest-card" : "iv-rest-card-night"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: isDayTheme ? "#1A1A1A" : "#fff", lineHeight: 1.3 }}>{r.name}</div>
              <span style={{ background: isDayTheme ? "#FFF3E0" : "rgba(255,107,26,0.2)", color: isDayTheme ? "#E65100" : "#FF6B1A", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999, flexShrink: 0, marginLeft: 8 }}>{r.priceRange}</span>
            </div>
            <div style={{ fontSize: 12, color: isDayTheme ? "#888" : "rgba(255,255,255,0.45)", marginBottom: 6 }}>{r.type} · {r.zone}</div>
            <div style={{ fontSize: 13, color: isDayTheme ? "#52525B" : "rgba(255,255,255,0.65)", lineHeight: 1.55, marginBottom: 10 }}>{r.specialty}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: isDayTheme ? "1px solid #F0EFE9" : "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#F59E0B", fontSize: 13 }}>★ {r.rating}</span>
              {r.bookingUrl && <a href={r.bookingUrl} target="_blank" rel="noopener noreferrer" className={isDayTheme ? "iv-cta-btn" : "iv-cta-btn-night"} style={{ marginTop: 0, padding: "6px 12px", fontSize: 12, width: "auto", display: "inline-flex" }}>🍽 {locale === "es" ? "Reservar" : "Book"}</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EventsList (day theme = QEEQ 2-col grid, night = dark cards) ──────────────
function EventsList({ events, locale, isDayTheme }: { events: Event[]; locale: Locale; isDayTheme: boolean }) {
  if (!events?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "No hay eventos disponibles" : "No events available"}
    </div>
  );

  if (isDayTheme) {
    const typeLabels: Record<string, string> = {
      festival: "Festival", concert: "Concierto", permanent: "Atracción", sport: "Deporte", market: "Mercado", cinema: "Cine",
    };
    return (
      <div>
        <div style={{ padding: "24px 24px 0" }}>
          <h2 className="iv-section-title">Eventos y actividades</h2>
          <p className="iv-section-sub">{locale === "es" ? "Actividades destacadas en tu destino" : "Featured activities at your destination"}</p>
        </div>
        <div className="iv-events-grid">
          {events.map((ev, i) => (
            <div key={i} className="iv-event-card-day">
              {/* SmartPhoto: foto buscada por lugar/nombre, Pexels garantizado */}
              <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                <SmartPhoto
                  query={ev.venue ?? ev.name}
                  fallbackUrl={PEXELS_FALLBACKS[ev.type] ?? PEXELS_FALLBACKS.permanent}
                  height={200}
                  radius={0}
                />
                <span className="iv-cat-badge" style={{ position: "absolute", bottom: 10, left: 10, background: "#FF6B1A", color: "#fff", zIndex: 2 }}>
                  {typeLabels[ev.type] ?? ev.type}
                </span>
              </div>
              <div className="iv-event-body">
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#18181B", lineHeight: 1.3, letterSpacing: "-0.02em" }}>{ev.name}</h3>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#52525B", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0EFE9" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>📅 {ev.when}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B1A" }}>{ev.price}</span>
                </div>
                {ev.ticketUrl && (
                  <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn" style={{ marginTop: 10 }}>
                    <span>🎫 {locale === "es" ? "Comprar entradas" : "Buy tickets"}</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Night theme — MISMO LAYOUT QEEQ con colores oscuros
  const typeLabels: Record<string, string> = {
    festival: "Festival", concert: "Concierto", permanent: "Atracción", sport: "Deporte", market: "Mercado", cinema: "Cine",
  };
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className="iv-section-title-night">Eventos y actividades</h2>
        <p className="iv-section-sub-night">{locale === "es" ? "Actividades destacadas en tu destino" : "Featured activities at your destination"}</p>
      </div>
      <div className="iv-events-grid">
        {events.map((ev, i) => (
          <div key={i} className="iv-event-card-night">
            {/* SmartPhoto for night mode events */}
            <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
              <SmartPhoto
                query={ev.venue ?? ev.name}
                fallbackUrl={PEXELS_FALLBACKS[ev.type] ?? PEXELS_FALLBACKS.permanent}
                height={200}
                radius={0}
              />
              <span className="iv-cat-badge-night" style={{ position: "absolute", bottom: 10, left: 10, background: "#FF6B1A", color: "#fff", zIndex: 2 }}>
                {typeLabels[ev.type] ?? ev.type}
              </span>
            </div>
            <div className="iv-event-body-night">
              <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.02em" }}>{ev.name}</h3>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>📅 {ev.when}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B1A" }}>{ev.price}</span>
              </div>
              {ev.ticketUrl && (
                <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="iv-cta-btn-night" style={{ marginTop: 10 }}>
                  <span>🎫 {locale === "es" ? "Comprar entradas" : "Buy tickets"}</span>
                  <span>→</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HotelsList (mismo layout QEEQ día/noche) ───────────────────────────────────
function HotelsList({ hotels, locale, isDayTheme }: { hotels: Hotel[]; locale: Locale; isDayTheme: boolean }) {
  if (!hotels?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "No hay hoteles disponibles" : "No hotels available"}
    </div>
  );
  return (
    <div>
      {/* Section header */}
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Hoteles recomendados" : "Recommended hotels"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Alojamiento en tu destino" : "Accommodation at your destination"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {hotels.map((h, i) => {
          const platform = h.platform ?? "Booking.com";
          const pc = HOTEL_COLORS[platform] ?? { accent: "#0071c2", label: "Booking" };
          return (
            <div key={i} className={isDayTheme ? "iv-hotel-card" : "iv-hotel-card-night"}>
              {h.photoUrl && (
                <img src={h.photoUrl} alt={h.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: isDayTheme ? "#18181B" : "#fff", lineHeight: 1.3 }}>{h.name}</div>
                  <span style={{ color: "#F59E0B", fontSize: 13, flexShrink: 0, marginLeft: 8 }}>{"★".repeat(h.stars)}</span>
                </div>
                <div style={{ fontSize: 12, color: isDayTheme ? "#71717A" : "rgba(255,255,255,0.45)", marginBottom: 8 }}>{h.address}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ background: isDayTheme ? "#EBF5FB" : "rgba(52,152,219,0.15)", color: isDayTheme ? "#1A5276" : "rgba(130,200,255,0.85)", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                    {h.reviewScore}/10 ({h.reviewCount})
                  </span>
                  <span style={{ color: "#FF6B1A", fontWeight: 700, fontSize: 14 }}>{h.pricePerNight} {h.currency}/noche</span>
                </div>
                {h.url && (
                  <a href={h.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", marginTop: 12, padding: "10px 16px", background: pc.accent, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                    Ver en {pc.label}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SecurityTab (mismo layout QEEQ día/noche) ───────────────────────────────────
function SecurityTab({ alerts, locale, isDayTheme }: { alerts: SecurityAlert[]; locale: Locale; isDayTheme: boolean }) {
  if (!alerts?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "Sin alertas de seguridad" : "No security alerts"}
    </div>
  );
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Alertas de seguridad" : "Security alerts"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Información importante para tu viaje" : "Important information for your trip"}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px 24px" }}>
        {alerts.map((a, i) => {
          const rk = (a.level ?? "bajo") as keyof typeof RISK;
          const r = RISK[rk] ?? RISK.bajo;
          return (
            <div key={i} style={{ background: isDayTheme ? "#fff" : "rgba(255,255,255,0.04)", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: 16, borderLeft: `4px solid ${r.bar}`, boxShadow: isDayTheme ? "0 1px 4px rgba(0,0,0,0.05)" : "0 2px 8px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: r.badge.bg, color: r.badge.color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{a.level?.toUpperCase()}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: isDayTheme ? "#18181B" : "#fff" }}>{a.zone}</span>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: isDayTheme ? "#52525B" : "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a.description}</p>
              {a.tip && <p style={{ margin: 0, fontSize: 12, color: isDayTheme ? "#3498DB" : "rgba(130,200,255,0.8)", fontStyle: "italic" }}>💡 {a.tip}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PreparationTab (mismo layout QEEQ día/noche) ────────────────────────────────
function PreparationTab({ items, locale, isDayTheme }: { items?: PrepItem[]; locale: Locale; isDayTheme: boolean }) {
  if (!items?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "Sin datos de preparación" : "No preparation data"}
    </div>
  );
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Preparación del viaje" : "Trip preparation"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Qué necesitas antes de viajar" : "What you need before traveling"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, padding: "0 24px 24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: isDayTheme ? "#fff" : "rgba(255,255,255,0.04)", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: 16, boxShadow: isDayTheme ? "0 1px 4px rgba(0,0,0,0.05)" : "0 2px 8px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: isDayTheme ? "#18181B" : "#fff", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: isDayTheme ? "#52525B" : "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GastronomyTab ─────────────────────────────────────────────────────────────
function GastronomyTab({ items, locale, isDayTheme }: { items?: GastronomyItem[]; locale: Locale; isDayTheme: boolean }) {
  if (!items?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "Sin datos de gastronomía" : "No gastronomy data"}
    </div>
  );

  if (isDayTheme) {
    return (
      <div>
        <div style={{ padding: "24px 24px 0" }}>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
            {locale === "es" ? "Gastronomía local" : "Local gastronomy"}
          </h2>
          <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>
            {locale === "es" ? "Platos imprescindibles de tu destino" : "Must-try dishes at your destination"}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            >
              {/* SmartPhoto: foto del plato, Pexels garantizado si no encuentra */}
              <div style={{ width: "100%", overflow: "hidden", position: "relative" }}>
                <SmartPhoto
                  query={item.city ? `${item.name} ${item.city}` : item.name}
                  fallbackUrl={PEXELS_FALLBACKS.gastronomy}
                  height={170}
                  radius={0}
                />
                {item.mustTry && (
                  <span style={{ position: "absolute", top: 10, right: 10, background: "#FF6B1A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 999, letterSpacing: "0.04em", zIndex: 2 }}>
                    MUST TRY
                  </span>
                )}
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#18181B", marginBottom: 6, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#52525B", lineHeight: 1.55, marginBottom: item.priceRange ? 10 : 0 }}>{item.description}</div>
                {item.priceRange && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0EFE9" }}>
                    <span style={{ fontSize: 12, color: "#71717A" }}>{item.city ?? ""}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B1A" }}>{item.priceRange}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Night theme — MISMO LAYOUT QEEQ con colores oscuros
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className="iv-section-title-night">{locale === "es" ? "Gastronomía local" : "Local gastronomy"}</h2>
        <p className="iv-section-sub-night">{locale === "es" ? "Platos imprescindibles de tu destino" : "Must-try dishes at your destination"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.2)", transition: "box-shadow 0.2s, transform 0.2s" }}
            onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
          >
            {/* SmartPhoto: foto del plato */}
            <div style={{ width: "100%", overflow: "hidden", position: "relative" }}>
              <SmartPhoto
                query={item.city ? `${item.name} ${item.city}` : item.name}
                fallbackUrl={PEXELS_FALLBACKS.gastronomy}
                height={170}
                radius={0}
              />
              {item.mustTry && (
                <span style={{ position: "absolute", top: 10, right: 10, background: "#FF6B1A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 999, letterSpacing: "0.04em", zIndex: 2 }}>
                  MUST TRY
                </span>
              )}
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{item.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, marginBottom: item.priceRange ? 10 : 0 }}>{item.description}</div>
              {item.priceRange && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item.city ?? ""}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B1A" }}>{item.priceRange}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TipsTab (mismo layout QEEQ día/noche) ───────────────────────────────────────
function TipsTab({ items, locale, isDayTheme }: { items?: TipItem[]; locale: Locale; isDayTheme: boolean }) {
  if (!items?.length) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "Sin consejos disponibles" : "No tips available"}
    </div>
  );
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Consejos de viaje" : "Travel tips"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Recomendaciones para tu viaje" : "Recommendations for your trip"}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px 24px" }}>
        {items.map((tip, i) => (
          <div key={i} style={{ background: isDayTheme ? "#fff" : "rgba(255,255,255,0.04)", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: 16, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: isDayTheme ? "0 1px 6px rgba(0,0,0,0.05)" : "0 2px 8px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: isDayTheme ? "#18181B" : "#fff", marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13, color: isDayTheme ? "#52525B" : "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BudgetTab (mismo layout QEEQ día/noche) ───────────────────────────────────
function BudgetTab({ budget, locale, isDayTheme }: { budget?: BudgetBreakdown; locale: Locale; isDayTheme: boolean }) {
  if (!budget) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>
      {locale === "es" ? "Sin datos de presupuesto" : "No budget data"}
    </div>
  );
  const rows = [
    { label: locale === "es" ? "Alojamiento" : "Accommodation", value: budget.accommodation, icon: "🏨" },
    { label: locale === "es" ? "Transporte" : "Transport",      value: budget.transport,      icon: "✈️" },
    { label: locale === "es" ? "Alimentación" : "Food",         value: budget.food,           icon: "🍽️" },
    { label: locale === "es" ? "Actividades" : "Activities",    value: budget.activities,     icon: "🎭" },
  ];
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 className={isDayTheme ? "iv-section-title" : "iv-section-title-night"}>{locale === "es" ? "Presupuesto estimado" : "Estimated budget"}</h2>
        <p className={isDayTheme ? "iv-section-sub" : "iv-section-sub-night"}>{locale === "es" ? "Desglose de costos de tu viaje" : "Breakdown of your trip costs"}</p>
      </div>
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ background: isDayTheme ? "#fff" : "rgba(255,255,255,0.04)", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: isDayTheme ? "0 1px 4px rgba(0,0,0,0.04)" : "0 2px 8px rgba(0,0,0,0.15)" }}>
              <span style={{ fontSize: 13, color: isDayTheme ? "#52525B" : "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", gap: 8 }}>{r.icon} {r.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: isDayTheme ? "#18181B" : "#fff" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: isDayTheme ? "#FFF3E0" : "rgba(255,107,26,0.15)", border: `1px solid ${isDayTheme ? "#FDBA74" : "rgba(255,107,26,0.3)"}`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#FF6B1A" }}>{locale === "es" ? "TOTAL" : "TOTAL"}</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#FF6B1A" }}>{budget.total}</span>
        </div>
        {budget.notes && <p style={{ marginTop: 12, fontSize: 13, color: isDayTheme ? "#71717A" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{budget.notes}</p>}
      </div>
    </div>
  );
}

// ── MultiCityPanel ────────────────────────────────────────────────────────────
function MultiCityPanel({ cities, renderContent, isDayTheme }: {
  cities: ItineraryData[];
  renderContent: (city: ItineraryData, idx: number) => React.ReactNode;
  isDayTheme: boolean;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const cityAccents = ["#FF6B1A", "#3498DB", "#2ECC71", "#9B59B6", "#E74C3C", "#1ABC9C"];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: isDayTheme ? "16px 24px" : "0 0 16px", flexWrap: "wrap" }}>
        {cities.map((c, i) => (
          <button key={i} onClick={() => setSelectedIdx(i)} style={{
            padding: "8px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s",
            background: selectedIdx === i ? cityAccents[i % cityAccents.length] : isDayTheme ? "#F0EFE9" : "rgba(255,255,255,0.07)",
            color: selectedIdx === i ? "#fff" : isDayTheme ? "#555" : "rgba(255,255,255,0.6)",
          }}>{c.city}</button>
        ))}
      </div>
      {renderContent(cities[selectedIdx], selectedIdx)}
    </div>
  );
}

// ── RetryButton ───────────────────────────────────────────────────────────────
function RetryButton({ city, onRetry, locale, isDayTheme }: {
  city: string; onRetry: () => Promise<void>; locale: Locale; isDayTheme: boolean;
}) {
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    await onRetry();
    setLoading(false);
  }
  return (
    <button onClick={handle} disabled={loading} style={{
      padding: "6px 16px", borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600,
      background: isDayTheme ? "#FF6B1A" : "rgba(255,120,30,0.15)", color: isDayTheme ? "#fff" : "hsl(22 95% 65%)", opacity: loading ? 0.6 : 1,
    }}>
      {loading ? "..." : `${locale === "es" ? "Reintentar" : "Retry"} ${city}`}
    </button>
  );
}

// ── Sidebar nav item icons ────────────────────────────────────────────────────
const NAV_ICONS: Record<string, string> = {
  days: "📅", restaurants: "🍽️", events: "🎭", hotels: "🏨",
  extras: "✈️", security: "🛡️", preparation: "🎒", gastronomy: "🍜", tips: "💡", budget: "💰",
};
const NAV_LABELS_ES: Record<string, string> = {
  days: "Itinerario", restaurants: "Restaurantes", events: "Actividades", hotels: "Hoteles",
  extras: "Vuelos · Tours", security: "Seguridad", preparation: "Preparación", gastronomy: "Gastronomía", tips: "Consejos", budget: "Presupuesto",
};
const NAV_LABELS_EN: Record<string, string> = {
  days: "Itinerary", restaurants: "Restaurants", events: "Activities", hotels: "Hotels",
  extras: "Flights · Tours", security: "Safety", preparation: "Preparation", gastronomy: "Gastronomy", tips: "Tips", budget: "Budget",
};

// ═════════════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════
export default function ItineraryView({ data, locale, onReset, form, cityResults = [], onRetryCity }: Props) {
  const [isDayTheme, setIsDayTheme] = useState(true); // Day theme by default
  const [tab, setTab] = useState<"days"|"restaurants"|"events"|"hotels"|"extras"|"security"|"preparation"|"gastronomy"|"tips"|"budget">("days");
  const totalDays = (data.days ?? []).length;
  const allIndices = React.useMemo(() => new Set(Array.from({ length: totalDays }, (_, i) => i)), [totalDays]);
  const [openDays, setOpenDays] = useState<Set<number>>(allIndices);
  const allOpen = openDays.size === totalDays;

  React.useEffect(() => {
    setOpenDays(new Set(Array.from({ length: totalDays }, (_, i) => i)));
  }, [totalDays]);

  const [edits, setEdits] = useState<UserEdits>({});
  const [editModal, setEditModal] = useState<ItineraryItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editAltIdx, setEditAltIdx] = useState(-1);

  function toggleDay(i: number) {
    setOpenDays(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  }
  function toggleAllDays() {
    setOpenDays(allOpen ? new Set() : new Set(Array.from({ length: totalDays }, (_, i) => i)));
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
    { key: "days",        icon: "📅", label: locale === "es" ? "Días"        : "Days"        },
    { key: "restaurants", icon: "🍽️", label: locale === "es" ? "Restaurantes": "Restaurants" },
    { key: "events",      icon: "🎭", label: locale === "es" ? "Eventos"     : "Events"      },
    { key: "hotels",      icon: "🏨", label: "Hotels"                                         },
    { key: "extras",      icon: "✈️", label: "Vuelos · Tours"                                 },
    { key: "security",    icon: "🛡️", label: locale === "es" ? "Seguridad"   : "Safety"      },
    { key: "preparation", icon: "🎒", label: locale === "es" ? "Preparación" : "Preparation" },
    { key: "gastronomy",  icon: "🍜", label: locale === "es" ? "Gastronomía" : "Gastronomy"  },
    { key: "tips",        icon: "💡", label: locale === "es" ? "Consejos"    : "Tips"        },
    { key: "budget",      icon: "💰", label: locale === "es" ? "Presupuesto" : "Budget"      },
  ];

  const currentCSS = isDayTheme ? DAY_CSS : NIGHT_CSS;
  const navLabels = locale === "es" ? NAV_LABELS_ES : NAV_LABELS_EN;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: currentCSS }} />

      <div className="iv-root" style={isDayTheme ? { background: "#F4F3EF" } : {}}>
        {/* Night theme: background orbs */}
        {!isDayTheme && (
          <>
            <div style={{ position: "fixed", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "hsl(280 60% 30% / 0.12)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "15%", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "hsl(220 70% 25% / 0.15)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
          </>
        )}

        {/* ── LAYOUT: SIDEBAR + MAIN ── */}
        <div className="iv-layout" style={{ position: "relative", zIndex: 1 }}>

          {/* ── SIDEBAR ── */}
          <aside className="iv-sidebar">
            {/* Logo / App header */}
            <div style={{ padding: isDayTheme ? "20px 20px 16px" : "20px 20px 16px", borderBottom: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.07)"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isDayTheme ? 8 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FF6B1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✈️</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDayTheme ? "#1A1A1A" : "#fff", lineHeight: 1.2 }}>Smart Travel</div>
                  <div style={{ fontSize: 11, color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)" }}>AI Itinerary</div>
                </div>
              </div>
              {isDayTheme && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{data.city}, {data.country}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    {"★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 11 }}>{s}</span>)}
                    <span style={{ fontSize: 11, color: "#888" }}>4.4 Trustpilot</span>
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.07)"}` }}>
              <button
                onClick={() => setIsDayTheme(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px",
                  borderRadius: 8, border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.15)"}`,
                  background: isDayTheme ? "#FFF3E0" : "rgba(255,255,255,0.06)", cursor: "pointer",
                  color: isDayTheme ? "#E65100" : "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                <span>{isDayTheme ? "🌙" : "☀️"}</span>
                <span>{isDayTheme ? (locale === "es" ? "Modo nocturno" : "Night mode") : (locale === "es" ? "Modo diurno" : "Day mode")}</span>
              </button>
            </div>

            {/* Navigation */}
            <nav style={{ paddingTop: 8 }}>
              {/* Itinerary day sub-items (when days tab is active) */}
              {tabs.map(tb => (
                <div key={tb.key}>
                  <button
                    className={`iv-nav-btn${tab === tb.key ? " active" : ""}`}
                    onClick={() => setTab(tb.key)}
                  >
                    <span style={{ fontSize: 15 }}>{NAV_ICONS[tb.key]}</span>
                    <span>{navLabels[tb.key]}</span>
                  </button>
                  {/* Day sub-items under Itinerary */}
                  {tb.key === "days" && tab === "days" && totalDays > 0 && (
                    <div style={{ background: isDayTheme ? "#F9F8F5" : "rgba(0,0,0,0.15)", paddingLeft: 0 }}>
                      {data.days?.map((day, di) => (
                        <button
                          key={di}
                          onClick={() => { if (!openDays.has(di)) toggleDay(di); const el = document.getElementById(`day-${di}`); el?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 20px 9px 36px",
                            border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", transition: "all 0.15s",
                            background: isDayTheme ? "transparent" : "transparent",
                            color: isDayTheme ? "#666" : "rgba(255,255,255,0.45)",
                          }}
                          onMouseOver={e => (e.currentTarget.style.background = isDayTheme ? "#FFF4EF" : "rgba(255,255,255,0.04)")}
                          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span style={{ width: 20, height: 20, borderRadius: 5, background: "#FF6B1A", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{day.dayNum}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{locale === "es" ? "Día" : "Day"} {day.dayNum}{day.date && ` · ${day.date}`}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Back to search */}
            <div style={{ padding: "16px 16px 0", marginTop: "auto", borderTop: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.07)"}` }}>
              <button onClick={onReset} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px",
                borderRadius: 8, border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.12)"}`,
                background: isDayTheme ? "#fff" : "rgba(255,255,255,0.05)", cursor: "pointer",
                color: isDayTheme ? "#555" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500,
              }}>
                ← {locale === "es" ? "Nueva búsqueda" : "New search"}
              </button>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="iv-main">
            {/* Mobile back button */}
            <div style={{ display: "none", padding: "12px 16px", background: isDayTheme ? "#fff" : "rgba(255,255,255,0.03)", borderBottom: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.06)"}` }}>
              <button onClick={onReset} className="iv-btn-ghost">← {locale === "es" ? "Volver" : "Back"}</button>
            </div>

            {/* Hero Carousel */}
            <HeroCarousel city={data.city} country={data.country} isDayTheme={isDayTheme} />

            {/* Info strip */}
            <div style={{ display: "flex", gap: 12, padding: isDayTheme ? "16px 24px" : "16px 0", flexWrap: "wrap", alignItems: "center", background: isDayTheme ? "#fff" : "transparent", borderBottom: isDayTheme ? "1px solid #E8E7E3" : "none" }}>
              {data.weather && (
                <span style={{ fontSize: 13, color: isDayTheme ? "#555" : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6, padding: isDayTheme ? "6px 12px" : "5px 12px", background: isDayTheme ? "#F4F3EF" : "rgba(255,255,255,0.05)", borderRadius: 999, border: isDayTheme ? "1px solid #E8E7E3" : "1px solid rgba(255,255,255,0.08)" }}>
                  🌤 {data.weather.maxTemp}° / {data.weather.minTemp}° · {data.weather.description}
                </span>
              )}
              {data.estimatedBudgetPerDay && (
                <span style={{ fontSize: 13, color: isDayTheme ? "#555" : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6, padding: isDayTheme ? "6px 12px" : "5px 12px", background: isDayTheme ? "#F4F3EF" : "rgba(255,255,255,0.05)", borderRadius: 999, border: isDayTheme ? "1px solid #E8E7E3" : "1px solid rgba(255,255,255,0.08)" }}>
                  💰 {data.estimatedBudgetPerDay} {t("perDayPerson", locale)}
                </span>
              )}
              {data.tagline && (
                <span style={{ fontSize: 13, color: isDayTheme ? "#888" : "rgba(255,255,255,0.4)", fontStyle: "italic" }}>{data.tagline}</span>
              )}
            </div>

            {/* Summary */}
            {data.summary && (
              <div style={{ padding: isDayTheme ? "16px 24px" : "16px 0" }}>
                <p style={{ margin: 0, fontSize: 14, color: isDayTheme ? "#555" : "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{data.summary}</p>
              </div>
            )}

            {/* ── TABS (desktop) ── */}
            <div className="iv-tabs-scroll">
              {tabs.map(tb => {
                const active = tab === tb.key;
                return (
                  <button
                    key={tb.key}
                    onClick={() => setTab(tb.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                      borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
                      whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                      background: active
                        ? isDayTheme ? "#FF6B1A" : "rgba(255,120,30,0.2)"
                        : isDayTheme ? "#F4F3EF" : "rgba(255,255,255,0.05)",
                      color: active
                        ? isDayTheme ? "#fff" : "hsl(22 95% 65%)"
                        : isDayTheme ? "#555" : "rgba(255,255,255,0.5)",
                      boxShadow: active && isDayTheme ? "0 2px 8px rgba(255,107,26,0.3)" : "none",
                    }}
                  >
                    <span>{tb.icon}</span> {tb.label}
                  </button>
                );
              })}
            </div>

            {/* ── DAYS TAB ── */}
            {tab === "days" && (
              <>
                {/* Multi-city retry warning */}
                {cityResults.length > 1 && cityResults.some(r => !r.days?.length) && (
                  <div style={{ margin: isDayTheme ? "16px 24px" : "16px 0", padding: "14px 18px", background: isDayTheme ? "#FFFBEB" : "rgba(255,200,60,0.08)", borderRadius: 12, border: `1px solid ${isDayTheme ? "#FDE68A" : "rgba(255,200,60,0.15)"}` }}>
                    <p style={{ margin: "0 0 10px", fontSize: 13, color: isDayTheme ? "#78350F" : "rgba(255,220,100,0.85)" }}>
                      ⚠️ {locale === "es" ? "Algunas ciudades no se generaron correctamente." : "Some cities did not generate correctly."}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {cityResults.map((r, i) => !r.days?.length && onRetryCity ? (
                        <RetryButton key={i} city={r.city} onRetry={() => onRetryCity(i)} locale={locale} isDayTheme={isDayTheme} />
                      ) : null)}
                    </div>
                  </div>
                )}
                {/* Expand/collapse all */}
                {totalDays > 1 && (
                  <div style={{ padding: isDayTheme ? "12px 24px 4px" : "12px 0 4px", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={toggleAllDays} className="iv-btn-ghost" style={{ fontSize: 12 }}>
                      {allOpen ? (locale === "es" ? "Colapsar todo" : "Collapse all") : (locale === "es" ? "Expandir todo" : "Expand all")}
                    </button>
                  </div>
                )}
                {data.days?.map((day, di) => (
                  <div key={di} id={`day-${di}`}>
                    {isDayTheme
                      ? <DayCardDay day={day} isOpen={openDays.has(di)} onToggle={() => toggleDay(di)} edits={edits} onEdit={openEdit} locale={locale} />
                      : <DayCardNight day={day} isOpen={openDays.has(di)} onToggle={() => toggleDay(di)} edits={edits} onEdit={openEdit} locale={locale} />
                    }
                  </div>
                ))}
              </>
            )}

            {/* ── RESTAURANTS TAB ── */}
            {tab === "restaurants" && (
              cityResults.length > 1
                ? <MultiCityPanel cities={cityResults} isDayTheme={isDayTheme} renderContent={(city) => <RestaurantsList restaurants={city.restaurants ?? []} locale={locale} isDayTheme={isDayTheme} />} />
                : <RestaurantsList restaurants={data.restaurants ?? []} locale={locale} isDayTheme={isDayTheme} />
            )}

            {/* ── EVENTS TAB ── */}
            {tab === "events" && (
              cityResults.length > 1
                ? <MultiCityPanel cities={cityResults} isDayTheme={isDayTheme} renderContent={(city) => <EventsList events={city.events ?? []} locale={locale} isDayTheme={isDayTheme} />} />
                : <EventsList events={data.events ?? []} locale={locale} isDayTheme={isDayTheme} />
            )}

            {/* ── HOTELS TAB ── */}
            {tab === "hotels" && (
              cityResults.length > 1
                ? <MultiCityPanel cities={cityResults} isDayTheme={isDayTheme} renderContent={(city) => <HotelsList hotels={city.hotels ?? []} locale={locale} isDayTheme={isDayTheme} />} />
                : <HotelsList hotels={data.hotels ?? []} locale={locale} isDayTheme={isDayTheme} />
            )}

            {/* ── EXTRAS TAB ── */}
            {tab === "extras" && (
              <div style={{ padding: isDayTheme ? "24px" : 0 }}>
                {cityResults.length > 1 ? (
                  <MultiCityPanel cities={cityResults} isDayTheme={isDayTheme} renderContent={(city, ri) => {
                    const allCities = cityResults;
                    const offset = allCities.slice(0, ri).reduce((a, c) => a + (c.days?.length ?? 0), 0);
                    const startD = new Date(form?.startDate ?? "");
                    startD.setDate(startD.getDate() + offset);
                    const endD = new Date(form?.startDate ?? "");
                    endD.setDate(endD.getDate() + offset + (city.days?.length ?? 1) - 1);
                    return (
                      <TravelExtrasTabs
                        data={city}
                        locale={locale}
                        from={startD.toISOString().split("T")[0]}
                        to={endD.toISOString().split("T")[0]}
                        pax={form?.travelers ?? 1}
                      />
                    );
                  }} />
                ) : (
                  <TravelExtrasTabs
                    data={data}
                    locale={locale}
                    from={form?.startDate ?? ""}
                    to={form?.endDate ?? ""}
                    pax={form?.travelers ?? 1}
                  />
                )}
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {tab === "security" && (
              cityResults.length > 1
                ? <MultiCityPanel cities={cityResults} isDayTheme={isDayTheme} renderContent={(city) => <SecurityTab alerts={city.alerts ?? []} locale={locale} isDayTheme={isDayTheme} />} />
                : <SecurityTab alerts={data.alerts ?? []} locale={locale} isDayTheme={isDayTheme} />
            )}

            {/* ── PREPARATION TAB ── */}
            {tab === "preparation" && <PreparationTab items={data.preparation} locale={locale} isDayTheme={isDayTheme} />}

            {/* ── GASTRONOMY TAB ── */}
            {tab === "gastronomy" && <GastronomyTab items={data.gastronomy} locale={locale} isDayTheme={isDayTheme} />}

            {/* ── TIPS TAB ── */}
            {tab === "tips" && <TipsTab items={data.tips} locale={locale} isDayTheme={isDayTheme} />}

            {/* ── BUDGET TAB ── */}
            {tab === "budget" && <BudgetTab budget={data.budgetBreakdown} locale={locale} isDayTheme={isDayTheme} />}

          </main>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: isDayTheme ? "#fff" : "hsl(240 45% 10%)", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.12)"}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, position: "relative" }}>
            {/* Rainbow bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: "linear-gradient(90deg,#FF6B1A,#FFB347,#FF6B1A)" }} />
            <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: isDayTheme ? "#1A1A1A" : "#fff" }}>
              ✏️ {locale === "es" ? "Editar" : "Edit"}: {editModal.name}
            </h3>
            {/* Alternatives */}
            {editModal.alternatives && editModal.alternatives.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: isDayTheme ? "#888" : "rgba(255,255,255,0.45)", marginBottom: 8 }}>{locale === "es" ? "Alternativas sugeridas:" : "Suggested alternatives:"}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {editModal.alternatives.map((a, i) => (
                    <button key={i} onClick={() => setEditAltIdx(editAltIdx === i ? -1 : i)}
                      style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${editAltIdx === i ? "#FF6B1A" : isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.15)"}`, background: editAltIdx === i ? (isDayTheme ? "#FFF3E0" : "rgba(255,120,30,0.15)") : "transparent", color: editAltIdx === i ? "#FF6B1A" : isDayTheme ? "#555" : "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: isDayTheme ? "#888" : "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>{locale === "es" ? "Nombre" : "Name"}</label>
              <input
                value={editName} onChange={e => setEditName(e.target.value)} disabled={editAltIdx >= 0}
                style={{ width: "100%", padding: "10px 14px", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.15)"}`, borderRadius: 10, fontSize: 14, background: isDayTheme ? "#F9F8F5" : "rgba(255,255,255,0.06)", color: isDayTheme ? "#1A1A1A" : "#fff", outline: "none", opacity: editAltIdx >= 0 ? 0.4 : 1, boxSizing: "border-box" }}
              />
            </div>
            {/* Note */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: isDayTheme ? "#888" : "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>{locale === "es" ? "Nota personal" : "Personal note"}</label>
              <textarea
                value={editNote} onChange={e => setEditNote(e.target.value)} rows={3}
                style={{ width: "100%", padding: "10px 14px", border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.15)"}`, borderRadius: 10, fontSize: 14, background: isDayTheme ? "#F9F8F5" : "rgba(255,255,255,0.06)", color: isDayTheme ? "#1A1A1A" : "#fff", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveEdit} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "#FF6B1A", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {locale === "es" ? "Guardar" : "Save"}
              </button>
              <button onClick={() => setEditModal(null)} style={{ padding: "11px 20px", borderRadius: 10, border: `1px solid ${isDayTheme ? "#E8E7E3" : "rgba(255,255,255,0.12)"}`, background: isDayTheme ? "#F9F8F5" : "rgba(255,255,255,0.06)", color: isDayTheme ? "#555" : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14 }}>
                {locale === "es" ? "Cancelar" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
