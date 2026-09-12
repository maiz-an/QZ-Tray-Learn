# QZ-Tray-Learn

A complete, well-commented learning example for **[QZ Tray](https://qz.io)**:
connect from the browser, list installed printers, and **silently** print
an 80mm thermal receipt — no "Allow / Block" popup after the first
handshake — using a signed certificate and a tiny Express backend.

Fork it, edit `receipt-config.js`, and you have a working receipt printer
for your own POS, kiosk, or restaurant project in minutes.

**Repo:** <https://github.com/maiz-an/QZ-Tray-Learn.git>

![status](https://img.shields.io/badge/status-learning%20project-blue)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

1. [What this project teaches](#what-this-project-teaches)
2. [What's in the box](#whats-in-the-box)
3. [Prerequisites](#prerequisites)
4. [Quick start (5 minutes)](#quick-start-5-minutes)
5. [QZ Tray — install and verify](#qz-tray--install-and-verify)
6. [Certificate setup (for silent printing)](#certificate-setup-for-silent-printing)
7. [Running the app](#running-the-app)
8. [Using the app — every button explained](#using-the-app--every-button-explained)
9. [Testing without a real printer](#testing-without-a-real-printer)
10. [Customizing the receipt](#customizing-the-receipt)
11. [Environment variables](#environment-variables)
12. [How the code works (behind the scenes)](#how-the-code-works-behind-the-scenes)
13. [Troubleshooting](#troubleshooting)
14. [Deploying to production](#deploying-to-production)
15. [Security notes](#security-notes)
16. [License](#license)

---

## What this project teaches

- **What QZ Tray is** and why a browser can't talk to a USB printer on its own
- **How silent printing works** (certificate + signed requests)
- **How to generate a free local certificate** with QZ Tray's Site Manager
- **How to build an 80mm receipt** with HTML/CSS that prints correctly on a
  thermal printer, including bilingual (English + Arabic) content
- **How to print from the browser through a tiny Express backend** that keeps
  the private key off the client
- **How to test without a physical printer** using *Microsoft Print to PDF*

---

## What's in the box

```
qz-tray-learn/
├── server.js                  # Express: serves the page, hands out the
│                              # public cert, and signs QZ requests
├── public/                    # Everything the browser loads
│   ├── index.html             # The console UI (connect, list, preview, print)
│   ├── receipt-config.js      # ← edit this first — business, items, font, etc.
│   └── receipt-template.js    # Renders config into HTML that QZ prints
├── certs/                     # Your QZ Tray key pair goes here (git-ignored)
│   ├── digital-certificate.txt
│   └── private-key.pem
├── .env.example               # Optional env overrides
├── .gitignore                 # Already ignores node_modules/, certs/, .env
├── package.json
└── README.md                  # You are here
```

---

## Prerequisites

| What | Version | Where |
|---|---|---|
| **Node.js** | 18 or newer | <https://nodejs.org/> |
| **QZ Tray** | Any recent version | <https://qz.io/download/> |
| **A printer** | Optional — Microsoft Print to PDF works | — |

Node 18 is required because `server.js` uses the built-in `fetch()`
(for the optional logo proxy).

---

## Quick start (5 minutes)

```bash
git clone https://github.com/maiz-an/QZ-Tray-Learn.git
cd QZ-Tray-Learn
npm install
npm start
```

Then:

1. Make sure **QZ Tray is running** (system tray / menu bar — see the next
   section for how to check).
2. Open **<http://localhost:3000>**.
3. Click **reconnect_qz** — a green toast says "QZ Tray connected."
4. Click **scan_printers** — your installed printers appear.
5. Click **print_80mm ▸** on any printer.

If QZ Tray isn't running, step 3 will show a red toast
"QZ Tray connection failed" — jump to
[QZ Tray — install and verify](#qz-tray--install-and-verify).

**You will see an Allow/Block popup the first time.** That's expected —
click **Allow**, check **Remember this decision**, and it never appears
again. To get rid of it *without* even the first popup, set up a certificate
(see [Certificate setup](#certificate-setup-for-silent-printing)).

---

## QZ Tray — install and verify

### What is QZ Tray?

QZ Tray is a free desktop application that runs on the **same machine as the
printer**. It opens a WebSocket server on `localhost` and exposes APIs that a
web page can call to list printers and send print jobs — something a browser
alone cannot do for security reasons.

The flow is:

```
  Browser  ←→  QZ Tray (localhost WebSocket)  ←→  Your OS print spooler  ←→  Printer
```

### Install it

1. Download the installer for your OS: <https://qz.io/download/>
2. Run the installer, accept defaults, finish.
3. QZ Tray launches automatically and lives in the **system tray** (Windows)
   or **menu bar** (macOS) — it's a background service, not a window.

### Verify it's running

| OS | Where to look |
|---|---|
| Windows | System tray (bottom-right of the taskbar) — you'll see a **QZ** icon. If it's hidden, click the ▲ arrow. |
| macOS | Menu bar (top-right) — a **QZ** icon. |
| Linux | Usually system tray or top-right corner depending on the desktop environment. |

**Right-click the icon** — the menu should have items like *About*,
*Advanced*, *Reload*, *Exit*. If you see that menu, QZ Tray is running.

### What happens if QZ Tray is not running?

When you click **reconnect_qz** with QZ Tray stopped, you'll see:

- A red toast: **"QZ Tray connection failed"** with a `websocket error` in
  the details.
- A console error: **`Failed to open WebSocket: ws://localhost:8182`**
- The **TARGETS** panel stays empty.

**Fix:** start QZ Tray from the Start menu (Windows) or Applications
(macOS). Then click **reconnect_qz** again. No need to reload the page.

> **Tip:** QZ Tray opens port **8182** on `localhost`. If that port is
> blocked by a firewall or another app is using it, connection will fail
> even if QZ is running. Check with `netstat -an | findstr 8182` (Windows)
> or `lsof -i :8182` (macOS/Linux).

---

## Certificate setup (for silent printing)

This is the most important section — read it if you want to understand
**how silent printing actually works**.

### Why you need a certificate

By default, QZ Tray asks the user "Allow this website to use your printer?"
**on every print**. That's a reasonable default (it stops a malicious page
from printing 500 pages). For a POS or kiosk, it's unusable.

The solution:

1. You generate a **certificate** (public) + **private key** (secret).
2. You tell QZ Tray to trust that certificate.
3. For every print request, the page asks your server to **sign** the
   request with the private key.
4. QZ Tray verifies the signature against the trusted certificate and
   silently lets it through.

The private key **never touches the browser** — it stays on the server.

### Generate a free certificate (2 minutes)

QZ Tray includes a built-in **Demo Keys** generator. It's free, instant,
and trusted by QZ Tray on *your* machine only. (For a certificate trusted
across all machines — e.g. for a public web app — see
[QZ's paid Premium Support](https://qz.io/login).)

**Steps:**

1. **Right-click the QZ Tray icon** → **Advanced** → **Site Manager**.
2. Click **+** (bottom-left) → **Create New**.
3. Click **Yes** to generate a new key pair.
4. Click **Yes** to install the certificate automatically.
5. Click **Yes** to copy it to `override.crt`.
6. Approve the OS permission prompt (Administrator / UAC on Windows).
7. QZ Tray places a folder called **`QZ Tray Demo Cert`** on your
   **Desktop**. Inside:
   - `digital-certificate.txt` — the public certificate
   - `private-key.pem` — the private key

### Install it in the project

Copy both files into this project's `certs/` folder:

```
qz-tray-learn/
├── certs/
│   ├── digital-certificate.txt     ← from your Desktop
│   └── private-key.pem             ← from your Desktop
```

Then **restart the server** (`Ctrl+C` in the terminal, then `npm start`) and
reload the page. The popup will be gone.

### Verify it works

Open DevTools → Network tab → reload the page. You should see:

- `digital-certificate.txt` — status 200, contains the PEM certificate
- Every print makes a request to `/sign-message?request=...` with status 200

If `/digital-certificate.txt` returns 500, the file isn't in the right
place. If `/sign-message` returns 500, `private-key.pem` is missing or
corrupt.

### 🔒 Keep your private key private

`private-key.pem` can sign any QZ request on your behalf — **treat it like
a password**.

- `.gitignore` already excludes `certs/` — **don't force-add it**.
- Never paste it into an issue, PR, chat, or commit message.
- If you suspect it leaked: open Site Manager, delete the entry, and
  generate a new pair.

---

## Running the app

```bash
npm start
```

Expected console output:

```
==========================================
 QZ-Tray-Learn
==========================================

Open: http://localhost:3000

⚠️  No certs found in /certs — silent printing will fail.
   See README.md → 'Generate your own certificate (free)'.
```

The warning disappears once `certs/` has both files.

**Dev mode** — auto-restart on file changes:

```bash
npm run dev
```

**Change the port:**

```bash
PORT=4000 npm start          # macOS / Linux
set PORT=4000 && npm start   # Windows cmd
$env:PORT=4000; npm start    # Windows PowerShell
```

---

## Using the app — every button explained

Open **<http://localhost:3000>**. You'll see three buttons at the top and a
list of "targets" (printers) below.

### `↻ reconnect_qz`

1. Opens the WebSocket connection to QZ Tray (`ws://localhost:8182`).
2. On success: shows a green toast "QZ Tray connected."
3. Automatically calls `scan_printers` (below) so the printer list populates.

**When to click it:** after starting QZ Tray, after restarting QZ Tray, or
any time the printer list looks stale.

### `↻ scan_printers`

Queries QZ Tray for the list of printers installed on this machine and
rebuilds the **TARGETS** list.

Each row shows:

- **01, 02, 03…** — the index in the OS printer list
- **Printer name** — exactly as Windows/macOS reports it
- **print_80mm ▸** button — prints the receipt to this specific printer

### `👁 preview_receipt`

Opens a modal showing **exactly** what will print, rendered at real physical
size (80 mm wide). Use it to catch layout problems *before* wasting paper.

The preview:

- Matches the printer's paper width (set in `receipt-config.js`)
- Sizes itself automatically to the height of the receipt
- Uses a lightweight visual override so the content appears centred
  (the printed version uses the printer's own dead-zone offset instead)

Press **Esc** or click outside the modal to close it.

### `print_80mm ▸` (per printer)

Sends the current receipt to **that specific printer**.

What happens on the wire:

1. The browser builds the receipt HTML from `receipt-config.js`.
2. Any remote images (like a logo URL) are fetched and inlined as
   `data:` URIs so the printer doesn't need network access.
3. The HTML is measured in a hidden iframe to compute the receipt height.
4. The receipt + page size are sent to QZ Tray, which asks the server for
   a signature.
5. The server signs with `private-key.pem` and returns the base64 signature.
6. QZ Tray verifies it against `digital-certificate.txt`, then hands the
   job to the OS spooler.

You'll see toast messages and console logs at each step.

---

## Testing without a real printer

You don't need a thermal printer to try this.

### Option 1 — Microsoft Print to PDF (Windows)

Select **Microsoft Print to PDF** in the TARGETS list, click
**print_80mm ▸**, save the PDF, and open it.

**One-time setup required** — Windows needs a custom paper size:

1. **Settings → Bluetooth & devices → Printers & scanners**
2. Click **Microsoft Print to PDF** → **Printer properties**
3. **Preferences → Advanced → Paper Size → New**
4. Name it **80mm Roll**, size **80 mm × 297 mm**
5. Save.

Without this, PDF jobs default to A4 or Letter — you'll see a mostly-blank
page with a tiny receipt in the top-left corner.

### Option 2 — Any network printer

Send the receipt to any printer you have, even a laser printer. The
80 mm layout will fit on the left side of an A4 page; useful for checking
alignment and text quality.

### Option 3 — Just look at the preview

`preview_receipt` renders the exact HTML QZ will send, at real physical
size. If it looks right in the preview, it will look right on paper.

---

## Customizing the receipt

All receipt content and styling lives in **`public/receipt-config.js`**.
You normally never touch `receipt-template.js` or `index.html`.

### Common changes

**Business details:**

```js
business: {
  name:    "YOUR CAFE NAME",
  tagline: "Fine Dining · Est. 2024",
  address: "123 Main St",
  phone:   "+1 555 0000",
  logo:    "https://yourserver.com/logo.png"   // or "" to hide
}
```

**Line items:**

```js
lineItems: [
  { name: "Espresso",    nameAr: "إسبريسو",  qty: 2, price: 3.00 },
  { name: "Croissant",   nameAr: "كرواسون",  qty: 1, price: 4.50 }
]
```

**Printer settings:**

```js
printer: {
  density:  203,   // 203 for most 80mm thermals, 300 for higher-end units
  widthMm:  80     // full paper width
}
```

**Paper dead-zones (margin from physical paper edges):**

```js
style: {
  pageWidth:      "76mm",   // total content width
  paddingLeftMm:  "0mm",    // left driver dead-zone
  paddingRightMm: "4mm"     // right driver dead-zone
}
```

If your receipt is clipped on the right side, increase `paddingRightMm`.
If it's clipped on the left, increase `paddingLeftMm` — but keep
`pageWidth` = `printer.widthMm` or QZ will scale everything.

**Bilingual content:** set `locale.showArabic: false` to hide all Arabic
text (useful if your printer's font engine can't shape Arabic script).

### Advanced — changing the layout

Open **`public/receipt-template.js`**. It exports a single function
`buildReceiptHtml(printerName, logoBase64)` that returns the exact HTML
string QZ prints. Edit the CSS in there to change fonts, dividers, the
grand-total box style, or the bilingual footer layout.

Reload the page after editing — there's no build step.

---

## Environment variables

Optional. Copy `.env.example` to `.env` if you want to override defaults:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Server port |
| `QZ_CERT_FILE` | `certs/digital-certificate.txt` | Path to the public certificate |
| `QZ_PRIVATE_KEY_FILE` | `certs/private-key.pem` | Path to the private key |
| `LOGO_URL` | *(unset)* | Image URL proxied through `/logo-base64` for the receipt |

`server.js` doesn't load `.env` automatically — set the variables in your
shell or add a `dotenv` dependency if you want file-based config.

---

## How the code works (behind the scenes)

### `server.js` — three endpoints

**`GET /digital-certificate.txt`**
Returns the contents of `certs/digital-certificate.txt`. This is public
information — it's safe for anyone to see. QZ Tray fetches it on every
page load to know who's asking for printer access.

**`GET /sign-message?request=<url-encoded string>`**
Takes the string QZ sent, signs it with `certs/private-key.pem` using
**SHA-512 + RSA**, and returns the base64 signature. The private key
never leaves this process.

**`GET /logo-base64`** (optional)
If `LOGO_URL` is set, fetches that image and returns it as base64. Avoids
CORS problems when the logo lives on a different domain.

### `public/index.html` — the front-end

- Loads `qz-tray.js` from the CDN
- Tells QZ where to fetch the certificate and signature
  (`qz.security.setCertificatePromise` / `setSignaturePromise`)
- `checkConnection()` opens the WebSocket
- `getPrinters()` lists printers and builds the TARGETS list
- `previewReceipt()` renders the receipt into a sized iframe
- `print80mm()` builds the HTML, inlines images, measures the height,
  and calls `qz.print()`

The receipt body starts with `padding-left: 0; padding-right: 4mm` — so on
paper, the printer's physical dead zone on the left acts as the left
margin. In the preview, a small injected CSS override centres the body
visually so it *looks* symmetric.

### `public/receipt-template.js` — HTML generation

Takes `window.RECEIPT_CONFIG` and returns a complete `<!DOCTYPE html>`
document. Every style value is interpolated from the config, so nothing is
hardcoded. Money formatting, Arabic currency spans, bilingual footer
lines, payment methods, and the totals are all built here.

---

## Troubleshooting

### "QZ Tray connection failed" (red toast)

**Most likely:** QZ Tray is not running.

- Check your system tray / menu bar for the QZ icon.
- If missing, start QZ Tray from the Start menu / Applications folder.
- Click **reconnect_qz** again.

**Also possible:**

- QZ Tray is running but a firewall is blocking `localhost:8182`.
  Test in a browser: <http://localhost:8182> — should return a QZ Tray
  error message (which means it's alive).
- Another app is using port 8182. Check with
  `netstat -an | findstr 8182` (Windows) or `lsof -i :8182` (macOS/Linux).

### Allow / Block popup appears on every print

**Cause:** No certificate installed, or the browser hasn't been told
"Remember this decision."

**Fix:**

1. If you don't have `certs/digital-certificate.txt` and
   `certs/private-key.pem`, follow
   [Certificate setup](#certificate-setup-for-silent-printing).
2. If the popup already appeared and you clicked Allow:
   check the box **Remember this decision** next time. After that it
   won't ask again.

### "Signing error" in the server console

**Cause:** `certs/private-key.pem` is missing, unreadable, or not a valid
PKCS#8 2048-bit RSA key.

**Fix:** regenerate the pair from QZ Tray's Site Manager (delete the old
entry first), then copy both files into `certs/` again.

### Printer list is empty

QZ Tray connected successfully but returned zero printers. Check your OS
printer list — if there are no printers installed at the OS level, QZ has
nothing to show. Install at least one (Microsoft Print to PDF is enough to
test).

### Microsoft Print to PDF gives a blank A4 page

Windows' built-in PDF driver needs a custom paper size registered once.
See [Testing without a real printer](#testing-without-a-real-printer).

### Receipt is cut off on the right side

Your printer's physical dead zone on the right is larger than expected.
Increase `paddingRightMm` in `receipt-config.js` by 1–2 mm:

```js
style: {
  paddingRightMm: "5mm"    // was "4mm"
}
```

Keep `pageWidth` and `printer.widthMm` at the same value or QZ will scale
the whole job.

### Receipt looks faded or "light"

Thermal printers have a physical darkness setting. Two things to try, in
order:

1. **Printer firmware** — most 80mm thermals have a paper feed / density
   button combo or a config tool from the manufacturer. Increase darkness
   by one or two steps.
2. **Driver settings** — Windows → Devices and Printers → your printer →
   Printing Preferences → look for a "Density" or "Darkness" option.

The HTML output itself is already bold (weights 700–900 throughout).

### "Cannot read properties of undefined (reading 'length')" after editing config

You probably deleted or renamed a key that `receipt-template.js` reads.
Compare against the original config, or restore from git:

```bash
git checkout -- public/receipt-config.js
```

### Nothing prints, but no error appears

Check DevTools → Network — do you see a `/sign-message` request? If not,
QZ never sent the job. Look at the console for a `qz.print resolved:`
line. If that's missing, the print call was rejected.

If `/sign-message` returned 500, see "Signing error" above.

---

## Deploying to production

This project is a **learning example** — before shipping it:

1. **Replace the wildcard CORS** in `server.js`:
   ```js
   res.header("Access-Control-Allow-Origin", "*");
   ```
   → your real origin(s), e.g. `https://pos.yourcompany.com`.

2. **Buy a Premium Support certificate** from QZ if your users are on
   machines you don't control. Demo certs only work on the machine that
   generated them.

3. **Serve over HTTPS** — QZ Tray accepts requests from `https://` origins
   more reliably than `http://`. Use a reverse proxy (nginx, Caddy) with
   Let's Encrypt.

4. **Lock down `/sign-message`** — in production, only sign requests that
   come from your own authenticated user session. The current version will
   sign anything anyone asks it to.

5. **Keep `certs/private-key.pem` off the client** — obviously already
   true, but double-check that you never accidentally serve the `certs/`
   directory (Express doesn't, but reverse proxies sometimes do).

6. **Persist certs as secrets** — mount them via your hosting platform's
   secret manager rather than committing them.

---

## Security notes

- **`private-key.pem` = password.** Anyone with this file can sign any QZ
  request as your site. Guard it.
- **`.gitignore` already excludes `certs/`.** Don't remove that line.
- **The certificate (`digital-certificate.txt`) is public.** It's fine to
  serve it, commit it, or expose it.
- **The signature endpoint is powerful.** In production, only sign for
  authenticated users, and add rate limiting.
- **Demo certificates are local-only.** They're trusted by QZ Tray on the
  machine that generated them. If you send your app to a friend, they'll
  need to generate their own demo pair (or you buy a Premium certificate).

---

## License

MIT — see [LICENSE](LICENSE).

This project is an independent, unofficial learning example and is not
affiliated with QZ Industries, LLC.

---

## Links

- Repo: <https://github.com/maiz-an/QZ-Tray-Learn.git>
- QZ Tray: <https://qz.io>
- QZ Tray — Getting Started: <https://qz.io/docs/getting-started>
- QZ Tray — Signing: <https://qz.io/docs/signing>
- QZ Tray — API Reference: <https://qz.io/api/>
- QZ Tray — Generate a certificate: <https://qz.io/docs/generate-certificate>