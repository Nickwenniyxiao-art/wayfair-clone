import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useTranslation();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="font-bold text-xl hidden sm:inline">
                Wayfair Clone
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* Cart */}
            <Link href="/cart">
              <div className="relative cursor-pointer hover:text-blue-600 transition">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:text-blue-600 transition"
                >
                  <User size={24} />
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                    <Link href="/account">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        {t("admin.manageUsers")}
                      </button>
                    </Link>
                    <Link href="/orders">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        {t("admin.viewOrders")}
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
                    >
                      {t("common.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">{t("common.signIn")}</Button>
              </a>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 h-12 border-t">
          <Link href="/products">
            <button
              className={`text-sm font-medium transition ${
                isActive("/products")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              {t("common.products")}
            </button>
          </Link>
          <button className="text-sm font-medium hover:text-blue-600 transition">
            {t("footer.furniture")}
          </button>
          <button className="text-sm font-medium hover:text-blue-600 transition">
            {t("footer.decor")}
          </button>
          <button className="text-sm font-medium hover:text-blue-600 transition">
            {t("footer.lighting")}
          </button>
          <button className="text-sm font-medium hover:text-blue-600 transition">
            {t("footer.sale")}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/products">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                {t("common.products")}
              </button>
            </Link>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              {t("footer.furniture")}
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              {t("footer.decor")}
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              {t("footer.lighting")}
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              {t("footer.sale")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
