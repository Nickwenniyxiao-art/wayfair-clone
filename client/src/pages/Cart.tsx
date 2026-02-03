import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Fetch cart items
  const { data: cartItems = [], refetch: refetchCart } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const updateCartMutation = trpc.cart.update.useMutation({
    onSuccess: () => refetchCart(),
  });
  const removeCartMutation = trpc.cart.remove.useMutation({
    onSuccess: () => refetchCart(),
  });
  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => refetchCart(),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to view your shopping cart.
          </p>
          <Link href="/auth/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to get started.
          </p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * Number(appliedCoupon.value)) / 100
      : Number(appliedCoupon.value)
    : 0;
  const shippingCost = 10;
  const taxCost = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingCost + taxCost;

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartMutation.mutateAsync({
      cartItemId,
      quantity: newQuantity,
    });
  };

  const handleRemoveItem = async (cartItemId: number) => {
    await removeCartMutation.mutateAsync({ cartItemId });
  };

  const handleApplyCoupon = () => {
    // TODO: Implement coupon validation
    alert("Coupon validation not yet implemented");
  };

  const handleCheckout = () => {
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(qty) =>
                      handleUpdateQuantity(item.id, qty)
                    }
                    onRemove={() => handleRemoveItem(item.id)}
                    isUpdating={updateCartMutation.isPending}
                    isRemoving={removeCartMutation.isPending}
                  />
                ))}
              </div>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${taxCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full mb-3"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              {/* Clear Cart */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your cart?")) {
                    clearCartMutation.mutate();
                  }
                }}
                disabled={clearCartMutation.isPending}
              >
                Clear Cart
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-2 text-xs text-gray-600">
                <p>✓ Free returns within 30 days</p>
                <p>✓ Secure checkout</p>
                <p>✓ Money-back guarantee</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Item Component
 */
function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving,
}: {
  item: any;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) {
  return (
    <div className="p-4 flex gap-4">
      {/* Product Image */}
      <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0">
        <img
          src="/placeholder-product.jpg"
          alt="Product"
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold mb-1">Product Name</h3>
        <p className="text-sm text-gray-600 mb-2">SKU: {item.productId}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="text-right">
        <div className="font-bold text-lg mb-2">
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </div>
        <button
          onClick={onRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
