/**
 * Local Express server — for `npm run dev` and `npm start`.
 * Not used by Vercel (that runs api/*.ts instead).
 */

import express, { type Request, type Response, type NextFunction } from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(BASE_DIR, "dist");
const CERTS_DIR = path.join(BASE_DIR, "certs");

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

const CERT_FILE =
  process.env.QZ_CERT_FILE || path.join(CERTS_DIR, "digital-certificate.txt");
const PRIVATE_KEY_FILE =
  process.env.QZ_PRIVATE_KEY_FILE || path.join(CERTS_DIR, "private-key.pem");
const LOGO_URL = process.env.LOGO_URL || "";

const app = express();
app.disable("x-powered-by");

/* CORS: allow Vite dev server on :5173 in dev; set CORS_ORIGIN in prod */
const CORS_ORIGIN =
  process.env.CORS_ORIGIN || (IS_PROD ? "" : "http://localhost:5173");

app.use((_req: Request, res: Response, next: NextFunction) => {
  if (CORS_ORIGIN) {
    res.header("Access-Control-Allow-Origin", CORS_ORIGIN);
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ---- /digital-certificate.txt ---- */
app.get("/digital-certificate.txt", (_req: Request, res: Response) => {
  try {
    const cert = fs.readFileSync(CERT_FILE, "utf8");
    res.type("text/plain").send(cert);
  } catch (error) {
    console.error("Certificate error:", (error as Error).message);
    res
      .status(500)
      .type("text/plain")
      .send(
        "digital-certificate.txt not found. See README.md → " +
          "'Generate your own certificate (free)' to create one."
      );
  }
});

/* ---- /sign-message ---- */
app.get("/sign-message", (req: Request, res: Response) => {
  try {
    const request = String(req.query.request ?? "");
    if (!request) {
      return res.status(400).type("text/plain").send("Missing request parameter");
    }

    const privateKey = fs.readFileSync(PRIVATE_KEY_FILE, "utf8");
    const signer = crypto.createSign("RSA-SHA512");
    signer.update(request);
    signer.end();
    const signature = signer.sign(privateKey, "base64");

    res.type("text/plain").send(signature);
  } catch (error) {
    console.error("Signing error:", (error as Error).message);
    res
      .status(500)
      .type("text/plain")
      .send(
        "Failed to sign QZ request. Is private-key.pem present in /certs? " +
          "See README.md → 'Generate your own certificate (free)'."
      );
  }
});

/* ---- /logo-base64 (optional) ---- */
app.get("/logo-base64", async (_req: Request, res: Response) => {
  if (!LOGO_URL) return res.status(404).type("text/plain").send("");
  try {
    const response = await fetch(LOGO_URL);
    if (!response.ok) throw new Error(`Logo request failed: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.type("text/plain").send(buffer.toString("base64"));
  } catch (error) {
    console.error("Logo error:", (error as Error).message);
    res.status(500).type("text/plain").send("");
  }
});

/* ---- Static client (only when /dist exists) ---- */
if (fs.existsSync(DIST_DIR)) {
  app.use(
    "/assets",
    express.static(path.join(DIST_DIR, "assets"), {
      immutable: true,
      maxAge: "1y"
    })
  );
  app.use(express.static(DIST_DIR, { maxAge: IS_PROD ? "1h" : 0 }));

  /* Express 5 SPA fallback — /*splat (named wildcard) */
  app.get("/*splat", (req: Request, res: Response, next: NextFunction) => {
    if (
      req.path.startsWith("/digital-certificate.txt") ||
      req.path.startsWith("/sign-message") ||
      req.path.startsWith("/logo-base64") ||
      req.path.startsWith("/assets")
    ) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

/* ---- 404 + error handlers ---- */
app.use((req: Request, res: Response) => {
  res.status(404).type("text/plain").send(`Not found: ${req.method} ${req.path}`);
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).type("text/plain").send("Internal server error");
  }
);

/* ---- Start ---- */
const server = app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log(" QZ-Tray-Learn  (local)");
  console.log("==========================================");
  console.log("");
  console.log(`Mode:      ${NODE_ENV}`);
  console.log(`Listening: http://localhost:${PORT}`);
  if (fs.existsSync(DIST_DIR)) console.log("Client:    served from /dist");
  else console.log("Client:    http://localhost:5173 (Vite dev)");
  if (!fs.existsSync(CERT_FILE) || !fs.existsSync(PRIVATE_KEY_FILE)) {
    console.log("");
    console.log("⚠️  No certs found in /certs — silent printing will fail.");
  }
  console.log("");
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received — shutting down…`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));