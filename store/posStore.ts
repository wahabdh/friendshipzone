import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, POSTransaction } from '@/types';

interface POSStore {
  cart: CartItem[];
  taxRate: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getTaxAmount: () => number;
  setTaxRate: (rate: number) => void;
  completTransaction: (transaction: POSTransaction) => void;
  transactions: POSTransaction[];
  getTransactionsByDate: (date: Date) => POSTransaction[];
}

export const usePOSStore = create<POSStore>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        taxRate: 0.08,
        transactions: [],
        addToCart: (item) =>
          set(
            (state) => {
              const existingItem = state.cart.find((i) => i.productId === item.productId);
              if (existingItem) {
                return {
                  cart: state.cart.map((i) =>
                    i.productId === item.productId
                      ? {
                          ...i,
                          quantity: i.quantity + item.quantity,
                          total: (i.quantity + item.quantity) * i.unitPrice * (1 - i.discount / 100),
                        }
                      : i
                  ),
                };
              }
              return { cart: [...state.cart, item] };
            },
            false,
            'addToCart'
          ),
        removeFromCart: (id) =>
          set(
            (state) => ({
              cart: state.cart.filter((i) => i.id !== id),
            }),
            false,
            'removeFromCart'
          ),
        updateCartItem: (id, updates) =>
          set(
            (state) => ({
              cart: state.cart.map((i) => (i.id === id ? { ...i, ...updates } : i)),
            }),
            false,
            'updateCartItem'
          ),
        clearCart: () =>
          set(
            { cart: [] },
            false,
            'clearCart'
          ),
        getCartSubtotal: () => {
          return get().cart.reduce((sum, item) => sum + item.total, 0);
        },
        getCartTotal: () => {
          const subtotal = get().getCartSubtotal();
          const tax = subtotal * get().taxRate;
          return subtotal + tax;
        },
        getTaxAmount: () => {
          const subtotal = get().getCartSubtotal();
          return subtotal * get().taxRate;
        },
        setTaxRate: (rate) =>
          set({ taxRate: rate }, false, 'setTaxRate'),
        completTransaction: (transaction) =>
          set(
            (state) => ({
              transactions: [...state.transactions, transaction],
              cart: [],
            }),
            false,
            'completeTransaction'
          ),
        getTransactionsByDate: (date) => {
          const dateStr = date.toLocaleDateString();
          return get().transactions.filter(
            (t) => t.timestamp.toLocaleDateString() === dateStr
          );
        },
      }),
      {
        name: 'pos-store',
      }
    )
  )
);
