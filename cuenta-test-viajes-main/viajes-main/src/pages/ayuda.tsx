import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";

const FAQS = [
  { q: "¿Cómo funciona Smart Travel?", a: "Smart Travel genera itinerarios personalizados basados en tu destino, fechas, presupuesto e intereses. Completas un único formulario y en segundos obtienes un plan completo con actividades, restaurantes, horarios, costos estimados y alertas de seguridad." },
  { q: "¿Necesito registrarme para usar Smart Travel?", a: "No. Puedes generar itinerarios completos sin crear una cuenta. Simplemente ingresa tus datos de viaje y descarga tu plan al instante." },
  { q: "¿Cómo se calculan los presupuestos?", a: "Utilizamos referencias actualizadas del mercado para estimar los gastos diarios de alojamiento, alimentación, transporte local y actividades, adaptados al nivel de presupuesto que tú eliges (económico, moderado, premium o lujo)." },
  { q: "¿Los precios mostrados son exactos?", a: "Los precios son estimados de referencia y pueden variar según disponibilidad, temporada y tipo de cambio. Te recomendamos usarlos como guía de planificación y verificar precios reales en las plataformas de reserva." },
  { q: "¿En cuántos idiomas está disponible?", a: "Smart Travel está disponible en español e inglés. Puedes cambiar el idioma desde el selector ES/EN en la parte superior de la página." },
  { q: "¿Puedo editar el itinerario generado?", a: "Sí. Una vez generado el itinerario, cada actividad tiene un botón 'Editar itinerario' que te permite cambiar el nombre, agregar notas personales o seleccionar alternativas sugeridas por la plataforma." },
  { q: "¿Cómo reporto un error o problema?", a: "Utiliza nuestro formulario de contacto en la página /contacto o escríbenos directamente a soporte@smarttravel.app. Respondemos en menos de 48 horas." },
  { q: "¿Smart Travel funciona para viajes grupales?", a: "Sí. En el formulario puedes indicar el número de viajeros y el tipo de grupo (pareja, familia con niños, grupo de amigos, viaje de negocios o viajero solo) para recibir recomendaciones adaptadas." },
];

export default function AyudaPage() {
  return (
    <PageLayout title="Centro de Ayuda" description="Preguntas frecuentes y soporte para usuarios de Smart Travel.">
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="page-badge">✦ Soporte</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
          Centro de Ayuda
        </h1>
        <p className="page-p" style={{ maxWidth: 540, margin: "0 auto" }}>
          Encuentra respuestas rápidas a las preguntas más comunes sobre Smart Travel.
        </p>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 className="page-h2" style={{ marginTop: 0 }}>Preguntas frecuentes</h2>
        {FAQS.map((faq, i) => (
          <div key={i} className="page-card" style={{ borderLeft: "3px solid hsl(12 85% 55%)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{faq.q}</h3>
            <p className="page-p" style={{ margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="page-divider" />

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
        <h2 className="page-h2" style={{ marginTop: 0 }}>¿Necesitas ayuda adicional?</h2>
        <p className="page-p">Nuestro equipo de soporte está listo para ayudarte con cualquier consulta.</p>
        <Link href="/contacto" className="page-btn" style={{ textDecoration: "none", display: "inline-block" }}>
          Contactar soporte
        </Link>
      </div>
    </PageLayout>
  );
}
