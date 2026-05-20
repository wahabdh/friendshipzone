'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          (prev + 1) % Math.min(3, menuItems.length)
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [menuItems]);

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
      setCartItems(
        cartItems.map(ci =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1
        }
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(ci => ci.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(
        cartItems.map(ci =>
          ci.id === id ? { ...ci, quantity } : ci
        )
      );
    }
  };

  const sendWhatsAppMessage = () => {
    if (!customerName.trim() || !customerAddress.trim()) {
      alert('Please enter your name and address');
      return;
    }

    let message = `Name: ${customerName}\nAddress: ${customerAddress}\n\nOrder Details:\n`;

    cartItems.forEach(item => {
      message += `${item.name} x${item.quantity} (Rs. ${item.price * item.quantity})\n`;
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    message += `\nTotal: Rs. ${total}`;

    const encoded = encodeURIComponent(message);

    window.open(
      `https://wa.me/923069293923?text=${encoded}`,
      '_blank'
    );
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="text-2xl font-bold italic">
            🍔 Nawala (نوالہ)
          </div>

          <div className="flex items-center gap-4">

            {!adminToken && (
              <button
                onClick={() => setView('cart')}
                className="relative hover:bg-red-700 p-2 rounded transition"
              >
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>

        </div>

      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {view === 'menu' && (
          <div>

            {/* Slider */}
            {menuItems.length > 0 && (
              <div className="mb-16">

                <div className="relative group">

                  <div className="overflow-hidden rounded-3xl shadow-2xl">

                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                      }}
                    >

                      {menuItems.slice(0, 3).map((item) => (

                        <div key={item.id} className="min-w-full">

                          <div className="relative h-96 overflow-hidden">

                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 flex flex-col justify-between p-8">

                              <div>
                                <span className="inline-block bg-yellow-400 text-red-700 px-4 py-1 rounded-full font-bold text-sm mb-4">
                                  Featured
                                </span>

                                <h2 className="text-5xl font-bold text-white mb-3">
                                  {item.name}
                                </h2>

                                <p className="text-white text-lg">
                                  {item.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between">

                                <span className="text-4xl font-bold text-yellow-300">
                                  Rs. {item.price}
                                </span>

                                <Button
                                  onClick={() => addToCart(item)}
                                  className="bg-white text-red-600 hover:bg-gray-100"
                                >
                                  Add to Cart
                                </Button>

                              </div>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* Left */}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        (prev - 1 + Math.min(3, menuItems.length)) %
                        Math.min(3, menuItems.length)
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 p-3 rounded-full"
                  >
                    <ChevronLeft size={28} />
                  </button>

                  {/* Right */}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        (prev + 1) % Math.min(3, menuItems.length)
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 p-3 rounded-full"
                  >
                    <ChevronRight size={28} />
                  </button>

                </div>

              </div>
            )}

            <h1 className="text-4xl font-bold text-red-600 mb-8">
              Home Made Taste, Bilkul Ghar Jaisa
            </h1>

            {loading ? (
              <div className="text-center py-12">
                Loading menu...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {menuItems.map(item => (

                  <Card
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-72 object-cover"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">

                      <h3 className="text-white text-lg font-bold">
                        {item.name}
                      </h3>

                      <p className="text-gray-200 text-sm">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">

                        <span className="text-yellow-400 font-bold">
                          Rs. {item.price}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Add
                        </Button>

                      </div>

                    </div>

                  </Card>

                ))}

              </div>
            )}

          </div>
        )}

        {/* Cart */}
        {view === 'cart' && (
          <div className="max-w-2xl mx-auto">

            <h1 className="text-3xl font-bold text-red-600 mb-8">
              Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              <Card className="p-8 text-center">

                <p className="text-gray-600 text-lg">
                  Your cart is empty
                </p>

                <Button
                  onClick={() => setView('menu')}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Continue Shopping
                </Button>

              </Card>
            ) : (
              <>
                <Card className="p-6 mb-8">

                  <div className="space-y-4">

                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                    />

                    <Input
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Delivery Address"
                    />

                  </div>

                </Card>

                <div className="space-y-4 mb-8">

                  {cartItems.map(item => (

                    <Card
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >

                      <div>
                        <h3 className="font-bold">
                          {item.name}
                        </h3>

                        <p>
                          Rs. {item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="bg-gray-300 px-2 py-1 rounded"
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-gray-300 px-2 py-1 rounded"
                          >
                            +
                          </button>

                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>

                      </div>

                    </Card>

                  ))}

                </div>

                <Card className="p-6">

                  <div className="flex justify-between items-center mb-6">

                    <span className="text-xl font-bold">
                      Total:
                    </span>

                    <span className="text-3xl font-bold text-red-600">
                      Rs. {cartTotal}
                    </span>

                  </div>

                  <Button
                    onClick={sendWhatsAppMessage}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Order on WhatsApp
                  </Button>

                </Card>
              </>
            )}

          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">

        <div className="max-w-7xl mx-auto px-4 py-16">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div>
              <h3 className="text-3xl font-bold italic mb-4">
                🍔 Nawala
              </h3>

              <p className="text-gray-400">
                Home Made Taste, Bilkul Ghar Jaisa
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">
                Quick Links
              </h4>

              <ul className="space-y-2 text-gray-400">
                <li>Menu</li>
                <li>Featured</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">
                Contact
              </h4>

              <div className="space-y-3 text-gray-400">

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  Islamabad, Pakistan
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  +92 306 9293923
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  info@nawala.pk
                </div>

              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">
                Follow Us
              </h4>

              <div className="flex gap-4">

                <Instagram />

                <Facebook />

                <Twitter />

              </div>
            </div>

          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
            © 2026 Nawala Restaurant. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}
