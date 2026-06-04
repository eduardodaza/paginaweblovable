import { PageLayout } from "@/components/PageLayout";
import { useState } from "react";
import { Mail, Users, HelpCircle } from "lucide-react";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", correo: "", asunto: "", mensaje: "" });
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <PageLayout title="Contacto" description="Contáctanos para soporte, alianzas o sugerencias sobre Smart Travel.">
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Contacto</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
          Estamos aquí para ayudarte
        </h1>
        <p className="page-p" style={{ maxWidth: 520, margin: "0 auto" }}>
          Escríbenos por cualquier consulta, alianza comercial o sugerencia. Respondemos en menos de 48 horas.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
        {[
          { icon: HelpCircle, title: "Soporte técnico", email: "soporte@smarttravel.app", color: "hsl(12 85% 60%)" },
          { icon: Users,      title: "Alianzas",         email: "partners@smarttravel.app", color: "hsl(280 70% 65%)" },
          { icon: Mail,       title: "General",           email: "hola@smarttravel.app",   color: "hsl(38 95% 60%)" },
        ].map(c => (
          <div key={c.title} className="page-card" style={{ textAlign: "center", borderTop: `2px solid ${c.color}` }}>
            <c.icon style={{ width: 28, height: 28, color: c.color, margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{c.title}</div>
            <a href={`mailto:${c.email}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", wordBreak: "break-all" }}>{c.email}</a>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="page-card" style={{ textAlign: "center", borderColor: "hsl(160 70% 50%/0.4)", borderTop: "2px solid hsl(160 70% 50%)", padding: "48px 28px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>¡Mensaje enviado!</h2>
          <p className="page-p">Te responderemos a <strong style={{ color: "hsl(38 95% 65%)" }}>{form.correo}</strong> en menos de 48 horas.</p>
        </div>
      ) : (
        <div className="page-card">
          <h2 className="page-h2" style={{ marginTop: 0 }}>Envíanos un mensaje</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Nombre</label>
              <input className="page-input" placeholder="Tu nombre" value={form.nombre} onChange={update("nombre")} /></div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Correo</label>
              <input className="page-input" type="email" placeholder="tu@correo.com" value={form.correo} onChange={update("correo")} /></div>
          </div>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Asunto</label>
          <select className="page-input" value={form.asunto} onChange={update("asunto")} style={{ marginBottom: 12 }}>
            <option value="">Selecciona un asunto</option>
            <option>Soporte técnico</option><option>Reportar un error</option>
            <option>Alianza comercial</option><option>Sugerencia</option><option>Otro</option>
          </select>
          <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Mensaje</label>
          <textarea className="page-textarea" placeholder="Cuéntanos en qué podemos ayudarte..." value={form.mensaje} onChange={update("mensaje")} style={{ marginBottom: 20 }} />
          <button className="page-btn" onClick={() => form.nombre && form.correo && form.mensaje && setSent(true)}>
            Enviar mensaje →
          </button>
        </div>
      )}
    </PageLayout>
  );
}
