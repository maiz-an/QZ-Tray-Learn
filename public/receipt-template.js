/**
 * receipt-template.js
 * --------------------------------------------------------------------
 * Builds the HTML for an 80mm thermal receipt.
 *
 *   • Edit CONFIG below — that's the only part you normally touch.
 *   • Nothing here talks to QZ Tray. The printer page hands the
 *     returned HTML string to qz.print().
 *   • Also works unchanged on Microsoft Print to PDF.
 * --------------------------------------------------------------------
 */

const CONFIG = {

  /* ---------- BUSINESS ------------------------------------------ */
  business: {
    name:    "ACME COFFEE",
    tagline: "Specialty Roasters",
    address: "123 Main Street, Springfield",
    phone:   "+1 (555) 123-4567",
    website: "acmecoffee.example",
    taxId:   "TAX ID: 12-3456789"
  },

  /* ---------- LOGO ---------------------------------------------- */
  // Server must expose GET /logo-base64 returning raw base64 (no prefix).
  useLogo:         true,
  logoMaxWidthMm:  50,
  logoMaxHeightMm: 20,

  /* ---------- ORDER --------------------------------------------- */
  order: {
    number:  "INV-2026-0001",
    date:    new Date(),
    cashier: "Alex",
    table:   "Table 4",
    service: "Dine-in",
    payment: "Visa •• 4242"
  },

  /* ---------- ITEMS --------------------------------------------- */
  lineItems: [
    { name: "Espresso",             qty: 1, price: 3.00 },
    { name: "Cappuccino",           qty: 2, price: 4.50 },
    { name: "Blueberry Muffin",     qty: 1, price: 3.75 },
    { name: "Chocolate Chip Cookie",qty: 3, price: 2.00 }
  ],

  /* ---------- MONEY --------------------------------------------- */
  currency: "$",
  taxRate:  0.08,   // 8%. Set to 0 to hide the Tax row.
  discount: 0,      // flat amount off subtotal

  /* ---------- FOOTER -------------------------------------------- */
  footer: {
    thanks: "Thank you — see you soon!",
    line2:  "Follow @acmecoffee",
    qrUrl:  null      // set to a URL to print a QR code
  },

  /* ---------- DISPLAY ------------------------------------------- */
  showTime:       true,
  showSeparators: true
};

/* ====================================================================
   HELPERS
   ==================================================================== */

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function money(n) {
  const v = Number(n) || 0;
  return (v < 0 ? "-" : "") + CONFIG.currency + Math.abs(v).toFixed(2);
}

function formatDate(d) {
  const date = d instanceof Date ? d : new Date();
  const p = x => String(x).padStart(2, "0");
  const day  = p(date.getDate());
  const mon  = p(date.getMonth() + 1);
  const year = date.getFullYear();
  const hh   = p(date.getHours());
  const mm   = p(date.getMinutes());
  return CONFIG.showTime
    ? `${day}/${mon}/${year} ${hh}:${mm}`
    : `${day}/${mon}/${year}`;
}

function dataUri(b64) {
  if (!b64) return null;
  return b64.startsWith("data:") ? b64 : "data:image/png;base64," + b64;
}

/* ====================================================================
   RECEIPT BUILDER
   ==================================================================== */

