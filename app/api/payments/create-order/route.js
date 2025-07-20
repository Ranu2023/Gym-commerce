// import { NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb.js";
// import { requireAuth } from "@/lib/auth.js";
// import { ObjectId } from "mongodb";
// import mongoose from "mongoose";

// export async function POST(request) {
//   try {
//     const user = requireAuth(request);

//     const body = await request.json();
//     const { shippingAddress, couponCode } = body || {};

//     if (!shippingAddress) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Shipping address is required",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const db = await connectDB();
//     const usersCollection = db?.collection("users");
//     const cartsCollection = db?.collection("carts");
//     const ordersCollection = db?.collection("orders");
//     const couponsCollection = db?.collection("coupons");

//     // Find user with multiple approaches
//     console.log("Looking for user with ID:", user?.id);
//     let dbUser = null;

//     try {
//       // Try with ObjectId first
//       dbUser = await usersCollection?.findById(
//         new mongoose.Types.ObjectId(user?.id)
//       );
//     } catch (e) {
//       console.log("ObjectId lookup failed, trying string lookup");
//     }

//     if (!dbUser) {
//       // Try with string ID
//       dbUser = await usersCollection?.findOne({ _id: user?.id });
//     }

//     if (!dbUser) {
//       // Try with custom id field
//       dbUser = await usersCollection?.findOne({ id: user?.id });
//     }

//     console.log("Found user:", dbUser ? "Yes" : "No");

//     if (!dbUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User not found",
//           statusCode: 404,
//         },
//         { status: 404 }
//       );
//     }

//     // Get user's cart with enhanced lookup
//     console.log("Looking for cart for user:", user?.id);
//     let cartWithProducts = [];

//     try {
//       cartWithProducts = await cartsCollection
//         ?.aggregate([
//           {
//             $match: {
//               $or: [{ userId: user?.id }, { userId: new ObjectId(user?.id) }],
//             },
//           },
//           { $unwind: "$items" },
//           {
//             $addFields: {
//               "items.productObjectId": {
//                 $cond: {
//                   if: { $type: "$items.productId" },
//                   then: "$items.productId",
//                   else: { $toObjectId: "$items.productId" },
//                 },
//               },
//             },
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "items.productObjectId",
//               foreignField: "_id",
//               as: "items.product",
//             },
//           },
//           { $unwind: "$items.product" },
//           {
//             $group: {
//               _id: "$_id",
//               userId: { $first: "$userId" },
//               items: { $push: "$items" },
//             },
//           },
//         ])
//         ?.toArray();
//     } catch (aggregationError) {
//       console.error("Aggregation failed, trying fallback:", aggregationError);

//       // Fallback: get cart and manually populate products
//       const cart = await cartsCollection?.findOne({
//         $or: [{ userId: user?.id }, { userId: new ObjectId(user?.id) }],
//       });

//       if (cart?.items?.length) {
//         const productsCollection = db?.collection("products");
//         const populatedItems = [];

//         for (const item of cart?.items || []) {
//           let product = null;
//           try {
//             product = await productsCollection?.findOne({
//               _id: new ObjectId(item?.productId),
//             });
//           } catch (e) {
//             product = await productsCollection?.findOne({
//               _id: item?.productId,
//             });
//           }

//           if (product) {
//             populatedItems.push({
//               ...item,
//               product,
//             });
//           }
//         }

//         cartWithProducts = [
//           {
//             _id: cart?._id,
//             userId: cart?.userId,
//             items: populatedItems,
//           },
//         ];
//       }
//     }

//     console.log("Cart found:", cartWithProducts?.length > 0 ? "Yes" : "No");

//     if (!cartWithProducts?.length || !cartWithProducts?.[0]?.items?.length) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Cart is empty",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const cartData = cartWithProducts?.[0];
//     let totalAmount = 0;
//     let discountAmount = 0;

//     // Calculate total
//     cartData?.items?.forEach((item) => {
//       totalAmount += (item?.product?.price || 0) * (item?.quantity || 0);
//     });

//     console.log("Total amount calculated:", totalAmount);

