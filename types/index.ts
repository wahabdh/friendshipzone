// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  supplier?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  createdAt: Date;
  updatedAt: Date;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  paymentTerms?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Types
export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'check' | 'bank_transfer';
  notes?: string;
  createdAt: Date;
  dueDate?: Date;
  paidDate?: Date;
  updatedAt: Date;
}

// Purchase Order Types
export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  notes?: string;
  createdAt: Date;
  expectedDelivery?: Date;
  receivedDate?: Date;
  updatedAt: Date;
}

// Inventory Transaction Types
export type TransactionType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'transfer';

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

// POS Types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface POSTransaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  customerId?: string;
  timestamp: Date;
  receiptNumber: string;
}

// Report Types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  salesByCategory: Record<string, number>;
  salesTrend: Array<{ date: string; amount: number }>;
}

export interface InventoryReport {
  lowStockItems: Product[];
  outOfStockItems: Product[];
  totalInventoryValue: number;
  totalItems: number;
  turnoverRate: number;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalCogs: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

// Settings Types
export interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  currency: string;
  taxRate: number;
  businessLicense?: string;
  logo?: string;
}

export interface ShopSettings extends CompanySettings {
  defaultCustomerDiscount: number;
  enableLoyaltyProgram: boolean;
  loyaltyPointsPerDollar: number;
  defaultPOSPrinter?: string;
  receiptFormat: 'thermal' | 'letter';
  autoBackup: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  todaysSales: number;
  todaysTransactions: number;
  weeksSales: number;
  monthsSales: number;
  lowStockCount: number;
  totalCustomers: number;
  totalSuppliers: number;
  pendingOrders: number;
}
