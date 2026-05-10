'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShopSettings } from '@/types';

export default function SettingsPage() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const [formData, setFormData] = useState<ShopSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? parseFloat(value)
            : value,
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your shop configuration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic shop details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Shop Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="My Shop"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@shop.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1-555-0000"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="USA"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="USD"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Tax & Pricing</CardTitle>
              <CardDescription>Default tax rate and pricing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.01"
                  value={formData.taxRate * 100}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      taxRate: parseFloat(e.target.value) / 100,
                    }))
                  }
                  placeholder="8.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="defaultCustomerDiscount">
                  Default Customer Discount (%)
                </Label>
                <Input
                  id="defaultCustomerDiscount"
                  name="defaultCustomerDiscount"
                  type="number"
                  step="0.01"
                  value={formData.defaultCustomerDiscount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Program */}
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program</CardTitle>
              <CardDescription>Enable rewards for customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableLoyaltyProgram"
                  name="enableLoyaltyProgram"
                  checked={formData.enableLoyaltyProgram}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="enableLoyaltyProgram">Enable Loyalty Program</Label>
              </div>

              {formData.enableLoyaltyProgram && (
                <div>
                  <Label htmlFor="loyaltyPointsPerDollar">
                    Points per Dollar Spent
                  </Label>
                  <Input
                    id="loyaltyPointsPerDollar"
                    name="loyaltyPointsPerDollar"
                    type="number"
                    step="0.1"
                    value={formData.loyaltyPointsPerDollar}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* POS Settings */}
          <Card>
            <CardHeader>
              <CardTitle>POS Settings</CardTitle>
              <CardDescription>Point of Sale configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receiptFormat">Receipt Format</Label>
                <select
                  id="receiptFormat"
                  name="receiptFormat"
                  value={formData.receiptFormat}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="thermal">Thermal Printer</option>
                  <option value="letter">Letter Size</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoBackup"
                  name="autoBackup"
                  checked={formData.autoBackup}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="autoBackup">Enable Auto Backup</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save Settings
            </Button>
          </div>

          {isSaved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              Settings saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
