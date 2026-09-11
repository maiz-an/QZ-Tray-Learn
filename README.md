# QZ-Tray-Learn

A small, open-source example that shows the whole [QZ Tray](https://qz.io)
workflow end to end: connect from the browser, list installed printers, and
**silently** print an 80mm receipt (no "Allow/Block" popup) using a signed
certificate and an Express backend.

It's meant as a learning reference / starter kit — fork it, rename
`CONFIG` in `public/index.html`, and you have a working print test page for
your own POS, kiosk, or receipt-printing project.

![status](https://img.shields.io/badge/status-learning%20project-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## What's inside

```
qz-tray-learn/
├── server.js                  # Express server: serves the page, signs QZ requests
├── public/
│   ├── index.html             # The console UI (connect, list printers, print)
│   └── receipt-template.js    # Everything about the receipt itself — edit this
├── certs/                     # Your QZ Tray key pair goes here (git-ignored)
├── .env.example
├── package.json
└── LICENSE
```

## How it works

1. **QZ Tray** is a free desktop app that lets a browser talk to your
   locally installed printers (and USB/serial devices) without ActiveX or
   Java applets.
2. By default, every print job triggers a security popup asking the user
   to Allow or Block the connection.
3. To skip that popup ("silent printing"), the page needs to present a
   **certificate** it's allowed to use, and every request has to be
   **signed** with the matching **private key**. That's what
   `server.js` does — it hands out the public certificate and signs
   requests on demand, so the private key never touches the browser.
4. Once you click "Allow" once and check "Remember this decision," QZ
   Tray trusts this certificate going forward.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [QZ Tray](https://qz.io/download/) installed and running on the machine
  you're testing from (look for the QZ icon in your system tray)

## Quick start

```bash
git clone https://github.com/<your-username>/qz-tray-learn.git
cd qz-tray-learn
npm install
```

Then generate a free certificate/key pair (below) before starting the
server — printing will still work without it, but you'll get the
Allow/Block popup on every print.

```bash
npm start
```

Open **http://localhost:3000**, make sure QZ Tray is running, and hit
**Reconnect QZ Tray**.

## Generate your own certificate (free)

QZ Tray ships with a **free "Demo Keys"** generator built into the desktop
app — no account, no payment, no waiting. It creates a key pair trusted by
the QZ Tray installation on *your* machine only (that's the trade-off for
it being free and instant — see [QZ's docs](https://qz.io/docs/signing#demo-keys)).

1. Open **QZ Tray → Advanced → Site Manager**
2. Click **+** → **Create New**
3. Click **Yes** to generate keys, **Yes** to install them automatically,
   and **Yes** to copy them to `override.crt`
4. Approve any OS permission prompt
5. QZ Tray drops a `QZ Tray Demo Cert` folder on your Desktop containing
   `digital-certificate.txt` and `private-key.pem`

Copy both files into this project's `certs/` folder:

```
certs/digital-certificate.txt
certs/private-key.pem
```

Restart the server (`npm start`) and reload the page — the popup should
be gone.

> **Need it to work across machines / in production?** QZ Tray also sells
> "Premium Support" certificates trusted globally by every QZ Tray
> install, generated at [qz.io/login](https://qz.io/login). Demo Keys are
> the right choice for local development and learning; a Premium/company
> certificate is the right choice for anything you ship to real users.
> See [qz.io/docs/generate-certificate](https://qz.io/docs/generate-certificate).

### 🔒 Keep your private key private

`private-key.pem` can sign requests on your behalf — treat it like a
password.

- It's already excluded by `.gitignore`. Don't force-add it.
- Never paste it into an issue, PR, or chat.
- If you ever suspect it leaked, regenerate a new pair (Site Manager →
  delete the entry → create a new one) and let QZ know if it was a
  Premium certificate.

## Configuring the demo receipt

Everything about the receipt itself — business name, line items,
currency, the logo toggle, and the actual HTML/CSS layout that gets
printed — lives in **`public/receipt-template.js`**, separate from the
console UI in `index.html`. Edit that one file to make it yours:

```javascript
const CONFIG = {
  businessName: "QZ-Tray-Learn",
  tagline: "SAMPLE RECEIPT",
  useLogo: false,          // set true + LOGO_URL in .env to print a logo
  lineItems: [
    { name: "Sample Item One", qty: 1, price: 9.99 },
    // ...
  ],
  currency: "USD"
};
```

The same file also exports `buildReceiptHtml(printerName, logoBase64)`,
which returns the exact HTML string sent to the printer — change the
markup/styles in there if you want a different receipt layout (add a
barcode, change fonts, add a "no refunds" footer, etc.).

Edit either, reload the page, and the printed receipt updates
immediately — no build step, and no need to touch `index.html` or
`server.js`.

### Environment variables (optional)

Copy `.env.example` to `.env` if you want to override defaults:

| Variable               | Default                        | Purpose                              |
|-------------------------|---------------------------------|---------------------------------------|
| `PORT`                  | `3000`                          | Server port                          |
| `QZ_CERT_FILE`          | `certs/digital-certificate.txt` | Path to your public certificate      |
| `QZ_PRIVATE_KEY_FILE`   | `certs/private-key.pem`         | Path to your private key             |
| `LOGO_URL`               | *(unset)*                       | Image to print when `CONFIG.useLogo` is `true` |

## Printing to "Microsoft Print to PDF" comes out blank or A4

Windows' built-in PDF driver needs a concrete paper size registered once,
otherwise pixel/HTML print jobs can render as a blank A4 page instead of
an 80mm receipt.

1. **Settings → Printers & scanners → Microsoft Print to PDF → Printer
   properties → Advanced → New**
2. Create a custom paper size: **80 mm × 297 mm**
3. Retry the print — it should now come out at the correct width

This is a one-time OS setting, not something the code can fix.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "QZ Tray connection failed" | QZ Tray isn't running, or isn't installed. Check your system tray / menu bar. |
| Popup still appears on every print | No `certs/` files yet, or the browser hasn't been told "Remember this decision" yet. |
| "Failed to get printers" | QZ Tray connected but the OS printer list is empty — check your OS printer settings. |
| Signing errors in the server console | `certs/private-key.pem` missing, unreadable, or not a valid PKCS#8 2048-bit key. |

## Learn more

- [QZ Tray — Getting Started](https://qz.io/docs/getting-started)
- [QZ Tray — Signing Messages](https://qz.io/docs/signing)
- [QZ Tray — API Reference](https://qz.io/api/)

## License

MIT — see [LICENSE](LICENSE). This project is an independent, unofficial
learning example and isn't affiliated with QZ Industries, LLC.