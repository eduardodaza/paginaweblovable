// src/components/Loader.tsx — Rediseño visual. Lógica 100% intacta.
import React, { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

interface Props { city: string; locale: Locale; }

const STEPS_KEYS = ["loadingStep1","loadingStep2","loadingStep3","loadingStep4","loadingStep5"];

export default function Loader({ city, locale }: Props) {
  const [current, setCurrent] = useState(0);
  const steps = STEPS_KEYS.map((k) => t(k, locale));

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, hsl(240 45% 8%) 0%, hsl(260 55% 14%) 40%, hsl(220 50% 9%) 100%)",
      padding: "24px 16px", position: "relative", overflow: "hidden",
    }}>
      {/* Orbes de fondo */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, hsl(12 90% 55% / 0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, hsl(280 80% 60% / 0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "60%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, hsl(38 95% 60% / 0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
        {/* Grid de puntos */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>

      <div style={{
        width: "100%", maxWidth: 520, position: "relative", zIndex: 10,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 28,
        padding: "40px 40px 36px",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        {/* Barra arcoíris superior */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 80% 65%), hsl(200 80% 60%), hsl(160 70% 50%))",
        }} />

        {/* Indicador pulsante */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ position: "relative", width: 12, height: 12 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "hsl(12 85% 55%)",
              animation: "ping 1.5s ease-in-out infinite",
              opacity: 0.6,
            }} />
            <div style={{ position: "relative", width: 12, height: 12, borderRadius: "50%", background: "hsl(12 85% 60%)", boxShadow: "0 0 12px hsl(12 85% 55% / 0.8)" }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(38 95% 65%)", fontWeight: 600 }}>
            {locale === "es" ? "✦ Diseñando tu viaje" : "✦ Designing your trip"}
          </span>
        </div>

        {/* Ciudad */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: "clamp(2rem, 8vw, 3rem)",
          fontWeight: 600,
          fontStyle: "italic",
          lineHeight: 1.1,
          marginBottom: 8,
          backgroundImage: "linear-gradient(135deg, #fff 0%, hsl(38 95% 80%) 60%, hsl(12 85% 75%) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {city}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 32, fontStyle: "italic" }}>
          {steps[current]}
        </p>

        {/* Pasos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((step, i) => {
            const done    = i < current;
            const active  = i === current;
            const pending = i > current;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: done   ? "hsl(160 70% 50%)"
                              : active  ? "hsl(12 85% 60%)"
                              : "rgba(255,255,255,0.15)",
                  boxShadow: active ? "0 0 10px hsl(12 85% 60% / 0.8)" : "none",
                  transition: "all 0.4s",
                }} />
                {/* Línea de progreso */}
                <div style={{
                  flex: 1, height: 1,
                  background: done ? "rgba(255,255,255,0.12)" : "transparent",
                  transition: "background 0.4s",
                }} />
                {/* Texto */}
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: pending ? "rgba(255,255,255,0.2)" : done ? "rgba(255,255,255,0.6)" : "#fff",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.4s",
                  textAlign: "right",
                  flex: "0 0 auto",
                  maxWidth: 320,
                }}>
                  <span style={{ color: done ? "hsl(160 70% 50%)" : active ? "hsl(38 95% 65%)" : "rgba(255,255,255,0.2)", marginRight: 6 }}>
                    {String(i + 1).padStart(2, "0")} ·
                  </span>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Barra de progreso animada */}
        <div style={{ marginTop: 32, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${((current + 1) / steps.length) * 100}%`,
            background: "linear-gradient(90deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 70% 60%))",
            borderRadius: 2,
            transition: "width 1.2s ease",
            boxShadow: "0 0 12px hsl(12 85% 55% / 0.6)",
          }} />
        </div>

        <p style={{ marginTop: 18, fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.15em", textAlign: "center" }}>
          {locale === "es" ? "Esto suele tardar entre 8 y 15 segundos" : "Usually takes 8–15 seconds"}
        </p>
      </div>

      <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(2.2);opacity:0} }`}</style>
    </div>
  );
}
