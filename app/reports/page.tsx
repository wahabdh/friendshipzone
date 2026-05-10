'use client';

import { useMemo } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { usePOSStore } from '@/store/posStore';
import { useProductStore } from '@/store/productStore';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const transactions = usePOSStore((state) => state.transactions);
  const products = useProductStore((state) => state.products);
  const getLowStockProducts = useProductStore((state) => state.getLowStockProducts);

  // Calculate sales metrics
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const totalInvoicedSales = paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPOSSales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalSales = totalInvoicedSales + totalPOSSales;

  const averageInvoiceValue =
    paidInvoices.length > 0 ? totalInvoicedSales / paidInvoices.length : 0;

  // Low stock data
  const lowStockProducts = getLowStockProducts();
  const lowStockValue = lowStockProducts.reduce(
    (sum, p) => sum + p.quantity * p.purchasePrice,
    0
  );

  // Chart data
  const salesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    products.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + p.quantity * p.sellingPrice;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [products]);

  const inventoryTurnovData = useMemo(() => {
    return products.slice(0, 10).map((p) => ({
      name: p.name.slice(0, 10),
      value: p.quantity,
    }));
  }, [products]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Business insights and performance metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {paidInvoices.length + transactions.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageInvoiceValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {paidInvoices.length} paid invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  invoices
                    .filter((i) => i.status === 'sent')
                    .reduce((sum, i) => sum + i.totalAmount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {invoices.filter((i) => i.status === 'sent').length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Low Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(lowStockValue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockProducts.length} items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Product Value by Category</CardTitle>
              <CardDescription>Current inventory value distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Products by Quantity</CardTitle>
              <CardDescription>Inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={inventoryTurnovData}
                  layout="vertical"
                  margin={{ left: 80, right: 30, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
            <CardDescription>Summary of all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.status === 'draft').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.status === 'sent').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.status === 'paid').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.status === 'overdue').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Best and worst performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Highest Value Products</h4>
                <div className="space-y-2">
                  {products
                    .sort((a, b) => b.quantity * b.sellingPrice - a.quantity * a.sellingPrice)
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="flex justify-between text-sm">
                        <span className="text-foreground">{p.name}</span>
                        <span className="font-medium">
                          {formatCurrency(p.quantity * p.sellingPrice)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Lowest Stock</h4>
                <div className="space-y-2">
                  {products
                    .sort((a, b) => a.quantity - b.quantity)
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="flex justify-between text-sm">
                        <span className="text-foreground">{p.name}</span>
                        <span
                          className={`font-medium ${
                            p.quantity === 0 ? 'text-red-600' : 'text-orange-600'
                          }`}
                        >
                          {p.quantity} units
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
