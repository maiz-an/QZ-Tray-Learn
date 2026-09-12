import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const cert = process.env.QZ_CERTIFICATE;

  if (!cert) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "QZ_CERTIFICATE env var missing. Add it in Vercel → Settings → " +
          "Environment Variables (paste the full digital-certificate.txt)."
      );
  }

  res.type("text/plain").send(cert);
}