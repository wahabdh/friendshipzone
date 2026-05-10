import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Customer } from '@/types';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;
  searchCustomers: (query: string) => Customer[];
  updateLoyaltyPoints: (id: string, points: number) => void;
}

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'USA',
    loyaltyPoints: 250,
    totalPurchases: 2500,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    postalCode: '90001',
    country: 'USA',
    loyaltyPoints: 180,
    totalPurchases: 1800,
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '+1-555-0103',
    address: '789 Pine Rd',
    city: 'Chicago',
    postalCode: '60601',
    country: 'USA',
    loyaltyPoints: 400,
    totalPurchases: 4200,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2024-01-18'),
  },
];

export const useCustomerStore = create<CustomerStore>()(
  devtools(
    persist(
      (set, get) => ({
        customers: initialCustomers,
        addCustomer: (customer) =>
          set(
            (state) => ({
              customers: [...state.customers, customer],
            }),
            false,
            'addCustomer'
          ),
        updateCustomer: (id, updates) =>
          set(
            (state) => ({
              customers: state.customers.map((c) =>
                c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
              ),
            }),
            false,
            'updateCustomer'
          ),
        deleteCustomer: (id) =>
          set(
            (state) => ({
              customers: state.customers.filter((c) => c.id !== id),
            }),
            false,
            'deleteCustomer'
          ),
        getCustomer: (id) => {
          return get().customers.find((c) => c.id === id);
        },
        searchCustomers: (query) => {
          const lowerQuery = query.toLowerCase();
          return get().customers.filter(
            (c) =>
              c.name.toLowerCase().includes(lowerQuery) ||
              c.email?.toLowerCase().includes(lowerQuery) ||
              c.phone?.includes(query)
          );
        },
        updateLoyaltyPoints: (id, points) => {
          set(
            (state) => ({
              customers: state.customers.map((c) =>
                c.id === id
                  ? { ...c, loyaltyPoints: c.loyaltyPoints + points, updatedAt: new Date() }
                  : c
              ),
            }),
            false,
            'updateLoyaltyPoints'
          );
        },
      }),
      {
        name: 'customer-store',
      }
    )
  )
);
