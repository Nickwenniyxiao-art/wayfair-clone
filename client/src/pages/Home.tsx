import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart, Star, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
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
              Welcome to Wayfair Clone
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover millions of home furnishings and décor items. Shop now and
              transform your space.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Shop Now
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  {category.icon && (
                    <div className="text-4xl mb-3 text-center">{category.icon}</div>
                  )}
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Limited Time Offer</h2>
          <p className="text-lg mb-6">Get 20% off on all furniture items this week!</p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-slate-100">
            Shop Sale
          </Button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
              <p className="text-gray-600">Products Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Satisfaction Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isAuthenticated
              ? `Welcome back, ${user?.name}!`
              : "Join Our Community"}
          </h2>
          <p className="text-lg text-slate-300 mb-6">
            {isAuthenticated
              ? "Continue shopping and manage your orders"
              : "Create an account to save your favorites and track orders"}
          </p>
          {!isAuthenticated && (
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Product Card Component
 */
function ProductCard({ product }: { product: any }) {
  const addToCartMutation = trpc.cart.add.useMutation();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity,
      });
      // Show success toast
      alert("Added to cart!");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images.length > 0 ? images[0] : "/placeholder-product.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative bg-slate-200 h-48 overflow-hidden cursor-pointer">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating || 0) ? "fill-current" : ""}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs mb-3">
          {product.stock > 0 ? (
            <span className="text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addToCartMutation.isPending}
          className="w-full"
          size="sm"
        >
          <ShoppingCart size={16} className="mr-2" />
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}
