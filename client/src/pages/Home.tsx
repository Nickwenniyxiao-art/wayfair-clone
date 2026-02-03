import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch featured products
  const { data: featured } = trpc.product.featured.useQuery();
  const { data: cats } = trpc.product.categories.useQuery();

  useEffect(() => {
    if (featured) setFeaturedProducts(featured);
  }, [featured]);

  useEffect(() => {
    if (cats) setCategories(cats);
  }, [cats]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              {t("home.welcome")}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {t("home.subtitle")}
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  {t("home.shopNow")}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href={getLoginUrl()}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                    {t("home.signIn")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.shopByCategory")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer">
                  <h3 className="text-xl font-semibold">{cat.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("home.featuredProducts")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <div className="aspect-square bg-gray-200 overflow-hidden">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.feature1Title")}
              </h3>
              <p className="text-gray-600">
                {t("home.feature1Desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Zap size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.feature2Title")}
              </h3>
              <p className="text-gray-600">
                {t("home.feature2Desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Star size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.feature3Title")}
              </h3>
              <p className="text-gray-600">
                {t("home.feature3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
