'use client';

import { useState } from 'react';
import { usePOSStore } from '@/store/posStore';
import { useProductStore } from '@/store/productStore';
import { formatCurrency, generateReceiptNumber, generateId } from '@/lib/formatters';
import { CartItem, POSTransaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function POSPage() {
  const products = useProductStore((state) => state.products);
  const cart = usePOSStore((state) => state.cart);
  const addToCart = usePOSStore((state) => state.addToCart);
  const removeFromCart = usePOSStore((state) => state.removeFromCart);
  const updateCartItem = usePOSStore((state) => state.updateCartItem);
  const clearCart = usePOSStore((state) => state.clearCart);
  const getCartSubtotal = usePOSStore((state) => state.getCartSubtotal);
  const getCartTotal = usePOSStore((state) => state.getCartTotal);
  const getTaxAmount = usePOSStore((state) => state.getTaxAmount);
  const taxRate = usePOSStore((state) => state.taxRate);
  const completeTransaction = usePOSStore((state) => state.completTransaction);

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');

  const filteredProducts =
    searchQuery.length > 0
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;

  const handleAddProduct = (product: typeof products[0]) => {
    const cartItem: CartItem = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.sellingPrice,
      discount: 0,
      total: product.sellingPrice,
    };
    addToCart(cartItem);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const transaction: POSTransaction = {
      id: generateId(),
      items: cart,
      subtotal: getCartSubtotal(),
      taxRate,
      taxAmount: getTaxAmount(),
      totalAmount: getCartTotal(),
      paymentMethod,
      timestamp: new Date(),
      receiptNumber: generateReceiptNumber(),
    };

    completeTransaction(transaction);
    alert(`Transaction completed! Receipt: ${transaction.receiptNumber}`);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full">
        {/* Products */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Point of Sale</h1>
            <p className="text-muted-foreground">Quick product search and checkout</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:border-primary cursor-pointer transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.quantity}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddProduct(product)}
                      disabled={product.quantity <= 0}
                      className="gap-1 flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-bold text-primary">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4 overflow-y-auto">
          <Card className="sticky top-0 z-10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <CardTitle>Cart ({cart.length})</CardTitle>
              </div>
            </CardHeader>
          </Card>

          {cart.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground py-8">
                <p>Cart is empty</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItem(item.id, { quantity: parseInt(e.target.value) || 1 })
                            }
                            className="w-16 h-8 text-sm"
                          />
                          <span className="text-sm text-muted-foreground flex-1">
                            x {formatCurrency(item.unitPrice)}
                          </span>
                          <span className="font-medium text-sm min-w-fit">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Totals */}
              <Card className="sticky bottom-0 z-10">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getCartSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
                    <span>{formatCurrency(getTaxAmount())}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-3">
                    <span>Total:</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Payment Method</p>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-2 py-2 text-sm border border-border rounded bg-background"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>

                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Checkout
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('Clear the cart?')) {
                        clearCart();
                      }
                    }}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
