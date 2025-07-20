import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Order } from "@/models";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    // ✅ Validate the webhook type and payment status
    if (
      data?.type !== "PAYMENT_SUCCESS_WEBHOOK" ||
      data?.data?.payment?.payment_status !== "SUCCESS"
    ) {
      return NextResponse.json(
        { message: "Invalid webhook or unsuccessful payment" },
        { status: 400 }
      );
    }

    const orderId = data?.data?.order?.order_tags?.orderId;
    const customerId = data?.data?.order?.order_tags?.customerId;
    const paymentId = data?.data?.payment?.cf_payment_id;

    if (!orderId || !customerId) {
      return NextResponse.json(
        { message: "Missing orderId, customerId, or paymentId" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json(
        { message: "Invalid customerId" },
        { status: 400 }
      );
    }

    // ✅ Find and update the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // ✅ Update order fields
    order.status = "processing";
    order.paymentStatus = "paid";
    order.paymentId = paymentId;

    await order.save();

    return NextResponse.json(
      { message: "Order status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
