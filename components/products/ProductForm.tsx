'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be positive'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be positive'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be non-negative'),
  reorderLevel: z.coerce.number().int().min(0, 'Reorder level must be non-negative'),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onClose: () => void;
}

export function ProductForm({ initialData, onSubmit, onClose }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          sku: initialData.sku,
          category: initialData.category,
          purchasePrice: initialData.purchasePrice,
          sellingPrice: initialData.sellingPrice,
          quantity: initialData.quantity,
          reorderLevel: initialData.reorderLevel,
          supplier: initialData.supplier,
          barcode: initialData.barcode,
        }
      : undefined,
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" placeholder="e.g., Wireless Headphones" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" placeholder="e.g., WH-001" {...register('sku')} />
          {errors.sku && <p className="text-sm text-destructive mt-1">{errors.sku.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="e.g., Electronics" {...register('category')} />
          {errors.category && (
            <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('purchasePrice')}
          />
          {errors.purchasePrice && (
            <p className="text-sm text-destructive mt-1">{errors.purchasePrice.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="sellingPrice">Selling Price</Label>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('sellingPrice')}
          />
          {errors.sellingPrice && (
            <p className="text-sm text-destructive mt-1">{errors.sellingPrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="reorderLevel">Reorder Level</Label>
          <Input
            id="reorderLevel"
            type="number"
            placeholder="0"
            {...register('reorderLevel')}
          />
          {errors.reorderLevel && (
            <p className="text-sm text-destructive mt-1">{errors.reorderLevel.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="supplier">Supplier (Optional)</Label>
        <Input id="supplier" placeholder="Supplier name" {...register('supplier')} />
      </div>

      <div>
        <Label htmlFor="barcode">Barcode (Optional)</Label>
        <Input id="barcode" placeholder="e.g., 123456789012" {...register('barcode')} />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
