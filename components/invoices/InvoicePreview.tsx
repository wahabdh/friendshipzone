'use client';

import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download with jsPDF
    alert('PDF download will be available soon');
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Invoice */}
      <div className="bg-white text-black p-8 rounded-lg border border-gray-200 print:border-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Invoice</h1>
            <p className="text-sm text-gray-600 mt-1">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">ShopPro</p>
            <p className="text-sm text-gray-600">Management System</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-8 mb-8 border-b border-gray-200 pb-8">
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">BILL TO</h3>
            <p className="font-medium">{invoice.customerName || 'Customer'}</p>
            <p className="text-sm text-gray-600">Invoice Date: {formatDate(invoice.createdAt)}</p>
            {invoice.dueDate && (
              <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
            )}
          </div>
          <div className="text-right">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize text-lg">{invoice.status}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="text-right py-2 text-sm font-semibold text-gray-700">Qty</th>
              <th className="text-right py-2 text-sm font-semibold text-gray-700">Price</th>
              <th className="text-right py-2 text-sm font-semibold text-gray-700">Discount</th>
              <th className="text-right py-2 text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 text-sm">{item.productName}</td>
                <td className="text-right py-3 text-sm">{item.quantity}</td>
                <td className="text-right py-3 text-sm">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-3 text-sm">
                  {item.discount > 0 ? `${item.discount}%` : '-'}
                </td>
                <td className="text-right py-3 text-sm font-medium">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <span>Total:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {invoice.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Method */}
        {invoice.paymentMethod && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold">Payment Method:</span> {invoice.paymentMethod}
          </div>
        )}
      </div>
    </div>
  );
}
