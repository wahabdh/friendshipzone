'use client';

import { useState } from 'react';
import { useSupplierStore } from '@/store/supplierStore';
import { generateId } from '@/lib/formatters';
import { Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const suppliers = useSupplierStore((state) => state.suppliers);
  const addSupplier = useSupplierStore((state) => state.addSupplier);
  const updateSupplier = useSupplierStore((state) => state.updateSupplier);
  const deleteSupplier = useSupplierStore((state) => state.deleteSupplier);
  const searchSuppliers = useSupplierStore((state) => state.searchSuppliers);

  const filteredSuppliers = searchQuery ? searchSuppliers(searchQuery) : suppliers;

  const handleAddSupplier = (formData: Partial<Supplier>) => {
    const newSupplier: Supplier = {
      id: generateId(),
      name: formData.name || '',
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      paymentTerms: formData.paymentTerms,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addSupplier(newSupplier);
    setIsFormOpen(false);
  };

  const handleUpdateSupplier = (formData: Partial<Supplier>) => {
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, formData);
      setSelectedSupplier(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your suppliers ({suppliers.length} suppliers)
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedSupplier(null);
                  setIsFormOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                <DialogDescription>
                  {selectedSupplier
                    ? 'Update supplier details'
                    : 'Create a new supplier record'}
                </DialogDescription>
              </DialogHeader>
              <SupplierForm
                initialData={selectedSupplier || undefined}
                onSubmit={selectedSupplier ? handleUpdateSupplier : handleAddSupplier}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedSupplier(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No suppliers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4">Supplier</th>
                      <th className="text-left font-medium py-3 px-4">Email</th>
                      <th className="text-left font-medium py-3 px-4">Phone</th>
                      <th className="text-left font-medium py-3 px-4">Payment Terms</th>
                      <th className="text-left font-medium py-3 px-4">Location</th>
                      <th className="text-center font-medium py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{supplier.name}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {supplier.email || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {supplier.phone || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {supplier.paymentTerms && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {supplier.paymentTerms}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {supplier.city && supplier.country
                            ? `${supplier.city}, ${supplier.country}`
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsFormOpen(true);
                              }}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="p-2 hover:bg-destructive/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
