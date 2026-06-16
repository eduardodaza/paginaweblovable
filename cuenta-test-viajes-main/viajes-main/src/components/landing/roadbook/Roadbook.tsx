import { useState } from "react";
import {
  FileText,
  ClipboardCheck,
  CalendarDays,
  Star,
  Car,
  Lightbulb,
  UtensilsCrossed,
  ThumbsUp,
  ChevronDown,
  Ticket,
  Hand,
  Sun,
  Moon,
} from "lucide-react";

/* ---------- DATA ---------- */
const SIDEBAR = [
  { id: "descripcion", label: "Descripción general", icon: FileText },
  { id: "preparacion", label: "Preparación", icon: ClipboardCheck },
  { id: "itinerario", label: "Itinerario", icon: CalendarDays, expandable: true },
  { id: "actividades", label: "Actividades", icon: Star },
  { id: "coche", label: "Coche", icon: Car },
  { id: "consejos", label: "Consejos", icon: Lightbulb },
  { id: "gastronomia", label: "Gastronomía", icon: UtensilsCrossed },
  { id: "porque", label: "Por qué elegirnos", icon: ThumbsUp },
];

const DAYS = [
  {
    day: 1,
    title: "Llegada a París y encanto en Le Marais",
    locations: ["Aeropuerto Charles de Gaulle", "Le Marais", "Place des Vosges"],
    level: "Moderado",
    items: [
      {
        time: "10:00 - 11:30",
        duration: "1.5 horas",
        title: "Llegada al Aeropuerto de París-Charles de Gaulle",
        desc: "¡Bienvenidos a París! A su llegada, recojan su equipaje y diríjanse a su alojamiento para comenzar su aventura en la capital francesa.",
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
      },
      {
        time: "15:00 - 17:30",
        duration: "2.5 horas",
        title: "Paseo por el histórico barrio de Le Marais",
        desc: "Exploren uno de los barrios más vibrantes y con más historia de París. Piérdanse por sus calles medievales, descubran boutiques de moda, galerías de arte y acogedores cafés.",
        img: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=600&q=80",
        tip: "Prueba un auténtico falafel en la Rue des Rosiers, es un clásico del barrio.",
        cta: "Descubre Le Marais y sus sabores en un tour guiado con vino y queso.",
      },
    ],
  },
];

const EVENTOS = [
  {
    tag: "Monumentos",
    title: "Recorrido a pie por Le Marais con degustación de vino y queso",
    desc: "¡Disfruta de los sabores locales con esta visita guiada de 2 horas por Le Marais con degustaciones de vino y queso!",
    img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80",
    rating: "5/5",
    reviews: 1,
    price: "COL$ 376757.00",
  },
  {
    tag: "Atracciones y visitas guiadas",
    title: "Visita guiada privada al Museo del Louvre con entrada reservada",
    desc: "Reserva una visita privada al Museo del Louvre para descubrir lo más destacado: la Mona Lisa, la Venus de Milo, la Victoria de Samotracia, los Esclavos de Miguel Ángel...",
    img: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800&q=80",
    rating: "5/5",
    reviews: 1,
    price: "COL$ 394926.00",
  },
  {
    tag: "Arte y cultura",
    title: "Entradas para el Museo de Orsay con audioguía incluida",
    desc: "Sumérgete en el mundo impresionista con obras de Van Gogh, Monet y Degas en uno de los museos más bellos de París.",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    rating: "4.8/5",
    reviews: 124,
    price: "COL$ 89500.00",
  },
  {
    tag: "Tours panorámicos",
    title: "Subida a la Torre Eiffel con acceso prioritario al segundo piso",
    desc: "Disfruta de vistas inigualables de París desde el ícono más famoso de la ciudad, sin las largas filas habituales.",
    img: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80",
    rating: "4.9/5",
    reviews: 482,
    price: "COL$ 215300.00",
  },
];

const GASTRO = [
  {
    tag: "Bistró tradicional",
    title: "Le Petit Marché",
    desc: "Un acogedor bistró en pleno Marais. Cocina francesa de mercado con productos de temporada.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    rating: "4.7/5",
    reviews: 320,
    price: "COL$ 180000.00",
  },
  {
    tag: "Panadería",
    title: "Du Pain et des Idées",
    desc: "Una de las panaderías más célebres de París. Imprescindible probar su pan de chocolate y pistacho.",
    img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=800&q=80",
    rating: "4.9/5",
    reviews: 1240,
    price: "COL$ 25000.00",
  },
];

