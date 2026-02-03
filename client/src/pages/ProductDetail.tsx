import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function ProductDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = trpc.product.detail.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );

  const addToCartMutation = trpc.cart.add.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">{t("common.productNotFound")}</p>
        <Link href="/products">
          <Button>{t("common.backToProducts")}</Button>
        </Link>
      </div>
    );
  }

  // Parse images from JSON
  const images = Array.isArray(product.images) 
    ? product.images 
    : typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : [];
  
  const currentImage = images.length > 0 ? images[selectedImageIndex] : "/placeholder-product.jpg";

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: quantity,
      });
      alert(t("cart.addedSuccessfully"));
    } catch (error) {
      alert(t("cart.addFailed"));
    }
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Parse specifications
  const specs = typeof product.specifications === 'string' 
    ? JSON.parse(product.specifications) 
    : product.specifications || {};

  return (
    <div key={productId} className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/">
              <span className="hover:text-blue-600 cursor-pointer">{t("common.home")}</span>
            </Link>
            <span>/</span>
            <Link href="/products">
              <span className="hover:text-blue-600 cursor-pointer">{t("products.title")}</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden ${
                      idx === selectedImageIndex ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_: any, i: number) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(Number(product.rating) || 0) ? "fill-current" : ""}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} {t("product.reviews")})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm font-semibold text-red-600">
                  {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% {t("product.off")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">{t("product.specifications")}</h3>
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p className="text-sm mb-2">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    ✓ {t("product.inStock")} ({product.stock} {t("product.available")})
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">✗ {t("product.outOfStock")}</span>
                )}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">{t("product.quantity")}:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center border-l border-r py-2"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {t("cart.addToCart")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="px-4"
              >
                <Heart size={20} className={isWishlisted ? "fill-red-600 text-red-600" : ""} />
              </Button>
              <Button variant="outline" className="px-4">
                <Share2 size={20} />
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-blue-50 border-blue-200 p-4">
              <h4 className="font-semibold mb-2">{t("product.shippingInfo")}</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ {t("product.freeShipping")}</li>
                <li>✓ {t("product.easyReturns")}</li>
                <li>✓ {t("product.secureCheckout")}</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">{t("product.relatedProducts")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            <div className="text-center text-gray-500 col-span-full">
              {t("product.noRelatedProducts")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
