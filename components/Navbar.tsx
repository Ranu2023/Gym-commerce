"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import type { AuthUser } from "@/lib/types";
import api from "@/lib/axios";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await api.get("/cart");
      if (response.data.success && response.data.data) {
        const totalItems = response.data.data.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#e5e7eb] text-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo-2.png"
              alt="Logo"
              width={130}
              height={130}
              className="h-15 w-15"
              priority
            />
            <span className="text-xl font-bold text-white hidden sm:inline">
              MUSCLE DECODE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-gray-900 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-blue-600 transition-colors"
            >
              Products
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <Package className="h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </>
                )}

                {user.role === "delivery" && (
                  <Link
                    href="/delivery"
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Delivery</span>
                  </Link>
                )}

                {user.role === "user" && (
                  <Link
                    href="/cart"
                    className="relative hover:text-blue-600"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-900 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {user ? (
                <>
                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manage Orders
                      </Link>
                    </>
                  )}

                  {user.role === "delivery" && (
                    <Link
                      href="/delivery"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Delivery Dashboard
                    </Link>
                  )}

                  {user.role === "user" && (
                    <Link
                      href="/cart"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart ({cartCount})
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
