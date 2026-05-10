'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useCustomerStore } from '@/store/customerStore';
import { usePOSStore } from '@/store/posStore';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  todaysSales: number;
  totalCustomers: number;
  lowStockCount: number;
  totalInvoices: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todaysSales: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    totalInvoices: 0,
  });

  const products = useProductStore((state) => state.products);
  const customers = useCustomerStore((state) => state.customers);
  const invoices = useInvoiceStore((state) => state.invoices);
  const transactions = usePOSStore((state) => state.transactions);

  useEffect(() => {
    // Calculate statistics
    const lowStock = products.filter((p) => p.quantity <= p.reorderLevel).length;
    const todayTransactions = transactions.filter((t) => {
      const today = new Date();
      return t.timestamp.toDateString() === today.toDateString();
    });
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

    setStats({
      todaysSales: todaySales,
      totalCustomers: customers.length,
      lowStockCount: lowStock,
      totalInvoices: invoices.length,
    });
  }, [products, customers, invoices, transactions]);

  // Sample chart data
  const salesData = [
    { date: 'Mon', sales: 1200 },
    { date: 'Tue', sales: 1900 },
    { date: 'Wed', sales: 1600 },
    { date: 'Thu', sales: 2200 },
    { date: 'Fri', sales: 2800 },
    { date: 'Sat', sales: 2400 },
    { date: 'Sun', sales: 1800 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Accessories', value: 45 },
    { name: 'Furniture', value: 20 },
  ];

  const COLORS = ['#2563eb', '#60a5fa', '#93c5fd'];

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your shop management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Today&apos;s Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.todaysSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">Active customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.lowStockCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
              <CardDescription>Sales trend over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
