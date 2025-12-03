"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { Loading } from "@/components/ui/Loading";
import { customersService } from "@/services/customers.service";
import { Customer, CreateCustomerRequest } from "@/types";
import { Plus, Edit, Trash2, Search, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.name}?`)) {
      return;
    }

    try {
      await customersService.delete(customer.id);
      toast.success("Customer deleted successfully");
      loadCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await customersService.update(editingCustomer.id, formData);
        toast.success("Customer updated successfully");
      } else {
        await customersService.create(formData);
        toast.success("Customer created successfully");
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (error) {
      toast.error(
        `Failed to ${editingCustomer ? "update" : "create"} customer`
      );
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await customersService.getAll(searchTerm);
        setCustomers(data);
      } catch (error) {
        toast.error("Failed to search customers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      loadCustomers();
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
      render: (customer: Customer) => (
        <div className="flex items-center">
          <Mail size={16} className="mr-2 text-gray-400" />
          {customer.email}
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer: Customer) => (
        <div className="flex items-center">
          <Phone size={16} className="mr-2 text-gray-400" />
          {customer.phone || "N/A"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(customer)}
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(customer)}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 mr-4 space-x-2">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button variant="outline" onClick={handleSearch}>
                  Search
                </Button>
              </div>
              <Button onClick={handleCreate}>
                <Plus size={20} className="mr-2" />
                Add Customer
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <Loading message="Loading customers..." />
            ) : (
              <Table
                data={customers}
                columns={columns}
                emptyMessage="No customers found"
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Create New Customer"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter customer name"
          />

          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="customer@example.com"
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1234567890"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCustomer ? "Update" : "Create"} Customer
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
