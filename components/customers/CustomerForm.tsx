'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: Partial<Customer>) => void;
  onClose: () => void;
}

export function CustomerForm({ initialData, onSubmit, onClose }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          address: initialData.address,
          city: initialData.city,
          postalCode: initialData.postalCode,
          country: initialData.country,
        }
      : undefined,
  });

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" placeholder="e.g., John Smith" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="+1-555-0000" {...register('phone')} />
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

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update Customer' : 'Add Customer'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
