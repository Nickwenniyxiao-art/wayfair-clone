import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState(false);

  // Fetch user addresses
  const { data: addresses = [] } = trpc.user.addresses.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch cart items for summary
  const { data: cartItems = [] } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const createOrderMutation = trpc.order.create.useMutation();
  const addAddressMutation = trpc.user.addAddress.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to proceed with checkout.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add items to your cart before checking out.
          </p>
          <Button onClick={() => setLocation("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shippingCost = 10;
  const taxCost = subtotal * 0.08;
  const total = subtotal + shippingCost + taxCost;

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      setLocation(`/order-confirmation/${result.orderId}`);
    } catch (error: any) {
      alert(error.message || "Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              {["address", "payment", "confirm"].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      step === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <ChevronRight className="mx-2 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Address Step */}
            {step === "address" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                {addresses.length > 0 && !newAddress && (
                  <div className="space-y-3 mb-6">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-semibold">{addr.recipientName}</p>
                          <p className="text-sm text-gray-600">
                            {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {newAddress || addresses.length === 0 ? (
                  <AddressForm
                    onSubmit={async (data) => {
                      await addAddressMutation.mutateAsync({
                        ...data,
                        type: "shipping",
                      });
                      setNewAddress(false);
                    }}
                    isLoading={addAddressMutation.isPending}
                  />
                ) : (
                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => setNewAddress(true)}
                  >
                    Add New Address
                  </Button>
                )}

                <Button
                  onClick={() => setStep("payment")}
                  disabled={!selectedAddress}
                  className="w-full"
                >
                  Continue to Payment
                </Button>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold">Credit Card</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold">PayPal</p>
                      <p className="text-sm text-gray-600">
                        Fast and secure payment
                      </p>
                    </div>
                  </label>
                </div>

                {/* Card Form */}
                <div className="space-y-4 mb-6">
                  <Input placeholder="Cardholder Name" />
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("address")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setStep("confirm")}
                  >
                    Review Order
                  </Button>
                </div>
              </Card>
            )}

            {/* Confirmation Step */}
            {step === "confirm" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Review Your Order</h2>

                {/* Address Summary */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  {addresses.find((a) => a.id === selectedAddress) && (
                    <div className="text-sm text-gray-600">
                      <p>
                        {
                          addresses.find((a) => a.id === selectedAddress)
                            ?.recipientName
                        }
                      </p>
                      <p>
                        {
                          addresses.find((a) => a.id === selectedAddress)
                            ?.street
                        }
                      </p>
                      <p>
                        {
                          addresses.find((a) => a.id === selectedAddress)
                            ?.city
                        }
                        , {addresses.find((a) => a.id === selectedAddress)?.state}{" "}
                        {addresses.find((a) => a.id === selectedAddress)?.zipCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold mb-2">Items</h3>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>Product x{item.quantity}</span>
                        <span>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("payment")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateOrder}
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending
                      ? "Processing..."
                      : "Place Order"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${taxCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-2xl text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Address Form Component
 */
function AddressForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <Input
        name="recipientName"
        placeholder="Full Name"
        value={formData.recipientName}
        onChange={handleChange}
        required
      />
      <Input
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <Input
        name="street"
        placeholder="Street Address"
        value={formData.street}
        onChange={handleChange}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="zipCode"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />
        <Input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}
