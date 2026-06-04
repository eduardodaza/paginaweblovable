import { PageLayout } from "@/components/PageLayout";

const SECTIONS = [
  { t: "1. Aceptación de términos", c: "Al acceder y utilizar Smart Travel, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio. El uso continuado de la plataforma implica la aceptación de los términos vigentes." },
  { t: "2. Uso permitido", c: "Smart Travel está diseñado para planificación personal de viajes. Puedes usar la plataforma para generar itinerarios para tu uso personal o profesional legítimo. Queda prohibido: usar la plataforma con fines ilegales, intentar acceder a sistemas o datos no autorizados, reproducir el contenido generado con fines comerciales sin autorización, y usar bots o sistemas automatizados para sobrecargar la plataforma." },
  { t: "3. Limitación de responsabilidad", c: "Los itinerarios generados por Smart Travel son sugerencias basadas en datos disponibles y no constituyen asesoría profesional. Smart Travel no se hace responsable de: cambios en horarios, precios o disponibilidad de servicios turísticos; decisiones de viaje tomadas en base a la información generada; eventos de fuerza mayor que afecten el viaje planificado; ni pérdidas directas o indirectas derivadas del uso de la plataforma." },
  { t: "4. Disponibilidad del servicio", c: "Nos esforzamos por mantener Smart Travel disponible 24/7, pero no garantizamos disponibilidad ininterrumpida. Podemos realizar mantenimientos programados o no programados. No seremos responsables por interrupciones del servicio fuera de nuestro control." },
  { t: "5. Propiedad intelectual", c: "La marca Smart Travel, el diseño de la plataforma, los algoritmos de generación de itinerarios y el contenido editorial son propiedad exclusiva de Smart Travel. Los itinerarios generados para el usuario son de uso personal. Queda prohibida la reproducción, distribución o comercialización sin autorización expresa." },
  { t: "6. Modificaciones del servicio", c: "Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso. También podemos actualizar estos términos. Los cambios significativos se notificarán en la plataforma con al menos 15 días de anticipación." },
  { t: "7. Jurisdicción aplicable", c: "Estos términos se rigen por las leyes de Colombia. Cualquier disputa derivada del uso de Smart Travel se someterá a la jurisdicción de los tribunales competentes de Bogotá, Colombia, salvo disposición legal en contrario aplicable al usuario por razón de su residencia." },
];

export default function TerminosPage() {
  return (
    <PageLayout title="Términos y Condiciones" description="Términos de uso de la plataforma Smart Travel.">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="page-badge">✦ Legal</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16 }}>Términos y Condiciones</h1>
        <p className="page-p" style={{ maxWidth: 500, margin: "0 auto" }}>Última actualización: junio de 2026</p>
      </div>
      {SECTIONS.map(s => (
        <div key={s.t} style={{ marginBottom: 24 }}>
          <h2 className="page-h2" style={{ fontSize: "1.05rem", marginTop: 0, color: "hsl(38 95% 65%)" }}>{s.t}</h2>
          <p className="page-p">{s.c}</p>
          <div className="page-divider" style={{ margin: "20px 0 0" }} />
        </div>
      ))}
      <p className="page-p" style={{ textAlign: "center", marginTop: 32 }}>¿Preguntas legales? Escríbenos a <a href="mailto:legal@smarttravel.app" style={{ color: "hsl(12 85% 65%)" }}>legal@smarttravel.app</a></p>
    </PageLayout>
  );
}
