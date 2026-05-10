'use client';

import { useState } from 'react';
import { useCustomerStore } from '@/store/customerStore';
import { formatCurrency, generateId } from '@/lib/formatters';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { CustomerForm } from '@/components/customers/CustomerForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const customers = useCustomerStore((state) => state.customers);
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer);
  const searchCustomers = useCustomerStore((state) => state.searchCustomers);

  const filteredCustomers = searchQuery ? searchCustomers(searchQuery) : customers;

  const handleAddCustomer = (formData: Partial<Customer>) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: formData.name || '',
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      loyaltyPoints: 0,
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addCustomer(newCustomer);
    setIsFormOpen(false);
  };

  const handleUpdateCustomer = (formData: Partial<Customer>) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, formData);
      setSelectedCustomer(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your customer relationships ({customers.length} customers)
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedCustomer(null);
                  setIsFormOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                <DialogDescription>
                  {selectedCustomer
                    ? 'Update customer details'
                    : 'Create a new customer record'}
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                initialData={selectedCustomer || undefined}
                onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedCustomer(null);
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

        {/* Customers Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        ID: {customer.id.slice(0, 8)}...
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsFormOpen(true);
                        }}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.email && (
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm break-all">{customer.email}</p>
                    </div>
                  )}
                  {customer.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{customer.phone}</p>
                    </div>
                  )}
                  {customer.address && (
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm">
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                      </p>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Loyalty Points</p>
                      <p className="text-lg font-bold text-primary">
                        {customer.loyaltyPoints}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Purchases</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(customer.totalPurchases)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
