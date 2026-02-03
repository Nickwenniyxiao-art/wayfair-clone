import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, AlertCircle } from "lucide-react";

// Mock data
const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-1704067200000-abc123",
    customer: "John Doe",
    amount: 1299.99,
    status: "delivered",
    date: "2024-02-01",
  },
  {
    id: 2,
    orderNumber: "ORD-1704067200001-def456",
    customer: "Jane Smith",
    amount: 599.99,
    status: "shipped",
    date: "2024-02-02",
  },
  {
    id: 3,
    orderNumber: "ORD-1704067200002-ghi789",
    customer: "Bob Johnson",
    amount: 899.99,
    status: "processing",
    date: "2024-02-03",
  },
];

export default function AdminOrders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState(mockOrders);

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

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>

        {/* Filter */}
        <Card className="p-4 mb-6 mt-8">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setLocation(`/admin/orders/${order.id}`)
                      }
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Shipped</p>
            <p className="text-3xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "shipped").length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Delivered</p>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
