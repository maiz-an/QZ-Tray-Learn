import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

/* Try every plausible location for the cert. Vercel puts deployed
   files under /var/task (which is process.cwd()), local dev uses
   the repo root. */
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

export default function handler(_req: Request, res: Response) {
  const filePath = findCert();

  if (!filePath) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "digital-certificate.txt not found. Make sure the certs/ folder " +
          "is committed and that vercel.json includes it (functions.includeFiles)."
      );
  }

  try {
    const cert = fs.readFileSync(filePath, "utf8");
    res.type("text/plain").send(cert);
  } catch (err) {
    console.error("Cert read error:", err);
    res.status(500).type("text/plain").send("Could not read certificate file.");
  }
}