//     // Apply coupon if provided
//     if (couponCode) {
//       const coupon = await couponsCollection?.findOne({
//         code: couponCode?.toUpperCase(),
//         isActive: true,
//       });

//       if (coupon) {
//         discountAmount = (totalAmount * (coupon?.discount || 0)) / 100;
//         console.log("Discount applied:", discountAmount);
//       }
//     }

//     const finalAmount = totalAmount - discountAmount;

//     if (finalAmount <= 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid order amount",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     // Create order in database first
//     const orderResult = await ordersCollection?.insertOne({
//       userId: user?.id,
//       items: cartData?.items,
//       totalAmount: finalAmount,
//       discountAmount,
//       couponCode: couponCode?.toUpperCase(),
//       status: "payment_pending",
//       shippingAddress,
//       createdAt: new Date(),
//     });

//     const orderId = orderResult?.insertedId?.toString();
//     console.log("Order created with ID:", orderId);

//     // Create Cashfree payment order
//     // const cashfreeOrderData = {
//     //   order_id: orderId,
//     //   order_amount: finalAmount,
//     //   order_currency: "INR",
//     //   customer_details: {
//     //     customer_id: user?.id,
//     //     customer_name: dbUser?.name || "Customer",
//     //     customer_email: dbUser?.email || "customer@example.com",
//     //     customer_phone: dbUser?.phone || "9999999999",
//     //   },
//     //   order_meta: {
//     //     return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
//     //     notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
//     //   },
//     // };

//     // console.log("Creating Cashfree order with data:", cashfreeOrderData);

//     // const cashfreeOrder = await PGCreateOrder(cashfreeOrderData);
//     // console.log("Cashfree order created:", cashfreeOrder);

//     // if (!cashfreeOrder?.payment_session_id) {
//     //   throw new Error("Failed to create payment session");
//     // }

//     // Update order with payment session ID
//     // await ordersCollection?.updateOne(
//     //   { _id: orderResult?.insertedId },
//     //   {
//     //     $set: {
//     //       paymentSessionId: cashfreeOrder?.payment_session_id,
//     //       cashfreeOrderId: cashfreeOrder?.order_id,
//     //     },
//     //   }
//     // );

//     return NextResponse.json({
//       success: true,
//       message: "Payment order created successfully",
//       // data: {
//       //   orderId,
//       //   paymentSessionId: cashfreeOrder?.payment_session_id,
//       //   orderAmount: finalAmount,
//       // },
//       statusCode: 201,
//     });
//   } catch (error) {
//     console.error("Create payment order error:", error);

//     if (error?.message === "Authentication required") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Authentication required",
//           statusCode: 511,
//         },
//         { status: 511 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: error?.message || "Internal server error",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }
// // import { NextResponse } from "next/server";
// // import { getDatabase } from "@/lib/mongodb.js";
// // import { requireAuth } from "@/lib/auth.js";
// // import { PGCreateOrder } from "@/lib/cashfree.js";
// // import { ObjectId } from "mongodb";

// // export async function POST(request) {
// //   try {
// //     const user = requireAuth(request);
// //     const body = await request.json();
// //     const { shippingAddress, couponCode } = body || {};

// //     if (!shippingAddress) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Shipping address is required",
// //           statusCode: 400,
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const db = await getDatabase();
// //     const usersCollection = db.collection("users");
// //     const cartsCollection = db.collection("carts");
// //     const ordersCollection = db.collection("orders");
// //     const couponsCollection = db.collection("coupons");

// //     console.log("Looking for user with ID:", user?.id);

// //     let dbUser = null;
// //     try {
// //       if (ObjectId.isValid(user?.id)) {
// //         dbUser = await usersCollection.findOne({ _id: new ObjectId(user.id) });
// //       } else {
// //         dbUser = await usersCollection.findOne({ _id: user.id });
// //       }

// //       // Optional fallback: in case you're storing `id` field separately
// //       if (!dbUser) {
// //         dbUser = await usersCollection.findOne({ id: user.id });
// //       }
// //     } catch (err) {
// //       console.error("Error during user lookup:", err);
// //     }

