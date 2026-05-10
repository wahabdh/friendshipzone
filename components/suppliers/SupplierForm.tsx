'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  paymentTerms: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (data: Partial<Supplier>) => void;
  onClose: () => void;
}

export function SupplierForm({ initialData, onSubmit, onClose }: SupplierFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          address: initialData.address,
          city: initialData.city,
          postalCode: initialData.postalCode,
          country: initialData.country,
          paymentTerms: initialData.paymentTerms,
        }
      : undefined,
  });

  const handleFormSubmit = (data: SupplierFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Supplier Name *</Label>
        <Input id="name" placeholder="e.g., Tech Supplies Inc" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contact@supplier.com" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="+1-555-1000" {...register('phone')} />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="Street address" {...register('address')} />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="City" {...register('city')} />
          {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" placeholder="12345" {...register('postalCode')} />
          {errors.postalCode && (
            <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" placeholder="USA" {...register('country')} />
        {errors.country && (
          <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input
          id="paymentTerms"
          placeholder="e.g., Net 30"
          {...register('paymentTerms')}
        />
        {errors.paymentTerms && (
          <p className="text-sm text-destructive mt-1">{errors.paymentTerms.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update Supplier' : 'Add Supplier'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