function buildReceiptHtml(printerName, logoBase64) {

  /* ----- totals ----- */
  let subtotal = 0, itemCount = 0;
  (CONFIG.lineItems || []).forEach(it => {
    const q = Number(it.qty) || 0;
    const p = Number(it.price) || 0;
    subtotal  += q * p;
    itemCount += q;
  });
  const discount = Math.max(0, Number(CONFIG.discount) || 0);
  const taxable  = Math.max(subtotal - discount, 0);
  const tax      = taxable * (Number(CONFIG.taxRate) || 0);
  const total    = taxable + tax;

  /* ----- logo ----- */
  const logoUri = dataUri(logoBase64);
  const logoBlock = (CONFIG.useLogo && logoUri)
    ? `<div class="center logo-wrap">
         <img class="logo"
              style="max-width:${CONFIG.logoMaxWidthMm}mm;
                     max-height:${CONFIG.logoMaxHeightMm}mm;"
              src="${logoUri}">
       </div>`
    : "";

  /* ----- business header lines ----- */
  const bizLines = [
    CONFIG.business.tagline && `<div class="center biz-tag">${escapeHtml(CONFIG.business.tagline)}</div>`,
    CONFIG.business.address && `<div class="center biz-line">${escapeHtml(CONFIG.business.address)}</div>`,
    CONFIG.business.phone   && `<div class="center biz-line">Tel: ${escapeHtml(CONFIG.business.phone)}</div>`,
    CONFIG.business.website && `<div class="center biz-line">${escapeHtml(CONFIG.business.website)}</div>`,
    CONFIG.business.taxId   && `<div class="center biz-line">${escapeHtml(CONFIG.business.taxId)}</div>`
  ].filter(Boolean).join("");

  /* ----- order meta ----- */
  const meta = [];
  if (CONFIG.order.number)  meta.push(["Order",   CONFIG.order.number]);
  if (CONFIG.order.table)   meta.push(["Table",   CONFIG.order.table]);
  if (CONFIG.order.service) meta.push(["Service", CONFIG.order.service]);
  if (CONFIG.order.cashier) meta.push(["Cashier", CONFIG.order.cashier]);
  meta.push(["Date", formatDate(CONFIG.order.date)]);
  if (CONFIG.order.payment) meta.push(["Payment", CONFIG.order.payment]);

  const metaRows = meta.map(([k, v]) =>
    `<tr><td class="k">${escapeHtml(k)}</td>
         <td class="v">${escapeHtml(v)}</td></tr>`
  ).join("");

  /* ----- items ----- */
  const itemRows = (CONFIG.lineItems || []).map(it => {
    const q = Number(it.qty) || 0;
    const p = Number(it.price) || 0;
    const line = q * p;
    return `
      <tr class="name-row">
        <td colspan="2">${escapeHtml(it.name)}</td>
      </tr>
      <tr class="detail-row">
        <td class="qty">${q} × ${money(p)}</td>
        <td class="line-total">${money(line)}</td>
      </tr>`;
  }).join("");

  /* ----- totals ----- */
  let totalRows = `
    <tr><td class="k">Subtotal (${itemCount} item${itemCount === 1 ? "" : "s"})</td>
        <td class="v">${money(subtotal)}</td></tr>`;
  if (discount > 0) {
    totalRows += `
      <tr><td class="k">Discount</td>
          <td class="v">-${money(discount)}</td></tr>`;
  }
  if (tax > 0) {
    totalRows += `
      <tr><td class="k">Tax (${(CONFIG.taxRate * 100).toFixed(2)}%)</td>
          <td class="v">${money(tax)}</td></tr>`;
  }

  /* ----- separators ----- */
  const sep = CONFIG.showSeparators ? `<div class="sep"></div>` : "";
  const doubleRule = CONFIG.showSeparators ? `<div class="rule-double"></div>` : "";

  /* ----- QR ----- */
  const qrBlock = CONFIG.footer.qrUrl
    ? `<div class="center qr-wrap">
         <img class="qr"
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(CONFIG.footer.qrUrl)}">
       </div>`
    : "";

  /* ----- final HTML ----- */
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Receipt</title>
<style>
  html, body { margin: 0; padding: 0; background: #fff; }

  body {
    width: 72mm;                        /* 80mm roll − 4mm each side */
    padding: 3mm 4mm;
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 11px;
    line-height: 1.45;
    color: #000;
    -webkit-font-smoothing: none;
  }

  .center { text-align: center; }
  .right  { text-align: right; }
  .bold   { font-weight: bold; }

  /* ---------- logo ---------- */
  .logo-wrap { margin: 0 0 2.5mm 0; }
  .logo      { display: inline-block; }

  /* ---------- business header ---------- */
  .biz-name { font-size: 15px; font-weight: bold; letter-spacing: .5px; }
  .biz-tag  { font-size: 10.5px; letter-spacing: 1.5px; margin-top: .5mm; }
  .biz-line { font-size: 10.5px; margin-top: .3mm; }

  /* ---------- separators ---------- */
  .sep {
    border-top: 1px dashed #000;
    margin: 2mm 0;
    height: 0;
  }
  .rule-double {
    border-top: 3px double #000;
    margin: 1.5mm 0;
    height: 0;
  }

  /* ---------- key/value tables ---------- */
  table { width: 100%; border-collapse: collapse; }
  td { padding: 0; vertical-align: top; }

  table.meta td { padding: .3mm 0; font-size: 10.5px; }
  table.meta td.k { text-align: left; color: #000; }
  table.meta td.v { text-align: right; white-space: nowrap; }

  /* ---------- items ---------- */
  table.items { table-layout: fixed; }
  table.items td { padding: 0; }

  tr.name-row td {
    padding-top: 1.6mm;
    font-weight: bold;
    word-break: break-word;
    font-size: 11.5px;
  }
  tr.name-row:first-child td { padding-top: 0; }

  tr.detail-row td {
    font-size: 10.5px;
    color: #000;
    padding-bottom: .4mm;
  }
  td.qty        { text-align: left; white-space: nowrap; }
  td.line-total { text-align: right; white-space: nowrap; }

  /* ---------- totals ---------- */
  table.totals td { padding: .3mm 0; font-size: 11px; }
  table.totals td.k { text-align: left; }
  table.totals td.v { text-align: right; white-space: nowrap; }
  table.totals tr.grand td {
    font-size: 13px;
    font-weight: bold;
    padding-top: 1.5mm;
    letter-spacing: .5px;
  }

  /* ---------- footer ---------- */
  .thanks  { font-weight: bold; margin-top: 1mm; font-size: 11.5px; }
  .tagline { font-size: 10px; color: #333; margin-top: .5mm; }

  .qr-wrap { margin-top: 3mm; }
  .qr      { width: 26mm; height: 26mm; image-rendering: pixelated; }

  .feed { height: 8mm; }
</style>
</head>
<body>

  ${logoBlock}

  <div class="center biz-name">${escapeHtml(CONFIG.business.name)}</div>
  ${bizLines}

  ${sep}

  <table class="meta">${metaRows}</table>

  ${sep}

  <table class="items">${itemRows}</table>

  ${sep}

  <table class="totals">
    ${totalRows}
    ${doubleRule ? `<tr><td colspan="2">${doubleRule}</td></tr>` : ""}
    <tr class="grand">
      <td class="k">TOTAL</td>
      <td class="v">${money(total)}</td>
    </tr>
    ${doubleRule ? `<tr><td colspan="2">${doubleRule}</td></tr>` : ""}
  </table>

  ${sep}

  <div class="center thanks">${escapeHtml(CONFIG.footer.thanks)}</div>
  ${CONFIG.footer.line2 ? `<div class="center tagline">${escapeHtml(CONFIG.footer.line2)}</div>` : ""}

  ${qrBlock}

  <div class="feed"></div>

</body>
</html>`;
}