'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Download, Trash2, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const invoices = useInvoiceStore((state) => state.invoices);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const updateInvoiceStatus = useInvoiceStore((state) => state.updateInvoiceStatus);
  const getInvoicesByStatus = useInvoiceStore((state) => state.getInvoicesByStatus);

  const filteredInvoices =
    statusFilter === 'all'
      ? invoices
      : getInvoicesByStatus(statusFilter as Invoice['status']);

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer invoices ({invoices.length} total)
            </p>
          </div>
          <Link href="/invoices/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No invoices found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4">Invoice #</th>
                      <th className="text-left font-medium py-3 px-4">Customer</th>
                      <th className="text-right font-medium py-3 px-4">Amount</th>
                      <th className="text-left font-medium py-3 px-4">Status</th>
                      <th className="text-left font-medium py-3 px-4">Date</th>
                      <th className="text-center font-medium py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {invoice.invoiceNumber}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{invoice.customerName || 'No customer'}</p>
                            {invoice.customerId && (
                              <p className="text-xs text-muted-foreground">
                                ID: {invoice.customerId.slice(0, 6)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded capitalize ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => setSelectedInvoice(invoice)}
                                  className="p-2 hover:bg-muted rounded transition-colors"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </DialogTrigger>
                              {selectedInvoice && (
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Invoice {selectedInvoice.invoiceNumber}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <InvoicePreview invoice={selectedInvoice} />
                                </DialogContent>
                              )}
                            </Dialog>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
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
