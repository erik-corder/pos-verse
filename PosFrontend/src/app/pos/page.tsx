"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { productsService } from "@/services/products.service";
import { customersService } from "@/services/customers.service";
import { ordersService } from "@/services/orders.service";
import { Product, Customer, CartItem, CreateOrderLineRequest } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, Trash2, ShoppingCart, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, customersData] = await Promise.all([
        productsService.getAll(true),
        customersService.getAll(),
      ]);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer("");
    toast.success("Cart cleared");
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      const orderLines: CreateOrderLineRequest[] = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      await ordersService.create({
        customerId: selectedCustomer,
        orderLines,
      });

      toast.success("Order created successfully!");
      clearCart();
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Loading message="Loading POS..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Point of Sale
          </h1>
          <p className="text-gray-600">Create new orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <div className="relative w-64">
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
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Cart Section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    <ShoppingCart size={24} className="mr-2" />
                    Cart
                  </h2>
                  {cart.length > 0 && (
                    <Button size="sm" variant="secondary" onClick={clearCart}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {/* Customer Selection */}
                <div className="mb-6">
                  <Select
                    label="Customer"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    options={[
                      { value: "", label: "Select a customer" },
                      ...customers.map((customer) => ({
                        value: customer.id,
                        label: customer.name,
                      })),
                    ]}
                  />
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart
                        size={48}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                {cart.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleCheckout}
                      isLoading={submitting}
                      disabled={!selectedCustomer || cart.length === 0}
                    >
                      Complete Order
                    </Button>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
