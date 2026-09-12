/**
 * receipt-template.js
 * ---------------------------------------------------------------------
 * Modern receipt. Heavier weights + darker grays so thermal prints
 * look crisp instead of faded.
 * ---------------------------------------------------------------------
 */

(function () {

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const money = (n, cur) => {
    const v = (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
    return cur ? v + " " + cur : v;
  };

  function kv(label, value, cls = "") {
    if (value == null || value === "") return "";
    return `
      <div class="kv ${cls}">
        <span class="k">${esc(label)}</span>
        <span class="v">${esc(value)}</span>
      </div>`;
  }

  function sectionLabel(text) {
    if (!text) return "";
    return `<div class="section-label">${esc(text)}</div>`;
  }

  window.buildReceiptHtml = function buildReceiptHtml() {

    const C = window.RECEIPT_CONFIG || {};
    const S = C.style    || {};
    const B = C.business || {};
    const O = C.order    || {};
    const CU = C.customer|| {};
    const F = C.footer   || {};

    /* ---------------- math ---------------- */
    let subtotal = 0, itemCount = 0;
    (C.lineItems || []).forEach(it => {
      const q = Number(it.qty)   || 0;
      const p = Number(it.price) || 0;
      subtotal  += q * p;
      itemCount += q;
    });
    const discount = Math.max(0, Number(C.discount) || 0);
    const taxable  = Math.max(subtotal - discount, 0);
    const taxRate  = Number(C.taxRate) || 0;
    const tax      = taxable * taxRate;
    const total    = taxable + tax;
    const cur      = C.currency || "";

    /* ---------------- logo ---------------- */
    let logoHtml = "";
    if (B.logo) {
      logoHtml = `<img class="logo" src="${esc(B.logo)}" alt="" crossorigin="anonymous">`;
    } else if (S.showLogo) {
      const initials = (B.name || "C").trim().split(/\s+/)
        .map(w => w[0]).slice(0, 2).join("").toUpperCase();
      logoHtml = `<div class="logo-mark">${esc(initials)}</div>`;
    }

    /* ---------------- header ---------------- */
    const contactTop = [B.address, B.phone].filter(Boolean).join("  ·  ");
    const contactBot = [B.email, B.website].filter(Boolean).join("  ·  ");

    const headerHtml = `
      <header class="header">
        ${logoHtml}
        <div class="biz-name">${esc(B.name || "")}</div>
        ${B.tagline ? `<div class="biz-tagline">${esc(B.tagline)}</div>` : ""}
        ${contactTop || contactBot ? `
          <div class="biz-contact">
            ${contactTop ? `<div>${esc(contactTop)}</div>` : ""}
            ${contactBot ? `<div class="dim">${esc(contactBot)}</div>` : ""}
          </div>` : ""}
      </header>
    `;

    /* ---------------- order ---------------- */
    const orderLine1 = [
      O.number,
      O.type,
      O.cashier ? `Cashier ${O.cashier}` : ""
    ].filter(Boolean).join("  ·  ");

    const orderHtml = orderLine1 ? `
      ${sectionLabel("Order")}
      <div class="order-line">${esc(orderLine1)}</div>
      ${O.terminal ? `<div class="order-sub">Terminal ${esc(O.terminal)}</div>` : ""}
    ` : "";

    /* ---------------- customer ---------------- */
    let customerHtml = "";
    if (CU.name || CU.phone || CU.email || CU.address) {
      customerHtml = `
        ${sectionLabel("Customer")}
        ${kv("Name",    CU.name)}
        ${kv("Phone",   CU.phone)}
        ${kv("Email",   CU.email)}
        ${kv("Address", CU.address)}
      `;
    }

    /* ---------------- items ---------------- */
    const itemsHtml = (C.lineItems || []).map(it => {
      const q = Number(it.qty)   || 0;
      const p = Number(it.price) || 0;
      return `
        <div class="item">
          <div class="item-line">
            <span class="item-name">${esc(it.name || "")}</span>
            <span class="item-price">${money(q * p, cur)}</span>
          </div>
          <div class="item-meta">${q} × ${money(p, "")}</div>
        </div>`;
    }).join("");

    const itemsSection = `
      ${sectionLabel("Items")}
      <div class="items">
        ${itemsHtml || `<div class="empty">No items</div>`}
      </div>
    `;

    /* ---------------- totals ---------------- */
    let totalsInner = kv("Subtotal", money(subtotal, cur));
    if (discount > 0) {
      totalsInner += kv("Discount", "−" + money(discount, cur));
    }
    if (tax > 0) {
      totalsInner += kv(`Tax ${(taxRate * 100).toFixed(2)}%`, money(tax, cur));
    }

    const totalsSection = `
      <div class="totals">${totalsInner}</div>
      <div class="grand">
        <span class="grand-label">TOTAL</span>
        <span class="grand-value">${money(total, cur)}</span>
      </div>
    `;

    /* ---------------- payment ---------------- */
    const paymentBits = [
      O.payment,
      itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : ""
    ].filter(Boolean).join("  ·  ");

    const paymentHtml = paymentBits ? `
      ${sectionLabel("Payment")}
      <div class="order-line">${esc(paymentBits)}</div>
    ` : "";

    /* ---------------- reference ---------------- */
    const refRows = [
      ["Bill No.",   O.billNo],
      ["Order ID",   O.orderId],
      ["Order Time", O.orderTime],
      ["Print Time", O.printTime]
    ].filter(r => r[1]);

    const referenceHtml = refRows.length ? `
      ${sectionLabel("Reference")}
      ${refRows.map(r => kv(r[0], r[1], "small")).join("")}
    ` : "";

    /* ---------------- footer ---------------- */
    const footerHtml = `
      <footer class="footer">
        ${F.thanks ? `<div class="thanks">${esc(F.thanks)}</div>` : ""}
        ${F.line2  ? `<div class="footer-line">${esc(F.line2)}</div>` : ""}
        ${F.returnPolicy ? `<div class="policy">${esc(F.returnPolicy)}</div>` : ""}
        ${F.powered ? `<div class="powered">${esc(F.powered)}</div>` : ""}
      </footer>
    `;

    /* ---------------- final document ---------------- */
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Receipt</title>
<style>
  @page { margin: 0; }
  *, *::before, *::after { box-sizing: border-box; }

  html, body { margin: 0; padding: 0; background: #fff; color: #000; }

  body {
    width: ${S.pageWidth || "72mm"};
    padding:
      ${S.topPadding    || "4mm"}
      1.2mm
      ${S.bottomPadding || "5mm"}
      0.8mm;

    font-family: ${S.baseFont ||
      "'Segoe UI', 'Helvetica Neue', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif"};

    font-size:   ${S.baseSize || "9.5pt"};
    line-height: ${S.lineHeight || "1.4"};

    color: #000;
    font-variant-numeric: tabular-nums;
    text-rendering: geometricPrecision;   /* sharper glyphs */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ================================================================
     HEADER
     ================================================================ */
  .header { text-align: center; }

  .logo {
    display: block; width: ${S.logoWidth || "16mm"};
    max-height: ${S.logoHeight || "16mm"};
    object-fit: contain;
    margin: 0 auto 2.5mm;
  }
  .logo-mark {
    width: 14mm; height: 14mm; margin: 0 auto 3mm;
    background: #000; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12pt; font-weight: 900; letter-spacing: 0.02em;
  }
  .biz-name {
    font-size:   ${S.businessNameSize || "20pt"};
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.05;
    color: #000;
  }
  .biz-tagline {
    margin-top: 1.2mm;
    font-size:   ${S.taglineSize || "7pt"};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    color: #555;
  }
  .biz-contact {
    margin-top: 2.2mm;
    font-size: ${S.contactSize || "7pt"};
    font-weight: 500;
    color: #333;
    line-height: 1.5;
  }
  .biz-contact .dim { color: #666; }

  /* ================================================================
     SECTION LABELS — solid black, thicker rule
     ================================================================ */
  .section-label {
    margin: ${S.sectionTopGap || "4mm"} 0 1.8mm;
    padding-bottom: 1mm;
    font-size:   ${S.sectionSize || "7pt"};
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #000;
    border-bottom: 1px solid #000;
  }

  /* ================================================================
     ORDER / PAYMENT
     ================================================================ */
  .order-line {
    font-size: ${S.orderLineSize || "9pt"};
    font-weight: 700;
    line-height: 1.4;
    color: #000;
  }
  .order-sub {
    margin-top: 0.6mm;
    font-size: ${S.contactSize || "7pt"};
    font-weight: 500;
    color: #555;
    letter-spacing: 0.02em;
  }

  /* ================================================================
     KEY ······ VALUE ROWS
     ================================================================ */
  .kv {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 3mm;
    margin: ${S.rowSpacing || "1.1mm"} 0;
    font-size: ${S.metaSize || "8.5pt"};
    line-height: 1.35;
  }
  .kv .k { color: #444; font-weight: 500; }
  .kv .v { font-weight: 800; text-align: right; overflow-wrap: anywhere; color: #000; }
  .kv.small { font-size: ${S.smallMetaSize || "7.5pt"}; margin: 0.7mm 0; }
  .kv.small .k { color: #555; }
  .kv.small .v { font-weight: 600; }

  /* ================================================================
     ITEMS
     ================================================================ */
  .items { margin-top: 0.5mm; }

  .item { padding: ${S.itemPadding || "2mm"} 0; }
  .item + .item { border-top: 1px solid #ccc; }

  .item-line {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 3mm;
  }
  .item-name {
    font-size:   ${S.itemNameSize || "10pt"};
    font-weight: 800;
    letter-spacing: -0.005em;
    line-height: 1.25;
    overflow-wrap: anywhere;
    color: #000;
  }
  .item-price {
    font-size: ${S.itemNameSize || "10pt"};
    font-weight: 800;
    white-space: nowrap;
    color: #000;
  }
  .item-meta {
    margin-top: 0.5mm;
    font-size: ${S.itemMetaSize || "7.5pt"};
    font-weight: 500;
    color: #555;
  }
  .empty { text-align: center; padding: 3mm 0; color: #999; font-size: 9pt; }

  /* ================================================================
     TOTALS  +  BOXED (bordered, no fill) GRAND TOTAL
     ================================================================ */
  .totals { margin-top: 1mm; }

  .grand {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3mm;
    padding: 2.5mm 3mm;
    background: #fff;              /* white — no black bar */
    color: #000;
    border: 1.5px solid #000;      /* solid rectangle outline */
  }
  .grand-label {
    font-size: ${S.grandLabelSize || "11pt"};
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .grand-value {
    font-size: ${S.grandTotalSize || "16pt"};
    font-weight: 900;
    letter-spacing: -0.015em;
  }

  /* ================================================================
     FOOTER
     ================================================================ */
  .footer {
    margin-top: 6mm;
    padding-top: 4mm;
    border-top: 1px solid #000;
    text-align: center;
  }
  .thanks {
    font-size: ${S.thanksSize || "10pt"};
    font-weight: 800;
    letter-spacing: -0.005em;
    color: #000;
  }
  .footer-line {
    margin-top: 1mm;
    font-size: ${S.footerSize || "7.5pt"};
    font-weight: 500;
    color: #444;
  }
  .policy {
    margin-top: 3mm;
    font-size: ${S.smallFooterSize || "6.8pt"};
    color: #666;
    line-height: 1.5;
  }
  .powered {
    margin-top: 4mm;
    font-size: ${S.poweredSize || "6.5pt"};
    font-weight: 800;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #999;
  }
</style>
</head>
<body>

  ${headerHtml}

  ${orderHtml}

  ${customerHtml}

  ${itemsSection}

  ${totalsSection}

  ${paymentHtml}

  ${referenceHtml}

  ${footerHtml}

</body>
</html>`;
  };

})();