/**
 * Currency Formatter
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Percentage Formatter
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return (value * 100).toFixed(decimals) + '%';
};

/**
 * Date Formatter
 */
export const formatDate = (date: Date | string, format: string = 'MM/DD/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', String(year));
};

/**
 * Date Time Formatter
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Number Formatter
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Quantity Formatter
 */
export const formatQuantity = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

/**
 * Phone Number Formatter
 */
export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

/**
 * SKU Formatter - ensure consistent format
 */
export const formatSKU = (sku: string): string => {
  return sku.toUpperCase().replace(/\s/g, '');
};

/**
 * Invoice Number Generator
 */
export const generateInvoiceNumber = (invoiceCount: number): string => {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(invoiceCount + 1).padStart(3, '0')}`;
};

/**
 * Receipt Number Generator
 */
export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `RCP-${timestamp}${random}`;
};

/**
 * PO Number Generator
 */
export const generatePONumber = (poCount: number): string => {
  const year = new Date().getFullYear();
  return `PO-${year}-${String(poCount + 1).padStart(3, '0')}`;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate Text
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};
