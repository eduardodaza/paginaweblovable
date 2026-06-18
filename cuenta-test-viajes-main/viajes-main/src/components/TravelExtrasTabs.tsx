// src/components/TravelExtrasTabs.tsx — Pestañas de extras de viaje
import React, { useState } from "react";
import type { ItineraryData, Locale, Restaurant, Event, Hotel, SecurityAlert, PrepItem, GastronomyItem, TipItem, BudgetBreakdown } from "@/lib/types";

interface Props {
  data: ItineraryData;
  locale: Locale;
  from: string;
  to: string;
  pax: number;
}

// ── Badges para tipos ──────────────────────────────────────────────────────────
const RISK = {
  alto:  { bar: "#EF4444", badge: { bg: "#FEE2E2", color: "#DC2626" } },
  medio: { bar: "#F59E0B", badge: { bg: "#FEF3C7", color: "#D97706" } },
  bajo:  { bar: "#10B981", badge: { bg: "#D1FAE5", color: "#059669" } },
};

const HOTEL_COLORS: Record<string, { accent: string; label: string }> = {
  "Booking.com": { accent: "#0071c2", label: "Booking" },
  "Hotels.com":  { accent: "#d32d20", label: "Hotels.com" },
  "Expedia":     { accent: "#1a3286", label: "Expedia" },
  "Airbnb":      { accent: "#ff385c", label: "Airbnb" },
};

const PEXELS_FALLBACKS: Record<string, string> = {
  festival:   "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  concert:    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  permanent:  "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  gastronomy: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
  default:    "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
};

