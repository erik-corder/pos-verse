"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { Loading } from "@/components/ui/Loading";
import { productsService } from "@/services/products.service";
import { Product, CreateProductRequest } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    price: 0,
    sku: "",
    isActive: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll(true);
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      sku: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      sku: product.sku,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) {
      return;
    }

    try {
      await productsService.delete(product.id);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await productsService.create(formData);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      toast.error(`Failed to ${editingProduct ? "update" : "create"} product`);
      console.error(error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "sku",
      header: "SKU",
    },
    {
      key: "price",
      header: "Price",
      render: (product: Product) => formatCurrency(product.price),
    },
    {
      key: "isActive",
      header: "Status",
      render: (product: Product) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            product.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(product)}
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(product)}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 mr-4">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <Button onClick={handleCreate}>
                <Plus size={20} className="mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <Loading message="Loading products..." />
            ) : (
              <Table
                data={filteredProducts}
                columns={columns}
                emptyMessage="No products found"
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Create New Product"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />

          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Enter SKU"
          />

          <Input
            label="Price"
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            placeholder="0.00"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
