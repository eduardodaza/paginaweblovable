// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/styles/itinerary-light.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
