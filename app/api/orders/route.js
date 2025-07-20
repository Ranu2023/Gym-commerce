import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose.js";
import { requireAuth } from "@/lib/jwt.js";
import { Order, Cart, Coupon } from "@/models/index.js";

export async function GET(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const orders = await Order.find({ userId: user?.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data: Array.isArray(orders) ? orders : [],
      statusCode: 200,
    });
  } catch (error) {
    if (error?.message === "Authentication required") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          statusCode: 511,
        },
        { status: 511 }
      );
    }

    console.error("Get orders error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const body = await request.json();
    const { shippingAddress, couponCode } = body || {};

    if (!shippingAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping address is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const cart = await Cart.aggregate([
      { $match: { userId: user?.id } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "items.product",
        },
      },
      { $unwind: "$items.product" },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          items: { $push: "$items" },
        },
      },
    ]);

    if (!cart?.length || !cart?.[0]?.items?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
          statusCode: 400,
        },
        { status: 400 }
      );
    }
    console.log(cart,"this is the cart data");

    const cartData = cart?.[0];
    let totalAmount = 0;
    let discountAmount = 0;

    cartData?.items?.forEach((item) => {
      totalAmount += (item?.product?.price || 0) * (item?.quantity || 0);
    });

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode?.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        discountAmount = (totalAmount * (coupon?.discount || 0)) / 100;
        await Coupon.updateOne(
          { _id: coupon?._id },
          { $inc: { usageCount: 1 } }
        );
      }
    }

    const finalAmount = totalAmount - discountAmount;

    const result = await Order.create({
      userId: user?.id,
      items: cartData?.items,
      totalAmount: finalAmount,
      discountAmount,
      couponCode: couponCode?.toUpperCase(),
      status: "pending",
      shippingAddress,
    });

    await Cart.deleteOne({ userId: user?.id });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: { orderId: result?._id },
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error?.message === "Authentication required") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          statusCode: 511,
        },
        { status: 511 }
      );
    }

    console.error("Create order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
