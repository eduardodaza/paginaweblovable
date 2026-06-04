import { PageLayout } from "@/components/PageLayout";

const SECTIONS = [
  { t: "1. Información que recopilamos", c: "Smart Travel recopila únicamente los datos que tú proporcionas voluntariamente en el formulario de planificación: ciudad y país de destino, fechas de viaje, número de viajeros, tipo de viajero, presupuesto estimado e intereses. No recopilamos nombre, correo electrónico ni ningún dato personal identificable para generar itinerarios." },
  { t: "2. Uso de los datos", c: "Los datos del formulario se utilizan exclusivamente para generar el itinerario personalizado solicitado. No los vendemos, compartimos ni usamos para publicidad. Los datos se procesan en tiempo real y no se almacenan de forma permanente en nuestros servidores." },
  { t: "3. Cookies", c: "Smart Travel utiliza cookies técnicas esenciales para el funcionamiento básico de la plataforma (preferencia de idioma, sesión de usuario). No utilizamos cookies de rastreo publicitario ni compartimos datos con terceros con fines publicitarios." },
  { t: "4. Seguridad", c: "Todas las comunicaciones entre tu navegador y nuestros servidores se realizan mediante cifrado TLS/HTTPS. Aplicamos medidas de seguridad estándar de la industria para proteger la información durante su procesamiento." },
  { t: "5. Conservación de datos", c: "Los datos del formulario se utilizan en tiempo real para generar el itinerario y no se conservan en bases de datos tras la sesión. Los datos de contacto enviados por formulario se conservan únicamente el tiempo necesario para responder tu consulta (máximo 90 días)." },
  { t: "6. Derechos del usuario", c: "Tienes derecho a: acceder a los datos que nos hayas proporcionado, solicitar su corrección o eliminación, oponerte a su tratamiento y presentar una reclamación ante la autoridad de protección de datos de tu país. Para ejercer estos derechos, escríbenos a privacidad@smarttravel.app." },
  { t: "7. Solicitud de eliminación de información", c: "Si en algún momento deseas que eliminemos cualquier dato asociado a ti, envía un correo a privacidad@smarttravel.app indicando tu solicitud. Procesaremos la eliminación en un máximo de 72 horas hábiles." },
  { t: "8. Cambios a esta política", c: "Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos de cambios significativos mediante un aviso visible en la plataforma. La fecha de última actualización aparece al pie de esta página." },
];

export default function PrivacidadPage() {
  return (
    <PageLayout title="Política de Privacidad" description="Cómo Smart Travel recopila, usa y protege tu información personal.">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="page-badge">✦ Legal</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", marginTop: 16, marginBottom: 16 }}>Política de Privacidad</h1>
        <p className="page-p" style={{ maxWidth: 500, margin: "0 auto" }}>Última actualización: junio de 2026</p>
      </div>
      <div className="page-card" style={{ marginBottom: 32, borderLeft: "3px solid hsl(160 70% 50%)" }}>
        <p className="page-p" style={{ margin: 0 }}>En Smart Travel nos tomamos en serio la privacidad de nuestros usuarios. Esta política explica de forma clara y transparente qué datos recopilamos, cómo los usamos y cuáles son tus derechos.</p>
      </div>
      {SECTIONS.map(s => (
        <div key={s.t} style={{ marginBottom: 28 }}>
          <h2 className="page-h2" style={{ fontSize: "1.1rem", marginTop: 0, color: "hsl(38 95% 65%)" }}>{s.t}</h2>
          <p className="page-p">{s.c}</p>
          <div className="page-divider" style={{ margin: "20px 0 0" }} />
        </div>
      ))}
      <p className="page-p" style={{ textAlign: "center", marginTop: 32 }}>¿Preguntas sobre privacidad? Escríbenos a <a href="mailto:privacidad@smarttravel.app" style={{ color: "hsl(12 85% 65%)" }}>privacidad@smarttravel.app</a></p>
    </PageLayout>
  );
}
