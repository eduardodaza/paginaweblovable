import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/50"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <Plane className="w-5 h-5" />
          </span>
          <span>Smart Travel</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <li><a href="#destinos" className="hover:text-foreground transition">Destinos</a></li>
          <li><a href="#generador" className="hover:text-foreground transition">Generador IA</a></li>
          <li><a href="/roadbook" className="hover:text-foreground transition">Roadbook</a></li>
          <li><a href="#blog" className="hover:text-foreground transition">Blog</a></li>
          <li><a href="#demo" className="hover:text-foreground transition">Demo</a></li>
        </ul>
        <a href="#generador" className="text-sm font-semibold px-5 py-2.5 rounded-full text-primary-foreground shadow-md hover:opacity-90 transition" style={{ background: "var(--gradient-hero)" }}>
          Crear itinerario
        </a>
      </nav>
    </motion.header>
  );
}
