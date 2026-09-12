import type { Request, Response } from "express";
import crypto from "node:crypto";

export default function handler(req: Request, res: Response) {
  const request = String(req.query.request ?? "");

  if (!request) {
    return res.status(400).type("text/plain").send("Missing request parameter");
  }

  const rawKey = process.env.QZ_PRIVATE_KEY;
  if (!rawKey) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "QZ_PRIVATE_KEY env var missing. Add it in Vercel → Settings → " +
          "Environment Variables (paste the full private-key.pem)."
      );
  }

  try {
    /* Some Vercel UIs flatten multiline values — unescape if needed. */
    const key = rawKey.replace(/\\n/g, "\n");

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