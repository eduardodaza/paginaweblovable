import { PageLayout } from "@/components/PageLayout";

const RELEASED = [
  { v: "Beta 1.0", date: "Ene 2026", items: ["Generación de itinerarios completos con IA","Personalización por tipo de viajero e intereses","Presupuesto configurable (4 niveles)","Recomendaciones automáticas de restaurantes y hoteles","Sistema de alertas de seguridad por destino","Soporte bilingüe Español / Inglés"] },
  { v: "Beta 1.1", date: "Feb 2026", items: ["Editor de itinerario con alternativas sugeridas","Links directos a Google Maps, TripAdvisor y Wikipedia","Integración con Ticketmaster para eventos locales","Buscador de vuelos con aerolíneas reales","Tours y experiencias vía Viator"] },
  { v: "Beta 1.2", date: "Abr 2026", items: ["Rediseño visual completo (paleta oscura premium)","Galería de destinos con 12 ciudades destacadas","Sección de blog con artículos de viajeros","Página de precios con plan gratuito y Pro","Footer con todas las secciones funcionales"] },
];

const COMING = [
  { icon: "🔄", title: "Replanificación automática", desc: "Ajusta el itinerario automáticamente si cambian tus fechas o cancelan una actividad." },
  { icon: "✈️", title: "Seguimiento de vuelos", desc: "Monitoreo en tiempo real del estado de tu vuelo y alertas de cambios." },
  { icon: "📅", title: "Sincronización con calendarios", desc: "Exporta tu itinerario directamente a Google Calendar o Apple Calendar." },
  { icon: "📱", title: "App móvil (iOS y Android)", desc: "Accede a tu itinerario offline desde cualquier lugar del mundo." },
  { icon: "💳", title: "Control de gastos", desc: "Registra tus gastos reales durante el viaje y compáralos con el presupuesto estimado." },
  { icon: "👥", title: "Itinerarios colaborativos", desc: "Planifica con amigos y familia en tiempo real desde distintos dispositivos." },
];

export default function NovedadesPage() {
  return (
    <PageLayout title="Novedades" description="Conoce las últimas actualizaciones de Smart Travel y lo que viene próximamente.">
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Changelog</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>Novedades</h1>
        <p className="page-p" style={{ maxWidth: 500, margin: "0 auto" }}>Seguimos mejorando Smart Travel cada semana. Aquí están todas las actualizaciones.</p>
      </div>

      <h2 className="page-h2" style={{ marginTop: 0 }}>✅ Lanzado</h2>
      {RELEASED.map(r => (
        <div key={r.v} className="page-card" style={{ marginBottom: 16, borderLeft: "3px solid hsl(160 70% 50%)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
            <span style={{ padding: "4px 14px", borderRadius: 20, background: "hsl(160 70% 50%/0.15)", border: "1px solid hsl(160 70%50%/0.3)", color: "hsl(160 70% 55%)", fontSize: 12, fontWeight: 700 }}>{r.v}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{r.date}</span>
          </div>
          <ul className="page-ul">
            {r.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}

      <div className="page-divider" />
      <h2 className="page-h2">🚀 Próximamente</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {COMING.map(c => (
          <div key={c.title} className="page-card" style={{ borderTop: "2px solid hsl(280 70% 60%)" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{c.title}</div>
            <p className="page-p" style={{ margin: 0, fontSize: 13 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
