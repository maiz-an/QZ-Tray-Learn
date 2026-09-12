import type { Request, Response } from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function findPrivateKey(): string | null {
  const candidates = [
    path.join(process.cwd(), "certs", "private-key.pem"),
    path.join("/var/task", "certs", "private-key.pem"),
    path.join(__dirname, "..", "certs", "private-key.pem"),
    path.join(__dirname, "certs", "private-key.pem")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export default function handler(req: Request, res: Response) {
  const request = String(req.query.request ?? "");
  if (!request) {
    return res.status(400).type("text/plain").send("Missing request parameter");
  }

  const keyPath = findPrivateKey();
  if (!keyPath) {
    return res
      .status(500)
      .type("text/plain")
      .send(
        "private-key.pem not found. Make sure the certs/ folder is committed " +
          "and vercel.json includes it (functions.includeFiles)."
      );
  }

  try {
    const privateKey = fs.readFileSync(keyPath, "utf8");
    const signer = crypto.createSign("RSA-SHA512");
    signer.update(request);
    signer.end();
    const signature = signer.sign(privateKey, "base64");

    res.type("text/plain").send(signature);
  } catch (err) {
    console.error("Signing error:", err);
    res
      .status(500)
      .type("text/plain")
      .send("Signing failed. Check that private-key.pem is a valid PEM file.");
  }
}