/* ---------- COMPONENT ---------- */
export function Roadbook() {
  const [active, setActive] = useState("itinerario");
  const [itineraryOpen, setItineraryOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 py-8">
        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "var(--accent-coral, #f97316)" }}
              >
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-base truncate">Smart Travel Roadbook</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-green-500 text-green-500" />
                  <span>4.4 en Trustpilot</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Referencia: 2026STMPQAW</div>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {SIDEBAR.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.expandable && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${itineraryOpen ? "rotate-180" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setItineraryOpen(!itineraryOpen);
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={toggleTheme}
              className="mt-5 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === "light" ? "Modo nocturno" : "Modo diurno"}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="space-y-10 min-w-0">
          {/* Totals card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between border-b border-border">
              <span className="text-sm text-muted-foreground">Eventos y actividades</span>
              <span className="text-sm font-semibold">COL$ 1,300,000</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between bg-muted/40">
              <span className="text-sm font-semibold">Total estimado</span>
              <span className="text-lg font-bold">COL$ 15,200,000</span>
            </div>
          </div>

          {/* ITINERARIO */}
          <section id="itinerario">
            {DAYS.map((d) => (
              <article key={d.day} className="space-y-4">
                <header className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: "var(--accent-coral, #f97316)" }}
                  >
                    {d.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold">
                      Día {d.day} · {d.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{d.locations.join(" · ")}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300 shrink-0">
                    {d.level}
                  </span>
                </header>

                <div className="relative pl-6 border-l-2 border-dashed border-border ml-5 space-y-6">
                  {d.items.map((it, idx) => (
                    <div key={idx} className="relative">
                      <span
                        className="absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-background"
                        style={{ borderColor: "var(--accent-coral, #f97316)" }}
                      />
                      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={it.img}
                            alt={it.title}
                            loading="lazy"
                            className="w-full md:w-44 h-32 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-primary">
                              {it.time} · {it.duration}
                            </div>
                            <h4 className="font-bold mt-1">{it.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{it.desc}</p>
                          </div>
                        </div>

                        {it.tip && (
                          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-500/10">
                            <UtensilsCrossed className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-900 dark:text-amber-200">{it.tip}</p>
                          </div>
                        )}

                        {it.cta && (
                          <button
                            className="mt-3 w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
                            style={{ background: "var(--accent-coral, #f97316)" }}
                          >
                            <Ticket className="w-4 h-4" />
                            <span className="flex-1 text-center">{it.cta}</span>
                            <Hand className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          {/* EVENTOS */}
          <CardSection
            id="actividades"
            title="Eventos y actividades"
            note={
              <>
                Introduce el código <b className="text-primary">SMART10</b> al finalizar la compra para disfrutar de tu{" "}
                <b className="text-primary">10% de descuento</b> exclusivo.
              </>
            }
            items={EVENTOS}
          />

          {/* GASTRONOMIA */}
          <CardSection id="gastronomia" title="Gastronomía" items={GASTRO} />
        </main>
      </div>
    </div>
  );
}

/* ---------- Reusable card grid ---------- */
type CardItem = {
  tag: string;
  title: string;
  desc: string;
  img: string;
  rating: string;
  reviews: number;
  price: string;
};

function CardSection({
  id,
  title,
  note,
  items,
}: {
  id: string;
  title: string;
  note?: React.ReactNode;
  items: CardItem[];
}) {
  return (
    <section id={id}>
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {note && <p className="text-sm text-muted-foreground mb-5">{note}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((c) => (
          <article
            key={c.title}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img src={c.img} alt={c.title} loading="lazy" className="w-full h-48 object-cover" />
            <div className="p-5">
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-md text-white mb-3"
                style={{ background: "var(--accent-coral, #f97316)" }}
              >
                {c.tag}
              </span>
              <h4 className="font-bold leading-snug">{c.title}</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">{c.desc}</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{c.rating}</span>
                  <span className="text-muted-foreground">({c.reviews})</span>
                </div>
                <div className="text-muted-foreground">
                  Desde <span className="font-bold text-orange-600">{c.price}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
