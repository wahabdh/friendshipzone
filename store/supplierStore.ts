import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Supplier } from '@/types';

interface SupplierStore {
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplier: (id: string) => Supplier | undefined;
  searchSuppliers: (query: string) => Supplier[];
}

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Supplies Inc',
    email: 'contact@techsupplies.com',
    phone: '+1-555-1001',
    address: '100 Tech Park',
    city: 'San Francisco',
    postalCode: '94102',
    country: 'USA',
    paymentTerms: 'Net 30',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Accessory World',
    email: 'sales@accessoryworld.com',
    phone: '+1-555-1002',
    address: '250 Commerce Blvd',
    city: 'Dallas',
    postalCode: '75201',
    country: 'USA',
    paymentTerms: 'Net 45',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Office Supplies Co',
    email: 'orders@officesupplies.com',
    phone: '+1-555-1003',
    address: '500 Supply Ave',
    city: 'Boston',
    postalCode: '02101',
    country: 'USA',
    paymentTerms: 'Net 60',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2024-01-12'),
  },
];

export const useSupplierStore = create<SupplierStore>()(
  devtools(
    persist(
      (set, get) => ({
        suppliers: initialSuppliers,
        addSupplier: (supplier) =>
          set(
            (state) => ({
              suppliers: [...state.suppliers, supplier],
            }),
            false,
            'addSupplier'
          ),
        updateSupplier: (id, updates) =>
          set(
            (state) => ({
              suppliers: state.suppliers.map((s) =>
                s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
              ),
            }),
            false,
            'updateSupplier'
          ),
        deleteSupplier: (id) =>
          set(
            (state) => ({
              suppliers: state.suppliers.filter((s) => s.id !== id),
            }),
            false,
            'deleteSupplier'
          ),
        getSupplier: (id) => {
          return get().suppliers.find((s) => s.id === id);
        },
        searchSuppliers: (query) => {
          const lowerQuery = query.toLowerCase();
          return get().suppliers.filter(
            (s) =>
              s.name.toLowerCase().includes(lowerQuery) ||
              s.email?.toLowerCase().includes(lowerQuery) ||
              s.phone?.includes(query)
          );
        },
      }),
      {
        name: 'supplier-store',
      }
    )
  )
);
