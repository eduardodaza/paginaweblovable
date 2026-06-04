import { PageLayout } from "@/components/PageLayout";
import { useState } from "react";

const GUIDES = [
  { name: "Japón", emoji: "🗻", best: "Marzo-Mayo (primavera) y Oct-Nov (otoño)", budget: "$80-180 USD/día", transport: "JR Pass para trenes, metro en ciudades", security: "Muy seguro. Bajo índice de criminalidad.", highlights: ["Tokio · Shibuya, Akihabara, Senso-ji","Kioto · Templos, Geishas, Arashiyama","Osaka · Gastronomía y vida nocturna","Hiroshima · Historia y Miyajima","Hokkaido · Naturaleza y esquí"], color: "hsl(12 85% 60%)" },
  { name: "España", emoji: "🏛", best: "Abril-Junio y Sept-Oct", budget: "$60-150 USD/día", transport: "AVE (tren de alta velocidad), metro en ciudades", security: "Seguro. Cuidado con carteristas en zonas turísticas.", highlights: ["Madrid · Prado, Retiro, Gran Vía","Barcelona · Sagrada Familia, Gaudí, Barceloneta","Sevilla · Flamenco, Real Alcázar","Granada · Alhambra, Albaicín","San Sebastián · Gastronomía y pintxos"], color: "hsl(38 95% 60%)" },
  { name: "Italia", emoji: "🍕", best: "Abril-Junio y Sept-Oct", budget: "$70-160 USD/día", transport: "Trenes Trenitalia e Italo entre ciudades", security: "Seguro. Precaución con carteristas en zonas turísticas.", highlights: ["Roma · Coliseo, Vaticano, Fontana di Trevi","Florencia · Uffizi, Duomo, David de Miguel Ángel","Venecia · Canales, Murano, Burano","Cinque Terre · Costa y senderismo","Amalfi · Costa y gastronomía local"], color: "hsl(160 70% 50%)" },
  { name: "Francia", emoji: "🗼", best: "Mayo-Junio y Sept", budget: "$80-200 USD/día", transport: "TGV entre ciudades, metro en París", security: "Seguro. Cuidado con carteristas alrededor de monumentos.", highlights: ["París · Torre Eiffel, Louvre, Montmartre","Lyon · Gastronomía francesa","Niza · Costa Azul y Mónaco","Mont Saint-Michel · Abadía medieval","Provenza · Lavanda y vinos"], color: "hsl(200 80% 60%)" },
  { name: "Colombia", emoji: "🏖", best: "Dic-Mar y Jul-Ago (temporada seca)", budget: "$30-80 USD/día", transport: "Vuelos domésticos, buses intermunicipales", security: "Mejoras significativas. Seguir recomendaciones locales.", highlights: ["Cartagena · Ciudad amurallada, playas del Caribe","Medellín · Innovación, cultura, clima primaveral","Bogotá · Museos, gastronomía, Monserrate","Guatapé · Peñol y embalse","Tayrona · Parque natural y playas vírgenes"], color: "hsl(280 70% 65%)" },
  { name: "México", emoji: "🌮", best: "Nov-Abril (temporada seca)", budget: "$40-100 USD/día", transport: "ADO (buses), vuelos de bajo costo", security: "Varía por zona. Destinos turísticos muy seguros.", highlights: ["Ciudad de México · Historia, gastronomía, museos","Cancún · Playas caribeñas y Riviera Maya","Oaxaca · Cultura zapoteca y gastronomía","San Cristóbal de las Casas · Pueblos indígenas","Chichén Itzá · Ruinas mayas"], color: "hsl(320 70% 60%)" },
];

export default function GuiasPage() {
  const [open, setOpen] = useState<string|null>(null);
  return (
    <PageLayout title="Guías de Viaje" description="Guías completas de los destinos más populares: mejor época, presupuesto, transporte, seguridad y atracciones.">
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Guías de viaje</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
          Destinos detallados
        </h1>
        <p className="page-p" style={{ maxWidth: 520, margin: "0 auto" }}>
          Todo lo que necesitas saber antes de viajar. Haz clic en cada destino para ver la guía completa.
        </p>
      </div>

      {GUIDES.map(g => (
        <div key={g.name} className="page-card" style={{ marginBottom: 16, borderLeft: `3px solid ${g.color}`, cursor: "pointer" }} onClick={() => setOpen(open === g.name ? null : g.name)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 36 }}>{g.emoji}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{g.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>💰 {g.budget}</div>
              </div>
            </div>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", transform: open === g.name ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>⌄</span>
          </div>

          {open === g.name && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
                {[
                  { icon: "🌤", label: "Mejor época", val: g.best },
                  { icon: "💰", label: "Presupuesto/día", val: g.budget },
                  { icon: "🚆", label: "Transporte", val: g.transport },
                  { icon: "🛡️", label: "Seguridad", val: g.security },
                ].map(info => (
                  <div key={info.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{info.icon} {info.label}</div>
                    <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.6 }}>{info.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>✦ Atracciones principales</div>
              <ul className="page-ul">
                {g.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
              <div style={{ marginTop: 20 }}>
                <a href="/#generador" style={{ padding: "10px 24px", borderRadius: 16, background: `linear-gradient(135deg,${g.color},hsl(38 95% 58%))`, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, display: "inline-block", boxShadow: `0 4px 16px ${g.color}55` }}>
                  Crear itinerario para {g.name} →
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </PageLayout>
  );
}
