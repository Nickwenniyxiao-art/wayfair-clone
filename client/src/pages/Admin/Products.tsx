import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, AlertCircle } from "lucide-react";

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Modern Sofa",
    sku: "SOF-001",
    category: "Furniture",
    price: 899.99,
    stock: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Dining Table",
    sku: "TAB-001",
    category: "Furniture",
    price: 599.99,
    stock: 12,
    status: "active",
  },
  {
    id: 3,
    name: "Wall Lamp",
    sku: "LAM-001",
    category: "Lighting",
    price: 49.99,
    stock: 0,
    status: "inactive",
  },
];

export default function AdminProducts() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(mockProducts);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button onClick={() => setLocation("/admin/products/new")}>
            <Plus className="mr-2" size={20} />
            Add Product
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Card>

        {/* Products Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setLocation(`/admin/products/${product.id}/edit`)
                        }
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">In Stock</p>
            <p className="text-3xl font-bold">
              {products.filter((p) => p.stock > 0).length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
