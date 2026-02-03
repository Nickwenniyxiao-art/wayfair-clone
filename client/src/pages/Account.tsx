import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, ShoppingBag, LogOut, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";

export default function Account() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user data
  const { data: userProfile } = trpc.user.profile.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: addresses } = trpc.user.addresses.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: orders } = trpc.order.list.useQuery(
    { limit: 100, offset: 0 },
    { enabled: !!user }
  );

  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({
    type: "shipping" as const,
    recipientName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const addAddressMutation = trpc.user.addAddress.useMutation();
  const deleteAddressMutation = trpc.user.deleteAddress.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">{t("account.notLoggedIn")}</p>
        <Link href="/">
          <Button>{t("common.backToHome")}</Button>
        </Link>
      </div>
    );
  }

  const handleAddAddress = async () => {
    try {
      await addAddressMutation.mutateAsync(newAddress);
      setNewAddress({
        type: "shipping",
        recipientName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      });
      alert(t("account.addressAddedSuccessfully"));
    } catch (error) {
      alert(t("account.addressAddFailed"));
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (confirm(t("account.confirmDeleteAddress"))) {
      try {
        await deleteAddressMutation.mutateAsync({ id: addressId });
        alert(t("account.addressDeletedSuccessfully"));
      } catch (error) {
        alert(t("account.addressDeleteFailed"));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
    } catch (error) {
      alert(t("account.logoutFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("account.myAccount")}</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={20} />
            {t("account.logout")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={18} />
              {t("account.profile")}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin size={18} />
              {t("account.addresses")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag size={18} />
              {t("account.orders")}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">{t("account.profileInfo")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("account.name")}
                  </label>
                  <Input
                    value={userProfile?.name || user?.name || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("account.email")}
                  </label>
                  <Input
                    value={userProfile?.email || user?.email || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("account.memberSince")}
                  </label>
                  <Input
                    value={
                      userProfile?.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString()
                        : ""
                    }
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-6">
              {/* Add New Address */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t("account.addNewAddress")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t("account.recipientName")}
                    value={newAddress.recipientName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, recipientName: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.phone")}
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.street")}
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.city")}
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.state")}
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.zipCode")}
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zipCode: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("account.country")}
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isDefault: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label>{t("account.setAsDefault")}</label>
                  </div>
                </div>
                <Button
                  onClick={handleAddAddress}
                  className="mt-4 w-full"
                  disabled={addAddressMutation.isPending}
                >
                  {t("account.addAddress")}
                </Button>
              </Card>

              {/* Existing Addresses */}
              {addresses && addresses.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{t("account.savedAddresses")}</h3>
                  <div className="space-y-4">
                    {addresses.map((address: any) => (
                      <Card key={address.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-gray-600">
                              {address.state} {address.zipCode}, {address.country}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {t("account.default")}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">{t("account.orderHistory")}</h2>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <Card key={order.id} className="p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">{t("account.orderNumber")}</p>
                          <p className="font-semibold">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t("account.date")}</p>
                          <p className="font-semibold">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t("account.status")}</p>
                          <p className="font-semibold capitalize">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t("account.total")}</p>
                          <p className="font-semibold text-blue-600">
                            ${Number(order.totalPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">{t("account.noOrders")}</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
