// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongoose";
// import { Order } from "@/models";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const data = await req.json();

//     // ✅ Validate the webhook type and payment status
//     if (
//       data?.type !== "PAYMENT_SUCCESS_WEBHOOK" ||
//       data?.data?.payment?.payment_status !== "SUCCESS"
//     ) {
//       return NextResponse.json(
//         { message: "Invalid webhook or unsuccessful payment" },
//         { status: 400 }
//       );
//     }

//     const orderId = data?.data?.order?.order_tags?.orderId;
//     const customerId = data?.data?.order?.order_tags?.customerId;
//     const paymentId = data?.data?.payment?.cf_payment_id;

//     if (!orderId || !customerId) {
//       return NextResponse.json(
//         { message: "Missing orderId, customerId, or paymentId" },
//         { status: 400 }
//       );
//     }

//     if (!mongoose.Types.ObjectId.isValid(customerId)) {
//       return NextResponse.json(
//         { message: "Invalid customerId" },
//         { status: 400 }
//       );
//     }

//     // ✅ Find and update the order
//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 });
//     }

//     // ✅ Update order fields
//     order.status = "processing";
//     order.paymentStatus = "paid";
//     order.paymentId = paymentId;

//     await order.save();

//     return NextResponse.json(
//       { message: "Order status updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Webhook Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Order } from "@/models";
import nodemailer from "nodemailer";
import { User } from "@/models";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
  },
});

async function sendOrderNotificationEmail(order, customer) {
  const adminEmail = process.env.ADMIN_EMAIL || "muscledecode7@gmail.com";

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
        🎉 New Order Payment Received!
      </h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Payment ID:</strong> ${order.paymentId}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        ${
          order.couponCode
            ? `<p><strong>Coupon Used:</strong> ${order.couponCode}</p>`
            : ""
        }
        ${
          order.discountAmount > 0
            ? `<p><strong>Discount:</strong> ₹${order.discountAmount}</p>`
            : ""
        }
      </div>

      <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Customer Details</h3>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone || "Not provided"}</p>
      </div>

      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Shipping Address</h3>
        <p><strong>Name:</strong> ${order.shippingAddress.fullName}</p>
        <p><strong>Address:</strong> ${order.shippingAddress.address}</p>
        <p><strong>City:</strong> ${order.shippingAddress.city}</p>
        <p><strong>State:</strong> ${order.shippingAddress.state}</p>
        <p><strong>Pincode:</strong> ${order.shippingAddress.pincode}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
      </div>

      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Order Items</h3>
        ${order.items
          .map(
            (item) => `
          <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
            <p><strong>${item.product.name}</strong></p>
            <p>Category: ${item.product.category}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ₹${item.price}</p>
            <p>Subtotal: ₹${item.subtotal}</p>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 8px;">
        <p style="margin: 0; color: #1e40af;">
          <strong>Please process this order as soon as possible!</strong>
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">
          Order received at: ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `🚨 New Order Payment: ${order.orderId} - ₹${order.totalAmount}`,
    html: emailHTML,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Order notification email sent for order: ${order.orderId}`);
}

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

    // ✅ Send email notification to admin
    try {
      // Fetch customer details
      const customer = await User.findById(customerId);

      if (customer) {
        await sendOrderNotificationEmail(order, customer);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the webhook if email fails
    }

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
