import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";

// Mock data
const salesData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 221 },
  { month: "Mar", sales: 2000, orders: 229 },
  { month: "Apr", sales: 2780, orders: 200 },
  { month: "May", sales: 1890, orders: 229 },
  { month: "Jun", sales: 2390, orders: 200 },
];

const categoryData = [
  { name: "Furniture", value: 45 },
  { name: "Decor", value: 25 },
  { name: "Lighting", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Total Revenue"
            value="$45,231"
            change="+12.5%"
            positive
          />
          <MetricCard
            icon={<ShoppingCart className="w-8 h-8" />}
            title="Total Orders"
            value="1,234"
            change="+8.2%"
            positive
          />
          <MetricCard
            icon={<Users className="w-8 h-8" />}
            title="Total Users"
            value="5,678"
            change="+5.1%"
            positive
          />
          <MetricCard
            icon={<Package className="w-8 h-8" />}
            title="Products"
            value="892"
            change="-2.3%"
            positive={false}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-lg font-bold mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Manage Products"
            description="Add, edit, or delete products"
            onClick={() => setLocation("/admin/products")}
          />
          <QuickActionCard
            title="View Orders"
            description="Manage customer orders"
            onClick={() => setLocation("/admin/orders")}
          />
          <QuickActionCard
            title="Manage Users"
            description="View and manage users"
            onClick={() => setLocation("/admin/users")}
          />
          <QuickActionCard
            title="View Analytics"
            description="Detailed analytics and reports"
            onClick={() => setLocation("/admin/analytics")}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({
  icon,
  title,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-blue-600">{icon}</div>
        <div
          className={`text-sm font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}

/**
 * Quick Action Card Component
 */
function QuickActionCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Button size="sm" variant="outline" className="w-full">
        Go to {title}
      </Button>
    </Card>
  );
}
