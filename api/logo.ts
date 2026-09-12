import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const logoUrl = process.env.LOGO_URL;
  if (!logoUrl) return res.status(404).type("text/plain").send("");

  try {
    const r = await fetch(logoUrl);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    res.type("text/plain").send(buf.toString("base64"));
  } catch (err) {
    console.error("Logo error:", err);
    res.status(500).type("text/plain").send("");
  }
}