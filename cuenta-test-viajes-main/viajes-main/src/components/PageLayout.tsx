import Head from "next/head";
import Link from "next/link";
import { Plane } from "lucide-react";

interface Props { title: string; description: string; children: React.ReactNode; }

export function PageLayout({ title, description, children }: Props) {
  const s = {
    h2: { fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 700, color: "#fff", marginBottom: 12, marginTop: 40, lineHeight: 1.2 } as React.CSSProperties,
    h3: { fontSize: "clamp(1rem,2.5vw,1.2rem)", fontWeight: 600, color: "hsl(38 95% 65%)", marginBottom: 8, marginTop: 28 } as React.CSSProperties,
    p:  { fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: 12 } as React.CSSProperties,
    li: { fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 6, paddingLeft: 4 } as React.CSSProperties,
    a:  { color: "hsl(12 85% 65%)", textDecoration: "none" } as React.CSSProperties,
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "24px 28px", marginBottom: 16 } as React.CSSProperties,
    badge: { display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "hsl(12 85% 55%/0.15)", border: "1px solid hsl(12 85% 55%/0.3)", color: "hsl(12 85% 65%)", fontSize: 12, fontWeight: 600, marginRight: 8, marginBottom: 8 } as React.CSSProperties,
    input: { width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" },
    btn: { display: "inline-block", padding: "13px 32px", borderRadius: 20, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", boxShadow: "0 6px 20px hsl(12 85% 55%/0.4)" } as React.CSSProperties,
  };

  return (
    <>
      <Head>
        <title>{title} — Smart Travel</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${title} — Smart Travel`} />
        <meta property="og:description" content={description} />
      </Head>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, hsl(240 45% 8%) 0%, hsl(260 55% 14%) 40%, hsl(220 50% 9%) 100%)", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>
        {/* Orbes */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, hsl(12 90% 55%/0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, hsl(280 80% 60%/0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        {/* Navbar */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,8,25,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 60%))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Plane style={{ width: 18, height: 18, color: "#fff" }} />
              </span>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>Smart <span style={{ color: "hsl(12 85% 65%)" }}>Travel</span></span>
            </Link>
            <Link href="/#generador" style={{ padding: "9px 22px", borderRadius: 20, background: "linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%))", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px hsl(12 85% 55%/0.4)" }}>
              Crear itinerario
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <main style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <span>© {new Date().getFullYear()} Smart Travel</span>
            <Link href="/privacidad" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacidad</Link>
            <Link href="/terminos" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Términos</Link>
            <Link href="/ayuda" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Ayuda</Link>
            <Link href="/contacto" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Contacto</Link>
          </div>
        </footer>
      </div>

      {/* Styles globales para páginas */}
      <style global jsx>{`
        .page-h2 { font-size: clamp(1.5rem,4vw,2.2rem); font-weight: 700; color: #fff; margin-bottom: 12px; margin-top: 40px; line-height: 1.2; }
        .page-h3 { font-size: 1.1rem; font-weight: 600; color: hsl(38 95% 65%); margin-bottom: 8px; margin-top: 28px; }
        .page-p  { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.85; margin-bottom: 14px; }
        .page-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px 28px; margin-bottom: 16px; }
        .page-input { width: 100%; padding: 12px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; font-size: 14px; outline: none; box-sizing: border-box; font-family: inherit; margin-bottom: 12px; }
        .page-input::placeholder { color: rgba(255,255,255,0.3); }
        .page-textarea { width: 100%; padding: 12px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: #fff; font-size: 14px; outline: none; box-sizing: border-box; font-family: inherit; min-height: 120px; resize: vertical; }
        .page-textarea::placeholder { color: rgba(255,255,255,0.3); }
        .page-btn { display: inline-block; padding: 13px 32px; border-radius: 20px; background: linear-gradient(135deg,hsl(12 85% 55%),hsl(38 95% 58%)); color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; border: none; box-shadow: 0 6px 20px hsl(12 85% 55%/0.4); font-family: inherit; transition: transform 0.15s; }
        .page-btn:hover { transform: scale(1.02); }
        .page-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; background: hsl(12 85% 55%/0.15); border: 1px solid hsl(12 85% 55%/0.3); color: hsl(12 85% 65%); font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; }
        .page-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 36px 0; }
        ul.page-ul { padding-left: 20px; }
        ul.page-ul li { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 8px; }
      `}</style>
    </>
  );
}
