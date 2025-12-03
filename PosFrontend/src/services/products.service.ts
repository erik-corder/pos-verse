import apiClient from "@/lib/api-client";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/types";

export const productsService = {
  // Get all products
  async getAll(isActive?: boolean): Promise<Product[]> {
    const params = isActive === undefined ? {} : { isActive };
    const response = await apiClient.get<Product[]>("/products", { params });
    return response.data;
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create product
  async create(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  // Update product
  async update(id: string, data: UpdateProductRequest): Promise<void> {
    await apiClient.put(`/products/${id}`, data);
  },

  // Delete product
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
