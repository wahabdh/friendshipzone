'use client';

import { useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { formatCurrency, generateId, formatSKU } from '@/lib/formatters';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { ProductForm } from '@/components/products/ProductForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const getProductsByCategory = useProductStore((state) => state.getProductsByCategory);

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products based on search and category
  const filteredProducts =
    selectedCategory === 'all'
      ? searchQuery
        ? searchProducts(searchQuery)
        : products
      : searchQuery
        ? searchProducts(searchQuery).filter((p) => p.category === selectedCategory)
        : getProductsByCategory(selectedCategory);

  const handleAddProduct = (formData: Partial<Product>) => {
    const newProduct: Product = {
      id: generateId(),
      name: formData.name || '',
      sku: formatSKU(formData.sku || ''),
      category: formData.category || '',
      purchasePrice: formData.purchasePrice || 0,
      sellingPrice: formData.sellingPrice || 0,
      quantity: formData.quantity || 0,
      reorderLevel: formData.reorderLevel || 0,
      supplier: formData.supplier,
      barcode: formData.barcode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addProduct(newProduct);
    setIsFormOpen(false);
  };

  const handleUpdateProduct = (formData: Partial<Product>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, {
        ...formData,
        sku: formatSKU(formData.sku || selectedProduct.sku),
      });
      setSelectedProduct(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory ({filteredProducts.length} products)
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsFormOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {selectedProduct
                    ? 'Update product details'
                    : 'Create a new product in your inventory'}
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                initialData={selectedProduct || undefined}
                onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-3 px-4">Product</th>
                      <th className="text-left font-medium py-3 px-4">SKU</th>
                      <th className="text-left font-medium py-3 px-4">Category</th>
                      <th className="text-right font-medium py-3 px-4">Purchase Price</th>
                      <th className="text-right font-medium py-3 px-4">Selling Price</th>
                      <th className="text-right font-medium py-3 px-4">Stock</th>
                      <th className="text-center font-medium py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {product.supplier || 'No supplier'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {product.sku}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(product.purchasePrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(product.sellingPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-medium ${
                              product.quantity <= product.reorderLevel
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsFormOpen(true);
                              }}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
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
