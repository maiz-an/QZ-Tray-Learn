export interface PrinterConfig {
  density: number;
  widthMm: number;
  scale: number;
  threshold: number;
}

export interface BusinessConfig {
  name: string;
  nameAr: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface LocaleStringPair {
  en: string;
  ar: string;
}

export interface LocaleConfig {
  showArabic: boolean;
  currency: LocaleStringPair;
  subtotal: LocaleStringPair;
  total: LocaleStringPair;
  thanks: LocaleStringPair;
  visitAgain: LocaleStringPair;
  returnNote: LocaleStringPair;
}

export interface ReceiptStyleConfig {
  baseFont: string;
  baseSize: string;
  lineHeight: string;

  pageWidth: string;
  paddingLeftMm: string;
  paddingRightMm: string;
  topPadding: string;
  bottomPadding: string;

  arabicFont: string;

  itemPriceSize: string;
  itemPriceWeight: string;
  arabicWeightHead: string;
  arabicWeightBody: string;
  arabicWeightCurrency: string;
  arabicWeightGrand: string;
  arabicWeightItemName: string;
  arabicWeightSmall: string;

  businessNameSize: string;
  businessNameArSize: string;
  taglineSize: string;
  contactSize: string;
  logoWidth: string;
  logoHeight: string;
  showLogo: boolean;

  sectionSize: string;
  sectionTopGap: string;

  orderLineSize: string;

  metaSize: string;
  smallMetaSize: string;
  rowSpacing: string;

  itemNameSize: string;
  itemNameArSize: string;
  itemMetaSize: string;
  itemPadding: string;
  itemNoteSize: string;

  subtotalTopGap: string;

  grandLabelSize: string;
  grandArSize: string;
  grandTotalSize: string;

  thanksSize: string;
  footerArSize: string;
  smallArSize: string;
  footerSize: string;
  smallFooterSize: string;
  poweredSize: string;
}

export interface PaymentRow {
  method: string;
  amount: number;
}

export interface OrderConfig {
  type: string;
  number: string;
  cashier: string;
  terminal: string;
  table: string;
  notes: string;
  payment: string;
  payments: PaymentRow[];
  billNo: string;
  orderId: string;
  payTime: string;
  orderTime: string;
  printTime: string;
}

export interface CustomerConfig {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface LineItem {
  name: string;
  nameAr?: string;
  qty: number;
  price: number;
  note?: string;
}

export interface FooterConfig {
  thanks: string;
  line2: string;
  returnPolicy: string;
  powered: string;
}

export interface TicketLabels {
  table: string;
  server: string;
  items: string;
  notes: string;
  footer: string;
  powered: string;
}

export interface TicketStyleConfig {
  pageWidth: string;
  paddingLeftMm: string;
  paddingRightMm: string;
  topPadding: string;
  bottomPadding: string;

  baseFont: string;
  baseSize: string;
  lineHeight: string;

  badgeSize: string;

  orderNumberSize: string;
  orderNumberWeight: string;
  orderMetaSize: string;
  orderMetaWeight: string;

  itemQtySize: string;
  itemQtyWeight: string;
  itemNameSize: string;
  itemNameWeight: string;
  itemNameArSize: string;
  itemNoteSize: string;
  itemPadding: string;
  itemDivider: string;

  notesLabelSize: string;
  notesBodySize: string;
  thanksSize: string;
  poweredSize: string;
}

export interface TicketConfig {
  header: { label: string };
  labels: TicketLabels;
  sortItemsByName: boolean;
  uppercaseItems: boolean;
  notes: string;
  style: TicketStyleConfig;
}

export interface BillHeaderConfig {
  label: string;
  note: string;
}

export interface BillLabels {
  amountDue: LocaleStringPair;
}

export interface BillFooterConfig {
  note: string;
  noteAr: string;
}

export interface BillConfig {
  header: BillHeaderConfig;
  labels: BillLabels;
  footer: BillFooterConfig;
}

export interface CancellationLabels {
  reason: string;
  items: string;
  footer: string;
  powered: string;
  warning: string;
}

export interface CancellationConfig {
  header: { label: string };
  labels: CancellationLabels;
  reason: string;
}

export interface ReceiptConfig {
  printer: PrinterConfig;
  business: BusinessConfig;
  locale: LocaleConfig;
  style: ReceiptStyleConfig;
  order: OrderConfig;
  customer: CustomerConfig;
  lineItems: LineItem[];
  currency: string;
  discount: number;
  taxRate: number;
  footer: FooterConfig;
  ticket: TicketConfig;
  bill: BillConfig;
  cancellation: CancellationConfig;
}