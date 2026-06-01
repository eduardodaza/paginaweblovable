import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Wallet, Users, Heart, Loader2 } from "lucide-react";
import type { ItineraryData } from "@/lib/types";

const INTERESTS = ["Cultura", "Gastronomía", "Naturaleza", "Aventura", "Playa", "Vida nocturna", "Familia", "Lujo"];

const BUDGET_MAP: Record<string, string> = {
  bajo: "economico",
  medio: "moderado",
  alto: "premium",
  lujo: "lujo",
};

export function ItineraryGenerator() {
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState("medio");
  const [travelers, setTravelers] = useState(2);
  const [selected, setSelected] = useState<string[]>(["Cultura", "Gastronomía"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const calcDays = () => {
    if (!start || !end) return 3;
    const diff = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / 86400000
    );
    return diff > 0 ? diff : 3;
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: destination,
          country: country || destination,
          startDate: start || new Date().toISOString().slice(0, 10),
          endDate:
            end ||
            new Date(Date.now() + calcDays() * 86400000)
              .toISOString()
              .slice(0, 10),
          days: calcDays(),
          budget: BUDGET_MAP[budget] ?? "moderado",
          travelers,
          travelerType: "pareja",
          interests: selected,
          locale: "es",
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ItineraryData = await res.json();
      setResult(data);
    } catch {
      setError("No se pudo generar el itinerario. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="generador"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, transparent, oklch(0.96 0.02 220 / 0.5))",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Generador con IA
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Tu itinerario en segundos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cuéntanos tu viaje ideal y nuestra IA hace el resto.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={generate}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl p-7 space-y-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Field icon={<MapPin className="w-4 h-4" />} label="Ciudad">
              <input
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej. Tokio"
                className="w-full bg-transparent outline-none"
              />
            </Field>

            <Field icon={<MapPin className="w-4 h-4" />} label="País">
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ej. Japón"
                className="w-full bg-transparent outline-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Calendar className="w-4 h-4" />} label="Salida">
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
              </Field>
              <Field icon={<Calendar className="w-4 h-4" />} label="Regreso">
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Wallet className="w-4 h-4" />} label="Presupuesto">
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="bajo">Económico</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Premium</option>
                  <option value="lujo">Lujo</option>
                </select>
              </Field>
              <Field icon={<Users className="w-4 h-4" />} label="Viajeros">
                <input
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={(e) => setTravelers(+e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
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
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggle(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-70 transition"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-premium)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generar Itinerario
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </motion.form>

          {/* Result panel */}
          <div
            className="lg:col-span-3 bg-card border border-border rounded-3xl p-7 min-h-[400px]"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground"
                >
                  <Sparkles className="w-12 h-12 mb-4 text-primary/40" />
                  <p className="font-medium text-foreground">
                    Tu itinerario aparecerá aquí
                  </p>
                  <p className="text-sm mt-1">
                    Completa el formulario y deja que la IA cree tu plan ideal.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Creando tu viaje perfecto...
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 overflow-y-auto max-h-[580px] pr-1"
                >
                  <div>
                    <h3 className="text-xl font-bold">
                      {result.city}, {result.country}
                    </h3>
                    {result.tagline && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        {result.tagline}
                      </p>
                    )}
                  </div>

                  {result.days.map((d, i) => (
                    <motion.div
                      key={d.dayNum}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="border-l-2 border-primary pl-4 py-2"
                    >
                      <div className="text-xs font-semibold text-primary">
                        DÍA {d.dayNum} · {d.date}
                      </div>
                      <div className="font-semibold mt-0.5">{d.theme}</div>
                      {d.zone && (
                        <div className="text-xs text-muted-foreground mb-2">
                          {d.zone}
                        </div>
                      )}
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {d.items.slice(0, 5).map((item) => (
                          <li key={item.id} className="flex gap-2">
                            <span className="font-mono text-[10px] opacity-60 pt-0.5 shrink-0">
                              {item.time}
                            </span>
                            <span>{item.name}</span>
                          </li>
                        ))}
                        {d.items.length > 5 && (
                          <li className="text-xs opacity-50">
                            +{d.items.length - 5} actividades más…
                          </li>
                        )}
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

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
        {icon} {label}
      </span>
      <div className="px-4 py-3 rounded-xl bg-background border border-border focus-within:border-primary transition">
        {children}
      </div>
    </label>
  );
}
