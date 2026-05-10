'use client';

import { useProductStore } from '@/store/productStore';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingDown, Package } from 'lucide-react';

export default function InventoryPage() {
  const products = useProductStore((state) => state.products);
  const getLowStockProducts = useProductStore((state) => state.getLowStockProducts);

  const lowStockProducts = getLowStockProducts();
  const outOfStock = products.filter((p) => p.quantity === 0);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track stock levels and inventory value</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Products in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">At cost price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Items below reorder level</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle>Low Stock Items</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">All products have sufficient stock</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4">Product</th>
                      <th className="text-center font-medium py-3 px-4">Current Stock</th>
                      <th className="text-center font-medium py-3 px-4">Reorder Level</th>
                      <th className="text-center font-medium py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-center">{product.quantity}</td>
                        <td className="py-3 px-4 text-center">{product.reorderLevel}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-800">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Out of Stock Products */}
        {outOfStock.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <CardTitle>Out of Stock</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {outOfStock.map((product) => (
                  <div key={product.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="font-medium text-red-900">{product.name}</p>
                    <p className="text-sm text-red-700 mt-1">Code: {product.sku}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Products */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium py-3 px-4">Product</th>
                    <th className="text-center font-medium py-3 px-4">Quantity</th>
                    <th className="text-right font-medium py-3 px-4">Cost</th>
                    <th className="text-right font-medium py-3 px-4">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-medium ${
                            product.quantity <= product.reorderLevel
                              ? 'text-orange-600'
                              : product.quantity === 0
                                ? 'text-red-600'
                                : 'text-green-600'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(product.purchasePrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(product.quantity * product.purchasePrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
