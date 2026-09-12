import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const request = String(req.query.request ?? "");

  if (!request) {
    return res.status(400).type("text/plain").send("Missing request parameter");
  }

  const privateKey = process.env.QZ_PRIVATE_KEY;
  if (!privateKey) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "QZ_PRIVATE_KEY env var missing. Add it in Vercel → Settings → " +
          "Environment Variables (paste the full private-key.pem)."
      );
  }

  try {
    /* Vercel env vars preserve real newlines, but some paste tools
       escape them — normalize both cases. */
    const key = privateKey.replace(/\\n/g, "\n");

    const signer = crypto.createSign("RSA-SHA512");
    signer.update(request);
    signer.end();
    const signature = signer.sign(key, "base64");

    res.type("text/plain").send(signature);
  } catch (err) {
    console.error("Signing error:", err);
    res
      .status(500)
      .type("text/plain")
      .send("Signing failed. Check that QZ_PRIVATE_KEY is a valid PEM.");
  }
}