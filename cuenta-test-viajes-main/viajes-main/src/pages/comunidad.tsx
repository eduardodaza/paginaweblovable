import { PageLayout } from "@/components/PageLayout";
import { useState } from "react";

export default function ComunidadPage() {
  const [sent, setSent] = useState(false);
  const [sug, setSug] = useState({ nombre: "", email: "", tipo: "", mensaje: "" });
  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setSug(p => ({ ...p, [k]: e.target.value }));

  return (
    <PageLayout title="Comunidad" description="Únete a la comunidad de viajeros de Smart Travel. Comparte experiencias, sugiere funciones y participa en el futuro de la app.">
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Comunidad</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
          Comunidad Smart Travel
        </h1>
        <p className="page-p" style={{ maxWidth: 560, margin: "0 auto" }}>
          Únete a miles de viajeros que usan Smart Travel para planificar sus aventuras. Tu voz da forma al futuro de la plataforma.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 48 }}>
        {[
          { icon: "🌟", title: "Compartir experiencias", desc: "Cuenta cómo fue tu viaje planificado con Smart Travel.", color: "hsl(38 95% 60%)" },
          { icon: "💡", title: "Sugerir funciones", desc: "Propón nuevas características que harían tu viaje mejor.", color: "hsl(280 70% 65%)" },
          { icon: "🐛", title: "Reportar mejoras", desc: "Ayúdanos a mejorar la plataforma con tu feedback directo.", color: "hsl(200 80% 60%)" },
          { icon: "🔬", title: "Beta testers", desc: "Sé el primero en probar nuevas funcionalidades antes del lanzamiento.", color: "hsl(12 85% 60%)" },
          { icon: "🗳️", title: "Votar características", desc: "Decide qué funciones desarrollamos primero con tus votos.", color: "hsl(160 70% 50%)" },
        ].map(s => (
          <div key={s.title} className="page-card" style={{ borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</div>
            <p className="page-p" style={{ margin: 0, fontSize: 13 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="page-divider" />

      {sent ? (
        <div className="page-card" style={{ textAlign: "center", borderTop: "2px solid hsl(160 70% 50%)", padding: "48px 28px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>¡Gracias por tu sugerencia!</h2>
          <p className="page-p">La revisaremos y te contactaremos si tenemos preguntas.</p>
        </div>
      ) : (
        <div className="page-card">
          <h2 className="page-h2" style={{ marginTop: 0 }}>Enviar sugerencia</h2>
          <p className="page-p">¿Tienes una idea para mejorar Smart Travel? Cuéntanos.</p>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Nombre</label>
          <input className="page-input" placeholder="Tu nombre" value={sug.nombre} onChange={upd("nombre")} />
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Correo (opcional)</label>
          <input className="page-input" type="email" placeholder="tu@correo.com" value={sug.email} onChange={upd("email")} />
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tipo de sugerencia</label>
          <select className="page-input" value={sug.tipo} onChange={upd("tipo")}>
            <option value="">Selecciona...</option>
            <option>Nueva función</option><option>Mejora de diseño</option>
            <option>Nuevo destino</option><option>Reporte de error</option>
            <option>Participar en beta</option><option>Otra</option>
          </select>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Describe tu sugerencia</label>
          <textarea className="page-textarea" placeholder="Cuéntanos tu idea con el mayor detalle posible..." value={sug.mensaje} onChange={upd("mensaje")} style={{ marginBottom: 20 }} />
          <button className="page-btn" onClick={() => sug.nombre && sug.mensaje && setSent(true)}>
            Enviar sugerencia →
          </button>
        </div>
      )}
    </PageLayout>
  );
}
