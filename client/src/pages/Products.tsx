import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, ShoppingCart, Search } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Fetch data
  const { data: categories } = trpc.product.categories.useQuery();
  const { data: products, isLoading } = trpc.product.list.useQuery({
    limit: 20,
    offset: (page - 1) * 20,
    categoryId: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const categoryId = params.get("category");
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    }
  }, [location]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">{t("products.title")}</h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder={t("products.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="font-bold text-lg mb-4">{t("products.filters")}</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t("products.category")}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`block text-sm w-full text-left px-3 py-2 rounded ${
                      selectedCategory === null
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {t("products.allCategories")}
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`block text-sm w-full text-left px-3 py-2 rounded ${
                        selectedCategory === cat.id
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t("products.priceRange")}</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={5000}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">{t("products.rating")}</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">& Up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setPriceRange([0, 5000]);
                  setPage(1);
                }}
              >
                {t("products.clearFilters")}
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {t("products.showing")} {products?.length || 0} {t("products.title")}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("products.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("products.newest")}</SelectItem>
                  <SelectItem value="price-low">{t("products.priceLowToHigh")}</SelectItem>
                  <SelectItem value="price-high">{t("products.priceHighToLow")}</SelectItem>
                  <SelectItem value="rating">{t("products.topRated")}</SelectItem>
                  <SelectItem value="popular">{t("products.mostPopular")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    {t("products.previous")}
                  </Button>
                  <Button variant="outline" disabled>
                    {t("products.showing")} {page}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!products || products.length < 20}
                  >
                    {t("products.next")}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{t("products.noProducts")}</p>
                <Button onClick={() => handleCategoryChange(null)}>
                  {t("products.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Product Card Component
 */
function ProductCard({ product }: { product: any }) {
  const { t } = useTranslation();
  const addToCartMutation = trpc.cart.add.useMutation();

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images.length > 0 ? images[0] : "/placeholder-product.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative bg-slate-200 h-48 overflow-hidden cursor-pointer">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>

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

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addToCartMutation.isPending}
          className="w-full"
          size="sm"
        >
          <ShoppingCart size={16} className="mr-2" />
          {addToCartMutation.isPending ? "Adding..." : t("products.addToCart")}
        </Button>
      </div>
    </Card>
  );
}
