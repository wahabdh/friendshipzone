'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useProductStore } from '@/store/productStore';
import { useCustomerStore } from '@/store/customerStore';
import { Invoice, InvoiceItem } from '@/types';
import { generateId, generateInvoiceNumber, formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function CreateInvoicePage() {
  const router = useRouter();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const products = useProductStore((state) => state.products);
  const customers = useCustomerStore((state) => state.customers);
  const invoices = useInvoiceStore((state) => state.invoices);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);
  const [taxRate, setTaxRate] = useState(0.08);
  const [notes, setNotes] = useState('');

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0) * (1 - (item.discount || 0) / 100);
    return sum + itemTotal;
  }, 0);
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = product.sellingPrice;
      }
    }

    if (newItems[index].quantity && newItems[index].unitPrice) {
      newItems[index].total =
        (newItems[index].quantity || 0) *
        (newItems[index].unitPrice || 0) *
        (1 - (newItems[index].discount || 0) / 100);
    }

    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert('Please select a customer');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const invoice: Invoice = {
      id: generateId(),
      invoiceNumber: generateInvoiceNumber(invoices.length),
      customerId: selectedCustomerId,
      customerName: selectedCustomer?.name,
      items: items.filter((item) => item.id) as InvoiceItem[],
      subtotal,
      taxRate,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      status: 'draft',
      notes: notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addInvoice(invoice);
    router.push(`/invoices`);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
            <p className="text-muted-foreground mt-1">Create a new customer invoice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="customer">Select Customer</Label>
              <select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">-- Select a customer --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email || 'No email'})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddItem}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No items added yet</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="border border-border rounded p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Product</Label>
                          <select
                            value={item.productId || ''}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full mt-1 px-2 py-2 text-sm border border-border rounded bg-background"
                          >
                            <option value="">Select product...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({formatCurrency(p.sellingPrice)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            className="mt-1 text-sm"
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Unit Price</Label>
                          <Input
                            type="number"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                            className="mt-1 text-sm"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Discount %</Label>
                          <Input
                            type="number"
                            value={item.discount || ''}
                            onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                            className="mt-1 text-sm"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Total</Label>
                          <div className="mt-1 text-sm font-medium bg-muted p-2 rounded">
                            {formatCurrency(item.total || 0)}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveItem(index)}
                        className="w-full gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Item
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Rate:</span>
                  <Input
                    type="number"
                    value={taxRate * 100}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                    className="w-20 text-right text-sm"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="text-right text-sm">%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Amount:</span>
                  <span className="font-medium">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                  <span>Total:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes for the invoice..."
                className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/invoices" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
