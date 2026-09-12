import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";

function findCert(): string | null {
  const candidates = [
    path.join(process.cwd(), "certs", "digital-certificate.txt"),
    path.join("/var/task", "certs", "digital-certificate.txt"),
    path.join(__dirname, "..", "certs", "digital-certificate.txt"),
    path.join(__dirname, "certs", "digital-certificate.txt")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const filePath = findCert();

  if (!filePath) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("digital-certificate.txt not found. Check that certs/ is committed.");
    return;
  }

  try {
    const cert = fs.readFileSync(filePath, "utf8");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(cert);
  } catch (err) {
    console.error("Cert read error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Could not read certificate file.");
  }
}