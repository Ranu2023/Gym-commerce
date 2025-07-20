import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose.js";
import { requireAuth } from "@/lib/jwt.js";
import { Cart, Product } from "@/models/index.js";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const cart = await Cart.findOne({ userId: user?.id }).populate({
      path: "items.productId",
      select: "name price image stock isActive category",
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: "Cart is empty",
        data: { items: [] },
        statusCode: 200,
      });
    }

    const cartWithProducts = await Cart.aggregate([
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
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const cartData = cartWithProducts?.[0] || { items: [] };

    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      data: cartData,
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

    console.error("Get cart error:", error);
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
    const { productId, quantity = 1 } = body || {};

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: new ObjectId(productId),
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    if ((product?.stock || 0) < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient stock",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: user?.id });

    if (!cart) {
      await Cart.create({
        userId: user?.id,
        items: [
          {
            productId: new ObjectId(productId),
            quantity,
            price: product.price,
          },
        ],
      });
    } else {
      const existingItemIndex = cart?.items?.findIndex(
        (item) => item?.productId?.toString() === productId
      );

      if (existingItemIndex > -1) {
        await Cart.updateOne(
          { userId: user?.id, "items.productId": new ObjectId(productId) },
          { $inc: { "items.$.quantity": quantity } }
        );
      } else {
        await Cart.updateOne(
          { userId: user?.id },
          { $push: { items: { productId: new ObjectId(productId), quantity } } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
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

    console.error("Add to cart error:", error);
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
