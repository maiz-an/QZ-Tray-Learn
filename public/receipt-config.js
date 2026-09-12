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
     -------------------------------------------------------------
     threshold = pixel darkness cutoff for the raster path.
       Lower  (e.g. 160) → thinner strokes, lighter look
       Higher (e.g. 210) → thicker strokes, darker look
       190 is a good default for 80mm thermals.
     ============================================================= */
  printer: {
    density:   203,
    widthMm:   72,
    scale:     4,      // 4× = 384 DPI bitmap
    threshold: 128
  },

  /* =============================================================
     1. BUSINESS
     ============================================================= */
  business: {
    name:    "ELITE TOUCH CAFE",
    nameAr:  "",
    tagline: "Fine Dining · Est. 2020",
    logo:    "https://grabvo.app/fav.png",

    address: "Doha, Qatar",
    phone:   "+974 5000 0000",
    email:   "info@elitetouchcafe.com",
    website: "www.elitetouchcafe.com"
  },

  /* =============================================================
     2. LOCALE
     ============================================================= */
  locale: {
    showArabic: true,
    currency:   { en: "ر.ق", ar: "" },

    subtotal:   { en: "Subtotal", ar: "المجموع الفرعي" },
    total:      { en: "TOTAL",    ar: "الإجمالي" },

    thanks:     { en: "Thank you for dining with us",
                  ar: "شكراً لتناولكم الطعام معنا" },
    visitAgain: { en: "We look forward to serving you again",
                  ar: "نتطلع لخدمتكم مرة أخرى" },
    returnNote: { en: "Items once sold cannot be returned without a valid receipt.",
                  ar: "لا يمكن إرجاع المنتجات بعد البيع دون فاتورة صالحة." }
  },

  /* =============================================================
     3. STYLE
     ============================================================= */
  style: {
    baseFont: "'Segoe UI', 'Helvetica Neue', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif",
    baseSize:  "9.5pt",
    lineHeight:"1.4",

    arabicFont: "'Tahoma', 'Segoe UI', 'Simplified Arabic', 'Traditional Arabic', 'Noto Naskh Arabic', 'Arial', sans-serif",

    itemPriceSize:        "9pt",
    itemPriceWeight:      "700",
    arabicWeightHead:     "700",
    arabicWeightBody:     "600",
    arabicWeightCurrency: "700",
    arabicWeightGrand:    "500",
    arabicWeightItemName: "500",
    arabicWeightSmall:    "500",

    businessNameSize:   "20pt",
    businessNameArSize: "15pt",
    taglineSize:        "7pt",
    contactSize:        "7pt",
    logoWidth:          "16mm",
    logoHeight:         "16mm",
    showLogo:           true,

    sectionSize:      "7pt",
    sectionTopGap:    "4mm",

    orderLineSize:    "9pt",

    metaSize:         "8.5pt",
    smallMetaSize:    "7.5pt",
    rowSpacing:       "1.1mm",

    itemNameSize:     "10pt",
    itemNameArSize:   "8pt",
    itemMetaSize:     "7.5pt",
    itemPadding:      "2mm",

    subtotalTopGap:   "3mm",

    grandLabelSize:   "11pt",
    grandArSize:      "11pt",
    grandTotalSize:   "16pt",

    thanksSize:       "10pt",
    footerArSize:     "9.5pt",
    smallArSize:      "8.5pt",
    footerSize:       "7.5pt",
    smallFooterSize:  "6.8pt",
    poweredSize:      "6.5pt"
  },

  /* =============================================================
     4. ORDER
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
     5. CUSTOMER
     ============================================================= */
  customer: {
    name:    "Saif",
    phone:   "",
    email:   "",
    address: ""
  },

  /* =============================================================
     6. ITEMS
     ============================================================= */
  lineItems: [
    { name: "Tiramisu Arabic Coffee", nameAr: "تيراميسو قهوة عربية", qty: 2, price: 25.00 },
    { name: "Cappuccino",             nameAr: "كابتشينو",              qty: 1, price: 15.00 },
    { name: "Chocolate Cake",         nameAr: "كيك الشوكولاتة",        qty: 1, price: 18.00 }
  ],

  /* =============================================================
     7. MONEY
     ============================================================= */
  currency: "ر.ق",
  discount: 0,
  taxRate:  0,

  /* =============================================================
     8. FOOTER
     ============================================================= */
  footer: {
    thanks:       "Thank you for dining with us",
    line2:        "We look forward to serving you again",
    returnPolicy: "Items once sold cannot be returned without a valid receipt.",
    powered:      "Powered by Bizpoz"
  }
};