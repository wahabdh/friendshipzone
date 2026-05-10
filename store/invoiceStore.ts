import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Invoice } from '@/types';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getInvoicesByCustomer: (customerId: string) => Invoice[];
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
}

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'John Smith',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 2,
        unitPrice: 79.99,
        discount: 0,
        total: 159.98,
      },
    ],
    subtotal: 159.98,
    taxRate: 0.08,
    taxAmount: 12.8,
    discountAmount: 0,
    totalAmount: 172.78,
    status: 'paid',
    paymentMethod: 'card',
    createdAt: new Date('2024-01-15'),
    paidDate: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'USB-C Cable',
        quantity: 5,
        unitPrice: 12.99,
        discount: 10,
        total: 58.455,
      },
    ],
    subtotal: 64.95,
    taxRate: 0.08,
    taxAmount: 5.196,
    discountAmount: 6.495,
    totalAmount: 63.651,
    status: 'sent',
    paymentMethod: undefined,
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerId: '3',
    customerName: 'Michael Chen',
    items: [
      {
        id: '1',
        productId: '4',
        productName: 'Laptop Stand',
        quantity: 1,
        unitPrice: 49.99,
        discount: 0,
        total: 49.99,
      },
      {
        id: '2',
        productId: '5',
        productName: 'Mechanical Keyboard',
        quantity: 1,
        unitPrice: 129.99,
        discount: 0,
        total: 129.99,
      },
    ],
    subtotal: 179.98,
    taxRate: 0.08,
    taxAmount: 14.3984,
    discountAmount: 0,
    totalAmount: 194.3784,
    status: 'draft',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
];

export const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    persist(
      (set, get) => ({
        invoices: initialInvoices,
        addInvoice: (invoice) =>
          set(
            (state) => ({
              invoices: [...state.invoices, invoice],
            }),
            false,
            'addInvoice'
          ),
        updateInvoice: (id, updates) =>
          set(
            (state) => ({
              invoices: state.invoices.map((i) =>
                i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
              ),
            }),
            false,
            'updateInvoice'
          ),
        deleteInvoice: (id) =>
          set(
            (state) => ({
              invoices: state.invoices.filter((i) => i.id !== id),
            }),
            false,
            'deleteInvoice'
          ),
        getInvoice: (id) => {
          return get().invoices.find((i) => i.id === id);
        },
        getInvoicesByCustomer: (customerId) => {
          return get().invoices.filter((i) => i.customerId === customerId);
        },
        getInvoicesByStatus: (status) => {
          return get().invoices.filter((i) => i.status === status);
        },
        updateInvoiceStatus: (id, status) => {
          set(
            (state) => ({
              invoices: state.invoices.map((i) =>
                i.id === id
                  ? {
                      ...i,
                      status,
                      paidDate: status === 'paid' ? new Date() : i.paidDate,
                      updatedAt: new Date(),
                    }
                  : i
              ),
            }),
            false,
            'updateInvoiceStatus'
          );
        },
      }),
      {
        name: 'invoice-store',
      }
    )
  )
);
