import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product } from '@/types';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getLowStockProducts: (threshold?: number) => Product[];
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    purchasePrice: 30,
    sellingPrice: 79.99,
    quantity: 45,
    reorderLevel: 10,
    supplier: 'Tech Supplies Inc',
    barcode: '123456789012',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'USB-C Cable',
    sku: 'USB-001',
    category: 'Accessories',
    purchasePrice: 2,
    sellingPrice: 12.99,
    quantity: 150,
    reorderLevel: 30,
    supplier: 'Tech Supplies Inc',
    barcode: '123456789013',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Phone Case',
    sku: 'PC-001',
    category: 'Accessories',
    purchasePrice: 3.5,
    sellingPrice: 14.99,
    quantity: 8,
    reorderLevel: 20,
    supplier: 'Accessory World',
    barcode: '123456789014',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    name: 'Laptop Stand',
    sku: 'LS-001',
    category: 'Furniture',
    purchasePrice: 25,
    sellingPrice: 49.99,
    quantity: 12,
    reorderLevel: 5,
    supplier: 'Office Supplies Co',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    name: 'Mechanical Keyboard',
    sku: 'MK-001',
    category: 'Electronics',
    purchasePrice: 45,
    sellingPrice: 129.99,
    quantity: 5,
    reorderLevel: 8,
    supplier: 'Tech Supplies Inc',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

export const useProductStore = create<ProductStore>()(
  devtools(
    persist(
      (set, get) => ({
        products: initialProducts,
        addProduct: (product) =>
          set(
            (state) => ({
              products: [...state.products, product],
            }),
            false,
            'addProduct'
          ),
        updateProduct: (id, updates) =>
          set(
            (state) => ({
              products: state.products.map((p) =>
                p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
              ),
            }),
            false,
            'updateProduct'
          ),
        deleteProduct: (id) =>
          set(
            (state) => ({
              products: state.products.filter((p) => p.id !== id),
            }),
            false,
            'deleteProduct'
          ),
        getProduct: (id) => {
          return get().products.find((p) => p.id === id);
        },
        searchProducts: (query) => {
          const lowerQuery = query.toLowerCase();
          return get().products.filter(
            (p) =>
              p.name.toLowerCase().includes(lowerQuery) ||
              p.sku.toLowerCase().includes(lowerQuery) ||
              p.category.toLowerCase().includes(lowerQuery)
          );
        },
        getProductsByCategory: (category) => {
          return get().products.filter((p) => p.category === category);
        },
        getLowStockProducts: (threshold = 0) => {
          return get().products.filter((p) => p.quantity <= (threshold || p.reorderLevel));
        },
      }),
      {
        name: 'product-store',
      }
    )
  )
);
