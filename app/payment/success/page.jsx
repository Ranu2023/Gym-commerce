"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/axios.js";

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id");

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      const response = await api.post("/payments/verify", { orderId });

      if (response?.data?.success) {
        setOrder(response?.data?.data?.order);
      } else {
        console.error("Payment verification failed:", response?.data?.message);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
    } finally {
      setIsVerifying(false);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Payment Link
          </h1>
          <p className="text-gray-600 mb-6">
            This payment link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            {isVerifying
              ? "Verifying your payment..."
              : "Thank you for your order. Your payment has been processed successfully."}
          </p>
        </div>

        {order && (
          <>
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{order?._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{formatDate(order?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {order?.status === "confirmed"
                      ? "Confirmed"
                      : order?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <img
                        src={
                          item?.product?.image ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item?.product?.name || "Product"}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item?.product?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item?.product?.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item?.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹
                      {(
                        (item?.product?.price || 0) * (item?.quantity || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    $
                    {(
                      (order?.totalAmount || 0) + (order?.discountAmount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
                {(order?.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount {order?.couponCode && `(${order?.couponCode})`}
                    </span>
                    <span>-${(order?.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="text-blue-600">
                      ${(order?.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">
                  {order?.shippingAddress?.fullName}
                </p>
                <p>{order?.shippingAddress?.address}</p>
                <p>
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.state}{" "}
                  {order?.shippingAddress?.pincode}
                </p>
                <p>Phone: {order?.shippingAddress?.phone}</p>
              </div>
            </div>
          </>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Order Processing</p>
                <p className="text-sm text-gray-600">
                  We'll start preparing your order for shipment.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Shipping Updates</p>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Payment Confirmation
                </p>
                <p className="text-sm text-gray-600">
                  A payment receipt has been sent to your email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/profile")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>View Order History</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push("/products")}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
