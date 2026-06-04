import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";

export default function SobreNosotrosPage() {
  return (
    <PageLayout title="Sobre Nosotros" description="La historia de Smart Travel: transformar horas de planificación en segundos de decisión.">
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Nuestra historia</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
          Nuestra historia
        </h1>
      </div>

      <div className="page-card" style={{ borderTop: "2px solid hsl(12 85% 55%)", marginBottom: 20 }}>
        <p className="page-p" style={{ fontSize: 17, lineHeight: 1.9 }}>
          <strong style={{ color: "#fff" }}>Smart Travel nació para resolver un problema común:</strong> planificar un viaje requiere visitar múltiples páginas web, comparar opciones, investigar actividades y organizar horarios durante horas o días enteros.
        </p>
        <p className="page-p">
          Vimos que los viajeros perdían tiempo valioso en la etapa de planificación cuando podrían estar disfrutando la anticipación del viaje. Decidimos construir una herramienta que resolviera todo eso en un único formulario, en menos de un minuto.
        </p>
      </div>

      <h2 className="page-h2">Nuestra misión</h2>
      <div className="page-card">
        <p className="page-p" style={{ fontSize: 16 }}>
          Transformar horas de planificación en segundos de decisión, entregando a cada viajero un itinerario completo, personalizado y listo para usar — sin importar si viajan solos, en familia o en grupo.
        </p>
      </div>

      <h2 className="page-h2">Nuestra visión</h2>
      <div className="page-card">
        <p className="page-p" style={{ fontSize: 16 }}>
          Convertirnos en la plataforma de planificación de viajes más simple y eficiente para viajeros de todo el mundo, democratizando el acceso a experiencias de viaje bien organizadas sin importar el presupuesto.
        </p>
      </div>

      <h2 className="page-h2">Lo que nos diferencia</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "⚡", title: "Velocidad", desc: "Un itinerario completo generado en menos de 60 segundos." },
          { icon: "🎯", title: "Precisión", desc: "Recomendaciones adaptadas a tu tipo de viajero, presupuesto e intereses." },
          { icon: "🔓", title: "Sin barreras", desc: "Gratuito, sin registro, sin complicaciones." },
          { icon: "🌍", title: "Global", desc: "Más de 180 destinos con datos locales actualizados." },
        ].map(v => (
          <div key={v.title} className="page-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{v.title}</div>
            <p className="page-p" style={{ margin: 0, fontSize: 13 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="page-divider" />
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p className="page-p">¿Tienes preguntas o quieres colaborar con nosotros?</p>
        <Link href="/contacto" className="page-btn" style={{ textDecoration: "none" }}>Contáctanos</Link>
      </div>
    </PageLayout>
  );
}
