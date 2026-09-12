import type { VercelRequest, VercelResponse } from "@vercel/node";
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const request = String(req.query?.request ?? "");

  if (!request) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("Missing request parameter");
    return;
  }

  const keyPath = findPrivateKey();
  if (!keyPath) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("private-key.pem not found. Check that certs/ is committed.");
    return;
  }

  try {
    const privateKey = fs.readFileSync(keyPath, "utf8");
    const signer = crypto.createSign("RSA-SHA512");
    signer.update(request);
    signer.end();
    const signature = signer.sign(privateKey, "base64");

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(signature);
  } catch (err) {
    console.error("Signing error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Signing failed. Check that private-key.pem is a valid PEM.");
  }
}