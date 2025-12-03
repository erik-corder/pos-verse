import apiClient from "@/lib/api-client";
import {
  Order,
  OrderDetail,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "@/types";

export const ordersService = {
  // Get all orders
  async getAll(startDate?: string, endDate?: string): Promise<Order[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get<Order[]>("/orders", { params });
    return response.data;
  },

  // Get order by ID (with order lines)
  async getById(id: string): Promise<OrderDetail> {
    const response = await apiClient.get<OrderDetail>(`/orders/${id}`);
    return response.data;
  },

  // Create order
  async create(data: CreateOrderRequest): Promise<OrderDetail> {
    const response = await apiClient.post<OrderDetail>("/orders", data);
    return response.data;
  },

  // Update order
  async update(id: string, data: UpdateOrderRequest): Promise<void> {
    await apiClient.put(`/orders/${id}`, data);
  },

  // Delete order
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },
};
