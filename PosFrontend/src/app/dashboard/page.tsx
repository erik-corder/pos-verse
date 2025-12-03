"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { productsService } from "@/services/products.service";
import { customersService } from "@/services/customers.service";
import { ordersService } from "@/services/orders.service";
import { Order } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current month date range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [products, customers, orders] = await Promise.all([
        productsService.getAll(true),
        customersService.getAll(),
        ordersService.getAll(firstDay.toISOString(), lastDay.toISOString()),
      ]);

      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
      });

      // Get last 5 orders
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Loading message="Loading dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      link: "/products",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-green-500",
      link: "/customers",
    },
    {
      title: "Orders This Month",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-purple-500",
      link: "/orders",
    },
    {
      title: "Revenue This Month",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-yellow-500",
      link: "/orders",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your POS system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/orders">
                  <span className="text-sm text-primary-600 hover:text-primary-700">
                    View All
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart
                    size={48}
                    className="mx-auto mb-2 text-gray-300"
                  />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName || "Unknown Customer"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(order.orderDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Link href="/pos">
                  <div className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer border-2 border-primary-200">
                    <ShoppingCart className="text-primary-600 mr-4" size={32} />
                    <div>
                      <h3 className="font-semibold text-gray-900">New Sale</h3>
                      <p className="text-sm text-gray-600">
                        Create a new order
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/products">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                    <Package className="text-blue-600 mr-4" size={32} />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Manage Products
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add or edit products
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/customers">
                  <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer border-2 border-green-200">
                    <Users className="text-green-600 mr-4" size={32} />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Manage Customers
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add or edit customers
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/orders">
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer border-2 border-purple-200">
                    <Calendar className="text-purple-600 mr-4" size={32} />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        View Orders
                      </h3>
                      <p className="text-sm text-gray-600">
                        Browse order history
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="mr-2" size={24} />
              Monthly Summary
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  Average Order Value
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalOrders > 0
                    ? formatCurrency(stats.totalRevenue / stats.totalOrders)
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