// ── SmartPhoto ────────────────────────────────────────────────────────────────
function SmartPhoto({ query, fallbackUrl, height }: { query: string; fallbackUrl: string; height: number }) {
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
          setSrc(fallbackUrl);
        }
      })
      .catch(() => { if (!cancelled) setSrc(fallbackUrl); });
    return () => { cancelled = true; };
  }, [query, fallbackUrl]);

  if (!src) {
    return (
      <div style={{
        width: "100%", height, borderRadius: 0,
        background: "linear-gradient(90deg, #EEEDEA 25%, #E4E3DF 50%, #EEEDEA 75%)",
        backgroundSize: "200% 100%", animation: "iv-shimmer 1.4s linear infinite",
      }} />
    );
  }

  return (
    <div style={{ width: "100%", height, overflow: "hidden" }}>
      <img
        src={imgFailed ? fallbackUrl : src}
        alt={query}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={() => setImgFailed(true)}
      />
    </div>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────────
function RestaurantsList({ restaurants, locale }: { restaurants: Restaurant[]; locale: Locale }) {
  if (!restaurants?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "No hay restaurantes" : "No restaurants"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Restaurantes" : "Restaurants"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Dónde comer" : "Where to eat"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {restaurants.map((r, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{r.name}</div>
              <span style={{ background: "#FFF3E0", color: "#E65100", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>{r.priceRange}</span>
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{r.type} · {r.zone}</div>
            <div style={{ fontSize: 13, color: "#52525B", lineHeight: 1.5 }}>{r.specialty}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsList({ events, locale }: { events: Event[]; locale: Locale }) {
  if (!events?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "No hay eventos" : "No events"}</div>;
  const typeLabels: Record<string, string> = { festival: "Festival", concert: "Concierto", permanent: "Atracción", sport: "Deporte", market: "Mercado", cinema: "Cine" };
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Eventos" : "Events"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Actividades destacadas" : "Featured activities"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, padding: 24 }}>
        {events.map((ev, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E7E3", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <SmartPhoto query={ev.venue ?? ev.name} fallbackUrl={PEXELS_FALLBACKS[ev.type] ?? PEXELS_FALLBACKS.default} height={200} />
              <span style={{ position: "absolute", bottom: 10, left: 10, background: "#FF6B1A", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>{typeLabels[ev.type] ?? ev.type}</span>
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#18181B" }}>{ev.name}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#52525B", lineHeight: 1.5 }}>{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsList({ hotels, locale }: { hotels: Hotel[]; locale: Locale }) {
  if (!hotels?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "No hay hoteles" : "No hotels"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Hoteles" : "Hotels"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Alojamiento" : "Accommodation"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {hotels.map((h, i) => {
          const platform = h.platform ?? "Booking.com";
          const pc = HOTEL_COLORS[platform] ?? { accent: "#0071c2", label: "Booking" };
          return (
            <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E7E3" }}>
              {h.photoUrl && <img src={h.photoUrl} alt={h.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />}
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 8 }}>{h.name} {"★".repeat(h.stars)}</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{h.address}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{h.reviewScore}/10</span>
                  <span style={{ fontWeight: 700, color: "#FF6B1A" }}>{h.pricePerNight} {h.currency}</span>
                </div>
                {h.url && <a href={h.url} target="_blank" style={{ display: "block", marginTop: 12, padding: "10px 16px", background: pc.accent, color: "#fff", borderRadius: 8, textAlign: "center", textDecoration: "none", fontWeight: 600 }}>Ver en {pc.label}</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecurityList({ alerts, locale }: { alerts: SecurityAlert[]; locale: Locale }) {
  if (!alerts?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "Sin alertas" : "No alerts"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Seguridad" : "Security"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Información importante" : "Important info"}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px 24px" }}>
        {alerts.map((a, i) => {
          const rk = (a.level ?? "bajo") as keyof typeof RISK;
          const r = RISK[rk] ?? RISK.bajo;
          return (
            <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 12, padding: 16, borderLeft: `4px solid ${r.bar}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: r.badge.bg, color: r.badge.color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{a.level?.toUpperCase()}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{a.zone}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#52525B" }}>{a.description}</p>
              {a.tip && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#3498DB", fontStyle: "italic" }}>💡 {a.tip}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GastronomyList({ items, locale }: { items?: GastronomyItem[]; locale: Locale }) {
  if (!items?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "Sin gastronomía" : "No gastronomy"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Gastronomía" : "Gastronomy"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Platos típicos" : "Local dishes"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18, padding: "0 24px 24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 14, overflow: "hidden" }}>
            <SmartPhoto query={item.name} fallbackUrl={PEXELS_FALLBACKS.gastronomy} height={170} />
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#18181B", marginBottom: 6 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: "#52525B" }}>{item.description}</div>
              {item.priceRange && <div style={{ marginTop: 8, fontWeight: 700, color: "#FF6B1A" }}>{item.priceRange}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsList({ items, locale }: { items?: TipItem[]; locale: Locale }) {
  if (!items?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "Sin consejos" : "No tips"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Consejos" : "Tips"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Recomendaciones" : "Recommendations"}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px 24px" }}>
        {items.map((tip, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 12, padding: 16, display: "flex", gap: 14 }}>
            <span style={{ fontSize: 22 }}>{tip.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#18181B", marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13, color: "#52525B" }}>{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetDisplay({ budget, locale }: { budget?: BudgetBreakdown; locale: Locale }) {
  if (!budget) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "Sin presupuesto" : "No budget"}</div>;
  const rows = [
    { label: locale === "es" ? "Alojamiento" : "Accommodation", value: budget.accommodation, icon: "🏨" },
    { label: locale === "es" ? "Transporte" : "Transport", value: budget.transport, icon: "✈️" },
    { label: locale === "es" ? "Alimentación" : "Food", value: budget.food, icon: "🍽️" },
    { label: locale === "es" ? "Actividades" : "Activities", value: budget.activities, icon: "🎭" },
  ];
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Presupuesto" : "Budget"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Costos estimados" : "Estimated costs"}</p>
      </div>
      <div style={{ padding: "0 24px 24px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 10, padding: "12px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#52525B" }}>{r.icon} {r.label}</span>
            <span style={{ fontWeight: 700, color: "#18181B" }}>{r.value}</span>
          </div>
        ))}
        <div style={{ background: "#FFF3E0", border: "1px solid #FDBA74", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, color: "#E65100" }}>TOTAL</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#E65100" }}>{budget.total}</span>
        </div>
      </div>
    </div>
  );
}

function PrepList({ items, locale }: { items?: PrepItem[]; locale: Locale }) {
  if (!items?.length) return <div style={{ textAlign: "center", padding: 40, color: "#888" }}>{locale === "es" ? "Sin preparación" : "No prep"}</div>;
  return (
    <div>
      <div style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#18181B", margin: "0 0 4px" }}>{locale === "es" ? "Preparación" : "Preparation"}</h2>
        <p style={{ fontSize: 14, color: "#71717A", margin: "0 0 20px" }}>{locale === "es" ? "Antes de viajar" : "Before traveling"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, padding: "0 24px 24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E8E7E3", borderRadius: 12, padding: 16, display: "flex", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#18181B", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "#52525B" }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function TravelExtrasTabs({ data, locale, from, to, pax }: Props) {
  const [activeTab, setActiveTab] = useState("restaurants");

  const tabs = [
    { id: "restaurants", label: locale === "es" ? "Restaurantes" : "Restaurants", icon: "🍽️" },
    { id: "events", label: locale === "es" ? "Eventos" : "Events", icon: "🎭" },
    { id: "hotels", label: locale === "es" ? "Hoteles" : "Hotels", icon: "🏨" },
    { id: "security", label: locale === "es" ? "Seguridad" : "Security", icon: "🛡️" },
    { id: "gastronomy", label: locale === "es" ? "Gastronomía" : "Gastronomy", icon: "🍴" },
    { id: "tips", label: locale === "es" ? "Consejos" : "Tips", icon: "💡" },
    { id: "budget", label: locale === "es" ? "Presupuesto" : "Budget", icon: "💰" },
    { id: "prep", label: locale === "es" ? "Preparación" : "Prep", icon: "📋" },
  ];

  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Header con info del viaje */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E7E3", padding: "16px 24px" }}>
        <div style={{ fontSize: 14, color: "#71717A" }}>
          📅 {from} → {to} · 👥 {pax} {locale === "es" ? "viajeros" : "travelers"}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "12px 24px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #E8E7E3" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              background: activeTab === tab.id ? "#FF6B1A" : "#F0EFE9",
              color: activeTab === tab.id ? "#fff" : "#555",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ paddingTop: 8 }}>
        {activeTab === "restaurants" && <RestaurantsList restaurants={data.restaurants ?? []} locale={locale} />}
        {activeTab === "events" && <EventsList events={data.events ?? []} locale={locale} />}
        {activeTab === "hotels" && <HotelsList hotels={data.hotels ?? []} locale={locale} />}
        {activeTab === "security" && <SecurityList alerts={data.alerts ?? []} locale={locale} />}
        {activeTab === "gastronomy" && <GastronomyList items={data.gastronomy} locale={locale} />}
        {activeTab === "tips" && <TipsList items={data.tips} locale={locale} />}
        {activeTab === "budget" && <BudgetDisplay budget={data.budgetBreakdown} locale={locale} />}
        {activeTab === "prep" && <PrepList items={data.preparation} locale={locale} />}
      </div>
    </div>
  );
}
