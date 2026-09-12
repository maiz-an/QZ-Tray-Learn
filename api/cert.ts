import type { Request, Response } from "express";

export default function handler(_req: Request, res: Response) {
  const raw = process.env.QZ_CERTIFICATE;

  if (!raw) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "QZ_CERTIFICATE env var missing. Add it in Vercel → Settings → " +
          "Environment Variables (paste the full digital-certificate.txt)."
      );
  }

  /* Some Vercel UIs flatten multiline values — unescape if needed. */
  const cert = raw.replace(/\\n/g, "\n");

  res.type("text/plain").send(cert);
}