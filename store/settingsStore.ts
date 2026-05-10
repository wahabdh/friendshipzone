import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ShopSettings } from '@/types';

interface SettingsStore {
  settings: ShopSettings;
  updateSettings: (settings: Partial<ShopSettings>) => void;
  getSettings: () => ShopSettings;
}

const initialSettings: ShopSettings = {
  companyName: 'My Shop',
  email: 'contact@myshop.com',
  phone: '+1-555-0000',
  address: '123 Business Street',
  city: 'New York',
  postalCode: '10001',
  country: 'USA',
  currency: 'USD',
  taxRate: 0.08,
  businessLicense: 'BL-2024-001',
  defaultCustomerDiscount: 0,
  enableLoyaltyProgram: true,
  loyaltyPointsPerDollar: 1,
  receiptFormat: 'letter',
  autoBackup: true,
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        settings: initialSettings,
        updateSettings: (updates) =>
          set(
            (state) => ({
              settings: { ...state.settings, ...updates },
            }),
            false,
            'updateSettings'
          ),
        getSettings: () => {
          return get().settings;
        },
      }),
      {
        name: 'settings-store',
      }
    )
  )
);
