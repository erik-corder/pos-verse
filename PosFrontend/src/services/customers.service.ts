import apiClient from "@/lib/api-client";
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/types";

export const customersService = {
  // Get all customers
  async getAll(searchTerm?: string): Promise<Customer[]> {
    const params = searchTerm ? { searchTerm } : {};
    const response = await apiClient.get<Customer[]>("/customers", { params });
    return response.data;
  },

  // Get customer by ID
  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Create customer
  async create(data: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<Customer>("/customers", data);
    return response.data;
  },

  // Update customer
  async update(id: string, data: UpdateCustomerRequest): Promise<void> {
    await apiClient.put(`/customers/${id}`, data);
  },

  // Delete customer
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },
};