// //     const users = await usersCollection.find({});
// //     console.log(users, "this is all users");

// //     if (!dbUser) {
// //       console.error("User not found in DB for ID:", user?.id);
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "User not found",
// //           statusCode: 404,
// //         },
// //         { status: 404 }
// //       );
// //     }

// //     // Fetch cart with populated product data
// //     console.log("Looking for cart for user:", user?.id);
// //     let cartWithProducts = [];

// //     try {
// //       cartWithProducts = await cartsCollection
// //         .aggregate([
// //           {
// //             $match: {
// //               $or: [{ userId: user?.id }, { userId: new ObjectId(user?.id) }],
// //             },
// //           },
// //           { $unwind: "$items" },
// //           {
// //             $addFields: {
// //               "items.productObjectId": {
// //                 $cond: {
// //                   if: { $eq: [{ $type: "$items.productId" }, "objectId"] },
// //                   then: "$items.productId",
// //                   else: { $toObjectId: "$items.productId" },
// //                 },
// //               },
// //             },
// //           },
// //           {
// //             $lookup: {
// //               from: "products",
// //               localField: "items.productObjectId",
// //               foreignField: "_id",
// //               as: "items.product",
// //             },
// //           },
// //           { $unwind: "$items.product" },
// //           {
// //             $group: {
// //               _id: "$_id",
// //               userId: { $first: "$userId" },
// //               items: { $push: "$items" },
// //             },
// //           },
// //         ])
// //         .toArray();
// //     } catch (aggregationError) {
// //       console.error("Aggregation failed, trying fallback:", aggregationError);

// //       const cart = await cartsCollection.findOne({
// //         $or: [{ userId: user?.id }, { userId: new ObjectId(user?.id) }],
// //       });

// //       if (cart?.items?.length) {
// //         const productsCollection = db.collection("products");
// //         const populatedItems = [];

// //         for (const item of cart.items || []) {
// //           let product = null;
// //           try {
// //             product = await productsCollection.findOne({
// //               _id: new ObjectId(item.productId),
// //             });
// //           } catch (e) {
// //             product = await productsCollection.findOne({
// //               _id: item.productId,
// //             });
// //           }

// //           if (product) {
// //             populatedItems.push({ ...item, product });
// //           }
// //         }

// //         cartWithProducts = [
// //           {
// //             _id: cart._id,
// //             userId: cart.userId,
// //             items: populatedItems,
// //           },
// //         ];
// //       }
// //     }

// //     if (!cartWithProducts?.length || !cartWithProducts[0]?.items?.length) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Cart is empty",
// //           statusCode: 400,
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const cartData = cartWithProducts[0];
// //     let totalAmount = 0;
// //     let discountAmount = 0;

// //     cartData.items.forEach((item) => {
// //       totalAmount += (item.product?.price || 0) * (item.quantity || 0);
// //     });

// //     // Apply coupon if provided
// //     if (couponCode) {
// //       const coupon = await couponsCollection.findOne({
// //         code: couponCode.toUpperCase(),
// //         isActive: true,
// //       });

// //       if (coupon) {
// //         discountAmount = (totalAmount * (coupon.discount || 0)) / 100;
// //       }
// //     }

// //     const finalAmount = totalAmount - discountAmount;

// //     if (finalAmount <= 0) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Invalid order amount",
// //           statusCode: 400,
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Create order in DB
// //     const orderResult = await ordersCollection.insertOne({
// //       userId: user.id,
// //       items: cartData.items,
// //       totalAmount: finalAmount,
// //       discountAmount,
// //       couponCode: couponCode?.toUpperCase() || null,
// //       status: "payment_pending",
// //       shippingAddress,
// //       createdAt: new Date(),
// //     });

// //     const orderId = orderResult.insertedId.toString();
// //     console.log("Order created with ID:", orderId);

