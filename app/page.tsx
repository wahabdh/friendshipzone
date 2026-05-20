'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ name: '', price: '', description: '', image: '' });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
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
      message = `  Name: ${customerName}\n Address: ${customerAddress}\n\n Order Details:\n`;
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
<nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">

  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

    {/* Logo */}
    <div className="text-2xl font-bold italic">
      🍔 Nawala (نوالہ)
    </div>

    {/* Right side icons */}
    <div className="flex items-center gap-4">

      {/* Cart icon always visible */}
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

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden"
      >
        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

    </div>

  </div>

  {/* Mobile Menu */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-red-600 px-4 pb-4 space-y-2">

      {adminToken && (
        <>
          <button
            onClick={() => { setView('menu'); setMobileMenuOpen(false); }}
            className="block w-full text-left hover:bg-red-700 px-3 py-2 rounded"
          >
            Menu
          </button>

          <button
            onClick={() => { setView('admin-dashboard'); setMobileMenuOpen(false); }}
            className="block w-full text-left hover:bg-red-700 px-3 py-2 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => { setAdminToken(null); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 hover:bg-red-700 px-3 py-2 rounded"
          >
            <LogOut size={18} /> Logout
          </button>
        </>
      )}

    </div>
  )}
</nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Menu View */}
        {view === 'menu' && (
          <div>
		  {/* Featured Items Carousel */}
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

              <div className="relative h-96 bg-gradient-to-br from-red-600 to-red-700 overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-8 bg-black/30">

                  <div className="text-white">

                    <span className="inline-block bg-yellow-400 text-red-700 px-4 py-1 rounded-full font-bold text-sm mb-4">
                      Featured
                    </span>

                    <h3 className="text-5xl font-bold text-white mb-3">
                      {item.name}
                    </h3>

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
                      className="bg-white hover:bg-gray-100 text-red-600 font-bold px-8 py-3 rounded-full text-lg"
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

      {/* Left Arrow */}
      <button
        onClick={() =>
          setCurrentSlide((prev) =>
            (prev - 1 + Math.min(3, menuItems.length)) %
            Math.min(3, menuItems.length)
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 p-3 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() =>
          setCurrentSlide((prev) =>
            (prev + 1) % Math.min(3, menuItems.length)
          )
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-red-600 p-3 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">

        {[0, 1, 2].map((index) => (

          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition ${
              currentSlide === index
                ? 'bg-red-600 w-8'
                : 'bg-gray-300 w-3'
            }`}
          />

        ))}

      </div>

    </div>

  </div>
)}
            <h1 className="text-4xl font-bold text-red-600 mb-8">Home Made Taste, Bilkul Ghar Jaisa</h1>
            {loading ? (
              <div className="text-center py-12">Loading menu...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
            <Card className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500">

  {/* Image */}
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {/* TOP TITLE (Desktop only, disappears on hover) */}
 <h3 className="
  hidden md:flex
  absolute inset-0
  items-center justify-center
  text-white text-xl md:text-2xl
  font-bold
  z-10
  pointer-events-none
  text-center
  opacity-100
  md:group-hover:opacity-0
  transition-opacity duration-300
">
    <span className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
      {item.name}
    </span>
  </h3>

  {/* DESKTOP HOVER OVERLAY ONLY (FIXED: hidden on mobile) */}
  <div className="
    hidden md:flex
    absolute inset-0
    bg-black/60
    opacity-0
    group-hover:opacity-100
    transition-all duration-500
    flex-col justify-end p-6
  ">

    <h3 className="text-white text-xl font-bold mb-2">
      {item.name}
    </h3>

    <p className="text-gray-200 text-sm mb-4 line-clamp-2">
      {item.description}
    </p>

    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-yellow-400">
        Rs. {item.price}
      </span>

      <Button
        onClick={() => addToCart(item)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Add to Cart
      </Button>
    </div>

  </div>

  {/* MOBILE BOTTOM INFO ONLY (NO OVERLAY) */}
  <div className="
    md:hidden
    absolute bottom-0 left-0 right-0
    bg-black/60
    p-3
  ">
    <h3 className="text-white text-sm font-bold">
      {item.name}
    </h3>

    <p className="text-gray-200 text-xs line-clamp-1">
      {item.description}
    </p>

    <div className="flex items-center justify-between mt-1">
      <span className="text-yellow-400 font-bold text-sm">
        Rs. {item.price}
      </span>

      <Button
        size="sm"
        onClick={() => addToCart(item)}
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
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
	
	{/* Modern Footer */}
<footer className="bg-gray-900 text-white mt-20">

  <div className="max-w-7xl mx-auto px-4 py-16">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

      {/* Brand */}
      <div className="space-y-4">

        <h3 className="text-3xl font-bold italic">
          🍔 Nawala
        </h3>

        <p className="text-gray-400">
          Home Made Taste, Bilkul Ghar Jaisa
        </p>

        <p className="text-gray-500 text-sm">
          Delivering authentic homemade food with love and care.
        </p>

      </div>

      {/* Quick Links */}
      <div>

        <h4 className="text-xl font-bold mb-6">
          Quick Links
        </h4>

        <ul className="space-y-2 text-gray-400">

          <li>
            <button
              onClick={() => setView('menu')}
              className="hover:text-red-600 transition"
            >
              Our Menu
            </button>
          </li>

          <li>
            <a href="#" className="hover:text-red-600 transition">
              Featured Items
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-red-600 transition">
              Contact Us
            </a>
          </li>

        </ul>

      </div>

      {/* Contact */}
      <div>

        <h4 className="text-xl font-bold mb-6">
          Contact Info
        </h4>

        <div className="space-y-4 text-gray-400">

          <div className="flex items-start gap-3">

            <MapPin
              size={20}
              className="mt-1 text-red-600 flex-shrink-0"
            />

            <div>
              <p className="font-semibold text-white">
                Address
              </p>

              <p className="text-sm">
                Islamabad, Pakistan
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <Phone size={20} className="text-red-600" />

            <div>
              <p className="font-semibold text-white">
                Phone
              </p>

              <a
                href="tel:+923069293923"
                className="hover:text-red-600 transition"
              >
                +92 306 9293923
              </a>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Mail size={20} className="text-red-600" />

            <div>
              <p className="font-semibold text-white">
                Email
              </p>

              <a
                href="mailto:info@nawala.pk"
                className="hover:text-red-600 transition"
              >
                info@nawala.pk
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* Social */}
      <div>

        <h4 className="text-xl font-bold mb-6">
          Follow Us
        </h4>

        <div className="space-y-3">

          <a
            href="https://instagram.com"
            target="_blank"
            className="flex items-center gap-3 text-gray-400 hover:text-red-600 transition"
          >
            <Instagram size={24} />
            <span>Instagram</span>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            className="flex items-center gap-3 text-gray-400 hover:text-red-600 transition"
          >
            <Facebook size={24} />
            <span>Facebook</span>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            className="flex items-center gap-3 text-gray-400 hover:text-red-600 transition"
          >
            <Twitter size={24} />
            <span>Twitter</span>
          </a>

        </div>

      </div>

    </div>

    {/* Google Maps */}
    <div className="mb-12 rounded-2xl overflow-hidden border-2 border-red-600">

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13284.518775848758!2d73.0479!3d33.6844"
        width="100%"
        height="300"
        loading="lazy"
        className="w-full border-0"
      ></iframe>

    </div>

    {/* Bottom */}
    <div className="border-t border-gray-700 pt-8">

      <div className="flex flex-col md:flex-row justify-between items-center">

        <p className="text-gray-500 text-sm">
          © 2026 Nawala Restaurant. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-500">

          <a href="#" className="hover:text-red-600 transition">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-red-600 transition">
            Terms
          </a>

        </div>

      </div>

    </div>

  </div>

</footer>
  );
}
