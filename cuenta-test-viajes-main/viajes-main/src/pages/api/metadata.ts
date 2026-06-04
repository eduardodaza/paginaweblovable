// src/pages/api/metadata.ts
// Endpoint independiente que genera SOLO restaurantes.
// Se llama desde el botón "Reintentar" en ItineraryView cuando
// la generación inicial falla por rate limit de Groq.

import type { NextApiRequest, NextApiResponse } from "next";
import type { TripFormData } from "@/lib/types";
import { buildMetadataPrompt } from "@/lib/prompt";

async function callGroq(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: maxTokens,
      temperature: 0.6,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq error ${res.status}: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

function extractJSON(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found");
  return raw.slice(start, end + 1);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = req.body as TripFormData;
  if (!form?.city) return res.status(400).json({ error: "Missing form data" });

  try {
    const raw = await callGroq(buildMetadataPrompt(form), 3000);
    const jsonStr = extractJSON(raw);
    const metadata = JSON.parse(jsonStr);
    return res.status(200).json({
      restaurants: metadata.restaurants ?? [],
      alerts: metadata.alerts ?? [],
    });
  } catch (err) {
    console.error("[metadata-endpoint] failed:", err);
    return res.status(500).json({ error: String(err) });
  }
}

export const config = { api: { responseLimit: "4mb" } };
