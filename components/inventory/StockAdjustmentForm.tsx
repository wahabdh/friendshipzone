'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/store/productStore';

const adjustmentSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  adjustmentType: z.enum(['add', 'remove']),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export function StockAdjustmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductStore((state) => state.products);
  const updateProductQuantity = useProductStore((state) => state.updateProductQuantity);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
  });

  const onSubmit = (data: AdjustmentFormData) => {
    const product = products.find((p) => p.id === data.productId);
    if (!product) return;

    const newQuantity = data.adjustmentType === 'add'
      ? product.quantity + data.quantity
      : Math.max(0, product.quantity - data.quantity);

    updateProductQuantity(data.productId, newQuantity);
    reset();
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
        Adjust Stock
      </Button>

      {isOpen && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Adjust Stock Level</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="productId">Product</Label>
                <select
                  id="productId"
                  {...register('productId')}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.quantity})
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <p className="text-sm text-destructive mt-1">{errors.productId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adjustmentType">Type</Label>
                <select
                  id="adjustmentType"
                  {...register('adjustmentType')}
                  className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground"
                >
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                </select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity')}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  {...register('reason')}
                  placeholder="e.g., Stock count adjustment, Damage, Return"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Apply Adjustment</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
