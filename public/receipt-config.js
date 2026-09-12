/**
 * receipt-config.js
 * ---------------------------------------------------------------------
 *  EVERYTHING lives here: content, styling, logo, printer settings.
 *  Edit → Save → Ctrl+Shift+R → print.
 * ---------------------------------------------------------------------
 */

window.RECEIPT_CONFIG = {

  /* =============================================================
     PRINTER
     ============================================================= */
  printer: {
    /* Hardware DPI of your thermal printer (hint for QZ Tray).
       BILL / LAN 80MM units are usually 203 dpi.
       If print comes out too light or too dark, try 300. */
    density:  203,

    /* Content width in millimetres. 72 is the safe limit for an
       80mm roll; drop to 70 if the right edge still clips. */
    widthMm:  72,

    /* Rasterization multiplier.
       4 → bitmap is 96 × 4 = 384 DPI (crisp, sharper).
       3 → 288 DPI (faster, lighter payload).
       Keep 4 unless printing is slow. */
    scale:    4
  },

  /* =============================================================
     1. BUSINESS
     ============================================================= */
  business: {
    name:    "ELITE TOUCH CAFE",
    tagline: "Fine Dining · Est. 2020",

    /* Logo URL. Must send Access-Control-Allow-Origin.
       If the server doesn't, the logo is silently dropped
       and the receipt still prints fine. */
    logo:    "https://grabvo.app/fav.png",

    address: "Doha, Qatar",
    phone:   "+974 5000 0000",
    email:   "info@elitetouchcafe.com",
    website: "www.elitetouchcafe.com"
  },

  /* =============================================================
     2. STYLE
     ============================================================= */
  style: {

    baseFont: "'Segoe UI', 'Helvetica Neue', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
    baseSize:  "9.5pt",
    lineHeight:"1.4",

    /* header */
    businessNameSize: "20pt",
    taglineSize:      "7pt",
    contactSize:      "7pt",
    logoWidth:        "16mm",
    logoHeight:       "16mm",
    showLogo:         true,

    /* section labels */
    sectionSize:      "7pt",
    sectionTopGap:    "4mm",

    /* order / payment */
    orderLineSize:    "9pt",

    /* meta rows */
    metaSize:         "8.5pt",
    smallMetaSize:    "7.5pt",
    rowSpacing:       "1.1mm",

    /* items */
    itemNameSize:     "10pt",
    itemMetaSize:     "7.5pt",
    itemPadding:      "2mm",

    /* totals */
    grandLabelSize:   "11pt",
    grandTotalSize:   "16pt",

    /* footer */
    thanksSize:       "10pt",
    footerSize:       "7.5pt",
    smallFooterSize:  "6.8pt",
    poweredSize:      "6.5pt"
  },

  /* =============================================================
     3. ORDER
     ============================================================= */
  order: {
    type:      "Takeaway",
    number:    "#0015",
    cashier:   "Merry",
    terminal:  "POS-01",
    payment:   "Card ·· 4242",

    billNo:    "260630000004",
    orderId:   "21260629002VWNBTSHE",
    orderTime: "30/06/2026 12:15 AM",
    printTime: "30/06/2026 10:55 AM"
  },

  /* =============================================================
     4. CUSTOMER (set fields to "" to hide)
     ============================================================= */
  customer: {
    name:    "Walk-in",
    phone:   "",
    email:   "",
    address: ""
  },

  /* =============================================================
     5. ITEMS
     ============================================================= */
  lineItems: [
    { name: "Tiramisu Arabic Coffee", qty: 2, price: 25.00 },
    { name: "Cappuccino",             qty: 1, price: 15.00 },
    { name: "Chocolate Cake",         qty: 1, price: 18.00 }
  ],

  /* =============================================================
     6. MONEY
     ============================================================= */
  currency: "RM",
  discount: 0,
  taxRate:  0,        // 0.08 = 8%

  /* =============================================================
     7. FOOTER
     ============================================================= */
  footer: {
    thanks:       "Thank you for dining with us",
    line2:        "We look forward to serving you again",
    returnPolicy: "Items once sold cannot be returned without a valid receipt.",
    powered:      "Powered by Bizpoz"
  }
};