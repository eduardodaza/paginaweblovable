import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Wallet, Users, Heart, Loader2 } from "lucide-react";

type Day = { day: number; title: string; activities: string[] };

const SIM_RESULT = (dest: string): Day[] => [
  { day: 1, title: `Llegada a ${dest}`, activities: ["Check-in en hotel boutique", "Cena en restaurante local recomendado", "Paseo nocturno por el centro histórico"] },
  { day: 2, title: "Cultura e historia", activities: ["Tour guiado por monumentos icónicos", "Almuerzo típico", "Museo principal de la ciudad"] },
  { day: 3, title: "Aventura y naturaleza", activities: ["Excursión de día completo", "Mirador panorámico al atardecer", "Cena con vistas"] },
];

const INTERESTS = ["Cultura", "Gastronomía", "Naturaleza", "Aventura", "Playa", "Vida nocturna", "Familia", "Lujo"];

export function ItineraryGenerator() {
  const [destination, setDestination] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState("medio");
  const [travelers, setTravelers] = useState(2);
  const [selected, setSelected] = useState<string[]>(["Cultura", "Gastronomía"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Day[] | null>(null);

  const toggle = (i: string) => setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(SIM_RESULT(destination));
      setLoading(false);
    }, 1200);
  };

  return (
    <section id="generador" className="py-24 px-6 relative" style={{ background: "linear-gradient(180deg, transparent, oklch(0.96 0.02 220 / 0.5))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Generador con IA</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">Tu itinerario en segundos</h2>
          <p className="mt-4 text-muted-foreground">Cuéntanos tu viaje ideal y nuestra IA hace el resto.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.form
            onSubmit={generate}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl p-7 space-y-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Field icon={<MapPin className="w-4 h-4" />} label="Destino">
              <input required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ej. Tokio" className="w-full bg-transparent outline-none" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Calendar className="w-4 h-4" />} label="Salida">
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
              <Field icon={<Calendar className="w-4 h-4" />} label="Regreso">
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Wallet className="w-4 h-4" />} label="Presupuesto">
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-transparent outline-none">
                  <option value="bajo">Económico</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Premium</option>
                  <option value="lujo">Lujo</option>
                </select>
              </Field>
              <Field icon={<Users className="w-4 h-4" />} label="Viajeros">
                <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(+e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5" /> Intereses
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => {
                  const active = selected.includes(i);
                  return (
                    <button type="button" key={i} onClick={() => toggle(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-70 transition"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-premium)" }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</> : <><Sparkles className="w-4 h-4" /> Generar Itinerario</>}
            </button>
          </motion.form>

          <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-7 min-h-[400px]" style={{ boxShadow: "var(--shadow-card)" }}>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mb-4 text-primary/40" />
                  <p className="font-medium text-foreground">Tu itinerario aparecerá aquí</p>
                  <p className="text-sm mt-1">Completa el formulario y deja que la IA cree tu plan ideal.</p>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Creando tu viaje perfecto...</p>
                </motion.div>
              )}
              {result && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-xl font-bold">Itinerario para {destination}</h3>
                  {result.map((d, i) => (
                    <motion.div key={d.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="border-l-2 border-primary pl-4 py-2">
                      <div className="text-xs font-semibold text-primary">DÍA {d.day}</div>
                      <div className="font-semibold mt-0.5">{d.title}</div>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {d.activities.map((a) => <li key={a}>• {a}</li>)}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">{icon} {label}</span>
      <div className="px-4 py-3 rounded-xl bg-background border border-border focus-within:border-primary transition">{children}</div>
    </label>
  );
}
