// Hero.tsx — Smart Travel branding. Fondo 100% CSS.
import { motion } from "framer-motion";
import { Clock, MapPin, Shield, CheckCircle, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/types";

const STATS = [
  { n: "120k+", es: "Viajeros satisfechos", en: "Happy travelers",   color: "hsl(12 85% 60%)"  },
  { n: "< 1min", es: "Para planificar",     en: "To plan your trip", color: "hsl(280 70% 65%)" },
  { n: "180+",  es: "Destinos cubiertos",   en: "Destinations",      color: "hsl(38 95% 60%)"  },
];

const TRUST = [
  { icon: Clock,       es: "Planifica en menos de un minuto",  en: "Plan in under one minute"   },
  { icon: Shield,      es: "100% gratis · Sin registro",       en: "100% free · No sign-up"      },
  { icon: CheckCircle, es: "Un solo formulario, todo resuelto", en: "One form, everything sorted" },
];

const CHIPS = ["🗼 París","🗻 Japón","🏝 Bali","🗽 NYC","🏛 Roma","🌅 Santorini","🏖 Cartagena","🕌 Dubái"];

export function Hero({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20"
      style={{ background: "linear-gradient(135deg, hsl(240 45% 8%) 0%, hsl(260 55% 14%) 35%, hsl(280 45% 11%) 65%, hsl(220 50% 9%) 100%)" }}
    >
      {/* Orbes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div style={{ position:"absolute", top:"-10%", left:"-8%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, hsl(12 90% 55% / 0.22) 0%, transparent 70%)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", top:"20%", right:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, hsl(280 80% 60% / 0.2) 0%, transparent 70%)", filter:"blur(50px)" }} />
        <div style={{ position:"absolute", bottom:"-5%", left:"15%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, hsl(200 85% 55% / 0.15) 0%, transparent 70%)", filter:"blur(60px)" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"40px 40px", maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
          style={{ background:"linear-gradient(135deg, hsl(12 85% 55% / 0.2), hsl(280 70% 55% / 0.2))", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.9)", backdropFilter:"blur(12px)" }}
        >
          <MapPin style={{ width:14, height:14, color:"hsl(38 95% 70%)" }} />
          {es ? "✦ Planificación de viajes simple y completa" : "✦ Simple and complete travel planning"}
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, delay:0.1 }}
          style={{ fontSize:"clamp(2.6rem, 7vw, 5rem)", fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.05, color:"#fff" }}
        >
          {es ? "Planifica tu viaje completo" : "Plan your full trip"}{" "}
          <br />
          <span style={{
            backgroundImage:"linear-gradient(90deg, hsl(12 90% 65%) 0%, hsl(38 100% 62%) 30%, hsl(280 80% 72%) 65%, hsl(200 85% 68%) 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            filter:"drop-shadow(0 0 30px hsl(12 85% 55% / 0.4))",
          }}>
            {es ? "en menos de un minuto" : "in under one minute"}
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
          style={{ marginTop:28, fontSize:"clamp(1rem, 2.5vw, 1.2rem)", maxWidth:640, margin:"28px auto 0", lineHeight:1.75, color:"rgba(255,255,255,0.72)" }}
        >
          {es
            ? "Ingresa destino, fechas y presupuesto. Obtén al instante un itinerario optimizado con actividades, restaurantes, costos estimados, clima y recomendaciones personalizadas."
            : "Enter destination, dates and budget. Instantly get an optimized itinerary with activities, restaurants, estimated costs, weather and personalized recommendations."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.4 }}
          style={{ marginTop:40, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:16 }}
        >
          <a href="#generador"
            className="inline-flex items-center gap-2.5 rounded-full text-white font-bold transition-all duration-300 hover:scale-[1.04]"
            style={{ padding:"16px 36px", fontSize:16, background:"linear-gradient(135deg, hsl(12 85% 55%) 0%, hsl(38 95% 58%) 50%, hsl(12 85% 55%) 100%)", backgroundSize:"200% 100%", boxShadow:"0 8px 32px hsl(12 85% 55% / 0.55), inset 0 1px 0 rgba(255,255,255,0.2)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundPosition="100% 0")}
            onMouseLeave={e => (e.currentTarget.style.backgroundPosition="0 0")}
          >
            {es ? "Crear mi plan de viaje" : "Create my travel plan"}
          </a>
          <a href="#destinos"
            className="inline-flex items-center gap-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] group"
            style={{ padding:"16px 32px", fontSize:15, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.9)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.08)"; }}
          >
            {es ? "Ver ejemplo de itinerario" : "See itinerary example"}
            <ArrowRight style={{ width:16, height:16, opacity:0.6 }} />
          </a>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.55 }}
          style={{ marginTop:32, display:"flex", flexWrap:"wrap", justifyContent:"center", gap:24 }}
        >
          {TRUST.map(({ icon:Icon, es:esTxt, en:enTxt }) => (
            <div key={esTxt} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
              <Icon style={{ width:15, height:15, color:"hsl(38 95% 68%)", flexShrink:0 }} />
              {es ? esTxt : enTxt}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.65 }}
          style={{ marginTop:56, display:"grid", gridTemplateColumns:"repeat(3,1fr)", maxWidth:420, margin:"56px auto 0", gap:12 }}
        >
          {STATS.map(s => (
            <div key={s.n} style={{ padding:"20px 8px", borderRadius:16, textAlign:"center", background:"rgba(255,255,255,0.06)", border:`1px solid rgba(255,255,255,0.1)`, borderTop:`2px solid ${s.color}`, backdropFilter:"blur(16px)" }}>
              <div style={{ fontSize:"clamp(1.4rem,3vw,1.8rem)", fontWeight:800, color:"#fff" }}>{s.n}</div>
              <div style={{ fontSize:11, marginTop:6, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>{es ? s.es : s.en}</div>
            </div>
          ))}
        </motion.div>

        {/* Chips */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
          style={{ marginTop:48, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:10 }}
        >
          <span style={{ fontSize:11, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.2em", color:"rgba(255,255,255,0.3)", marginRight:4 }}>popular:</span>
          {CHIPS.map(d => (
            <a key={d} href="#generador"
              style={{ fontSize:13, padding:"6px 14px", borderRadius:20, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.72)", cursor:"pointer", textDecoration:"none", transition:"all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.14)"; (e.currentTarget as HTMLAnchorElement).style.color="#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.72)"; }}
            >{d}</a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
        style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:10, fontFamily:"monospace", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>scroll</span>
        <div style={{ width:1, height:40, background:"linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)", animation:"bounce 2s infinite" }} />
      </motion.div>
    </section>
  );
}
