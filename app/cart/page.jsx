"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { load } from "@cashfreepayments/cashfree-js";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CreditCard,
} from "lucide-react";
import api from "@/lib/axios.js";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [version, setVersion] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    // Load Cashfree client-side
    const initCashfree = async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
      setVersion(cf?.version());
    };
    initCashfree();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      if (response?.data?.success) {
        setCart(response?.data?.data || { items: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error?.response?.status === 511) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      const response = await api.put("/cart/update", {
        productId,
        quantity: newQuantity,
      });

      if (response?.data?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error?.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsUpdating(true);
      const response = await api.delete(`/cart/remove/${productId}`);

      if (response?.data?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert(error?.response?.data?.message || "Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode?.trim()) return;

    try {
      setCouponError("");
      const response = await api.post("/coupons/validate", {
        code: couponCode?.trim(),
      });

      if (response?.data?.success) {
        setAppliedCoupon(response?.data?.data);
        setCouponCode("");
      }
    } catch (error) {
      setCouponError(error?.response?.data?.message || "Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const calculateSubtotal = () => {
    return (
      cart?.items?.reduce((total, item) => {
        return total + (item?.product?.price || 0) * (item?.quantity || 0);
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    return (subtotal * (appliedCoupon?.discount || 0)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAddress = () => {
    const required = [
      "fullName",
      "address",
      "city",
      "state",
      "pincode",
      "phone",
    ];
    return required.every((field) => shippingAddress?.[field]?.trim());
  };

  const handlePayment = async () => {
    if (!validateAddress()) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    if ((cart?.items?.length || 0) === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Create payment order
      const response = await api.post("/payments/create-order", {
        shippingAddress,
        couponCode: appliedCoupon?.code,
      });

      if (response?.data?.success) {
        const { paymentSessionId, orderId, sessionId } =
          response?.data?.data || {};

        if (!cashfree || !sessionId) {
          toast.error("Cashfree not loaded or session ID missing");
          return;
        }

        const checkoutOptions = {
          paymentSessionId: sessionId,
          returnUrl: `https://gym-commerce-five.vercel.app/payment/success?order_id=${orderId}`,
          // returnUrl: `https://gym-commerce.vercel.app/profile`,
        };

        cashfree.checkout(checkoutOptions).then((result) => {
          if (result.error) {
            alert(result.error.message);
          }
          if (result.redirect) {
            console.log("Redirection", result);
          }
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        error?.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)]?.map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex space-x-4">
                    <div className="h-20 w-20 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8" />
            <span>Shopping Cart</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {(cart?.items?.length || 0) === 0
              ? "Your cart is empty"
              : `${cart?.items?.length} item${
                  (cart?.items?.length || 0) > 1 ? "s" : ""
                } in your cart`}
          </p>
        </div>

        {(cart?.items?.length || 0) === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart?.items?.map((item) => (
                <div
                  key={item?.product?._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={
                          item?.product?.image ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={item?.product?.name || "Product"}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item?.product?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item?.product?.category}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        ₹ {(item?.product?.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item?.product?._id,
                              (item?.quantity || 0) - 1
                            )
                          }
                          disabled={isUpdating || (item?.quantity || 0) <= 1}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">
                          {item?.quantity || 0}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item?.product?._id,
                              (item?.quantity || 0) + 1
                            )
                          }
                          disabled={
                            isUpdating ||
                            (item?.quantity || 0) >= (item?.product?.stock || 0)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item?.product?._id)}
                        disabled={isUpdating}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <span className="text-lg font-semibold text-gray-900">
                      Subtotal: ₹
                      {(
                        (item?.product?.price || 0) * (item?.quantity || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary and Checkout */}
            <div className="space-y-6">
              {/* Coupon Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Coupon Code</span>
                </h3>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">
                          {appliedCoupon?.code}
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon?.discount}% discount applied
                          {appliedCoupon?.influencerName &&
                            ` • ${appliedCoupon?.influencerName}`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode?.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={shippingAddress?.fullName || ""}
                      onChange={(e) =>
                        handleAddressChange("fullName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={shippingAddress?.address || ""}
                      onChange={(e) =>
                        handleAddressChange("address", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress?.city || ""}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={shippingAddress?.state || ""}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={shippingAddress?.pincode || ""}
                        onChange={(e) =>
                          handleAddressChange("pincode", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress?.phone || ""}
                        onChange={(e) =>
                          handleAddressChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon?.discount}%)</span>
                      <span>-₹{calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={
                    isProcessingPayment ||
                    !validateAddress() ||
                    (cart?.items?.length || 0) === 0
                  }
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {isProcessingPayment ? "Processing..." : "Pay Now"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cashfree SDK */}
      <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
    </div>
  );
}
