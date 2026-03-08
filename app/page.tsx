'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Home() {
  const [view, setView] = useState<'menu' | 'cart' | 'admin-login' | 'admin-dashboard'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ name: '', price: '', description: '', image: '' });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existing = cartItems.find(ci => ci.id === item.id);
    if (existing) {
      setCartItems(cartItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      ));
    } else {
      setCartItems([...cartItems, { id: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(ci => ci.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(cartItems.map(ci =>
        ci.id === id ? { ...ci, quantity } : ci
      ));
    }
  };

  const sendWhatsAppMessage = (itemName?: string) => {
    let message = "";
    if (itemName) {
      message = `Hi, I'm interested in ordering ${itemName}.`;
    } else {
      if (!customerName.trim() || !customerAddress.trim()) {
        alert('Please enter your name and address');
        return;
      }
      message = ` Name: ${customerName}\n Address: ${customerAddress}\n\n Order Details:\n`;
      cartItems.forEach(item => {
        message += `${item.name} x${item.quantity} (Rs. ${item.price * item.quantity})\n`;
      });
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      message += `\n Total: Rs. ${total}`;
    }
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923069293923?text=${encoded}`, '_blank');
  };

  const handleAdminLogin = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword })
    });
    const data = await res.json();
    if (data.success) {
      setAdminToken(data.token);
      setView('admin-dashboard');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAddMenuItem = async () => {
    if (!newItemForm.name || !newItemForm.price) return;
    const newItem = {
      name: newItemForm.name,
      price: parseInt(newItemForm.price),
      description: newItemForm.description,
      image: newItemForm.image || '/placeholder.jpg'
    };
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const data = await res.json();
    setMenuItems([...menuItems, data]);
    setNewItemForm({ name: '', price: '', description: '', image: '' });
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });
    const data = await res.json();
    setMenuItems(menuItems.map(m => m.id === data.id ? data : m));
    setEditingItem(null);
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  const handleLogout = () => {
    setAdminToken(null);
    setView('menu');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold and italic">🍔 Nawala (نوالہ)</div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex gap-4 flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 absolute md:static top-16 left-0 right-0 md:top-auto md:left-auto md:right-auto bg-red-600 md:bg-transparent p-4 md:p-0`}>
            {adminToken && (
              <>
                <button
                  onClick={() => { setView('menu'); setMobileMenuOpen(false); }}
                  className="hover:bg-red-700 px-3 py-2 rounded transition"
                >
                  Menu
                </button>
                <button
                  onClick={() => { setView('admin-dashboard'); setMobileMenuOpen(false); }}
                  className="hover:bg-red-700 px-3 py-2 rounded transition"
                >
                  Dashboard
                </button>
              </>
            )}

            {!adminToken && (
              <button
                onClick={() => { setView('cart'); setMobileMenuOpen(false); }}
                className="hover:bg-red-700 px-3 py-2 rounded flex items-center gap-2 relative transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="bg-yellow-400 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {adminToken && (
              <button
                onClick={handleLogout}
                className="hover:bg-red-700 px-3 py-2 rounded flex items-center gap-2 transition"
              >
                <LogOut size={20} /> Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Menu View */}
        {view === 'menu' && (
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-8">Our Menu</h1>
            {loading ? (
              <div className="text-center py-12">Loading menu...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover bg-gray-200"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-red-600">Rs. {item.price}</span>
                        <Button
                          onClick={() => addToCart(item)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart View */}
        {view === 'cart' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-red-600 mb-8">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 text-lg">Your cart is empty</p>
                <Button
                  onClick={() => setView('menu')}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Continue Shopping
                </Button>
              </Card>
            ) : (
              <>
                <Card className="p-6 bg-blue-50 border-2 border-blue-400 mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Delivery Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <Input
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Enter your full address"
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>

                <div className="space-y-4 mb-8">
                  {cartItems.map(item => (
                    <Card key={item.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <p className="text-gray-600">Rs. {item.price} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-red-600 w-20 text-right">
                          Rs. {item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="p-6 bg-red-50 border-2 border-red-600">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-3xl font-bold text-red-600">Rs. {cartTotal}</span>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setView('menu')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      onClick={() => sendWhatsAppMessage()}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Order on WhatsApp
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
