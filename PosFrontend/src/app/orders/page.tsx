"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { Loading } from "@/components/ui/Loading";
import { ordersService } from "@/services/orders.service";
import { Order, OrderDetail } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Eye, Trash2, Calendar, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAll(startDate, endDate);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const orderDetail = await ordersService.getById(order.id);
      setSelectedOrder(orderDetail);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (
      !confirm(`Are you sure you want to delete order ${order.orderNumber}?`)
    ) {
      return;
    }

    try {
      await ordersService.delete(order.id);
      toast.success("Order deleted successfully");
      loadOrders();
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  const handleFilter = () => {
    loadOrders();
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => loadOrders(), 0);
  };

  const columns = [
    {
      key: "orderNumber",
      header: "Order Number",
      render: (order: Order) => (
        <span className="font-mono font-medium">{order.orderNumber}</span>
      ),
    },
    {
      key: "orderDate",
      header: "Date",
      render: (order: Order) => formatDateTime(order.orderDate),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (order: Order) => order.customerName || "N/A",
    },
    {
      key: "totalAmount",
      header: "Total",
      render: (order: Order) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(order.totalAmount)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (order: Order) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewOrder(order)}
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteOrder(order)}
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">View and manage order history</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-end space-x-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleFilter}>
                  <Filter size={20} className="mr-2" />
                  Filter
                </Button>
                {(startDate || endDate) && (
                  <Button variant="secondary" onClick={clearFilter}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <Loading message="Loading orders..." />
            ) : (
              <Table
                data={orders}
                columns={columns}
                emptyMessage="No orders found"
              />
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-mono font-semibold">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDateTime(selectedOrder.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">
                  {selectedOrder.customerName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>

            {/* Order Lines */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.orderLines.map((line) => (
                  <div
                    key={line.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {line.productName || "Unknown Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {line.quantity} × {formatCurrency(line.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(line.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