// //     // Create payment order via Cashfree
// //     const cashfreeOrderData = {
// //       order_id: orderId,
// //       order_amount: finalAmount,
// //       order_currency: "INR",
// //       customer_details: {
// //         customer_id: user.id,
// //         customer_name: dbUser.name || "Customer",
// //         customer_email: dbUser.email || "customer@example.com",
// //         customer_phone: dbUser.phone || "9999999999",
// //       },
// //       order_meta: {
// //         return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
// //         notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
// //       },
// //     };

// //     const cashfreeOrder = await PGCreateOrder(cashfreeOrderData);

// //     if (!cashfreeOrder?.payment_session_id) {
// //       throw new Error("Failed to create payment session");
// //     }

// //     await ordersCollection.updateOne(
// //       { _id: orderResult.insertedId },
// //       {
// //         $set: {
// //           paymentSessionId: cashfreeOrder.payment_session_id,
// //           cashfreeOrderId: cashfreeOrder.order_id,
// //         },
// //       }
// //     );

// //     return NextResponse.json({
// //       success: true,
// //       message: "Payment order created successfully",
// //       data: {
// //         orderId,
// //         paymentSessionId: cashfreeOrder.payment_session_id,
// //         orderAmount: finalAmount,
// //       },
// //       statusCode: 201,
// //     });
// //   } catch (error) {
// //     console.error("Create payment order error:", error);

// //     if (error?.message === "Authentication required") {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Authentication required",
// //           statusCode: 511,
// //         },
// //         { status: 511 }
// //       );
// //     }

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         message: error?.message || "Internal server error",
// //         statusCode: 500,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { requireAuth } from "@/lib/auth";
import { User, Cart, Coupon, Order } from "@/models";
import axios from "axios";

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
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

    // ✅ Validate user
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // ✅ Fetch cart with product details
    const cart = await Cart.findOne({ userId: user.id }).populate(
      "items.productId"
    );
    if (!cart || !cart.items.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // ✅ Prepare order items
    const orderItems = [];
    let totalAmount = 0;
    let discountAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) continue;

      const quantity = item.quantity || 0;
      const price = product.price || 0;
      const subtotal = price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        product: {
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        },
        quantity,
        price,
        subtotal,
      });
    }

    // ✅ Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode?.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        discountAmount = (totalAmount * (coupon.discount || 0)) / 100;
        await Coupon.updateOne(
          { _id: coupon._id },
          { $inc: { usageCount: 1 } }
        );
      }
    }

    const finalAmount = totalAmount - discountAmount;
    if (finalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order amount",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // ✅ Create Order with required fields
    const newOrder = await Order.create({
      orderId: generateOrderId(),
      userId: user.id,
      items: orderItems,
      totalAmount: finalAmount,
      discountAmount,
      paymentStatus: "pending",
      couponCode: couponCode?.toUpperCase(),
      status: "pending",
      shippingAddress,
    });

    // ✅ Clear cart after placing order
    let sessionId = "";
    try {
      const response = await axios.request({
        method: "POST",
        url: "https://sandbox.cashfree.com/pg/orders",
        headers: {
          accept: "application/json",
          "x-api-version": "2022-09-01",
          "content-type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
        data: {
          customer_details: {
            customer_id: user.id,
            customer_email: dbUser?.email || "",
            customer_phone: dbUser?.phone || "0000000000",
            customer_name: dbUser?.name || "Customer",
          },
          order_meta: {
            notify_url:
              "https://webhook.site/6e7d8a98-3685-45d8-894f-33ddd276a2fd",
            payment_methods: "cc,dc,upi",
          },
          order_tags: {
            customerId: dbUser.id,
            orderId: newOrder.orderId,
          },
          order_amount: finalAmount,
          order_id: newOrder.orderId,
          order_currency: "INR",
          order_note:
            "This is payment is for product buying" + " " + user.email,
        },
      });

      sessionId = response.data.payment_session_id;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    }
    await Cart.clearCart(user.id);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: newOrder.orderId,
        totalAmount: finalAmount,
        sessionId: sessionId,
      },
      statusCode: 201,
    });
  } catch (error) {
    console.error("Order placement error:", error);

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

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
