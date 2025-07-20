import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb.js"
import { requireAuth } from "@/lib/auth.js"
import { PGOrderFetchPayments } from "@/lib/cashfree.js"
import { ObjectId } from "mongodb"

export async function POST(request) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { orderId } = body || {}

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const ordersCollection = db?.collection("orders")

    // Find order
    let order = null
    try {
      order = await ordersCollection?.findOne({
        _id: new ObjectId(orderId),
        userId: user?.id,
      })
    } catch (e) {
      order = await ordersCollection?.findOne({
        _id: orderId,
        userId: user?.id,
      })
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    // Verify payment with Cashfree
    try {
      const payments = await PGOrderFetchPayments(order?.cashfreeOrderId || orderId)
      const payment = payments?.[0]

      if (payment?.payment_status === "SUCCESS") {
        // Update order status if not already updated
        if (order?.status === "payment_pending") {
          await ordersCollection?.updateOne(
            { _id: order?._id },
            {
              $set: {
                status: "confirmed",
                paymentStatus: "paid",
                paymentData: payment,
                updatedAt: new Date(),
              },
            },
          )

          // Clear cart
          const cartsCollection = db?.collection("carts")
          await cartsCollection?.deleteOne({
            $or: [{ userId: user?.id }, { userId: new ObjectId(user?.id) }],
          })
        }

        return NextResponse.json({
          success: true,
          message: "Payment verified successfully",
          data: {
            order: { ...order, status: "confirmed", paymentStatus: "paid" },
            payment,
          },
          statusCode: 200,
        })
      } else {
        return NextResponse.json({
          success: false,
          message: "Payment not completed",
          data: { order, payment },
          statusCode: 400,
        })
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      return NextResponse.json({
        success: false,
        message: "Payment verification failed",
        statusCode: 500,
      })
    }
  } catch (error) {
    if (error?.message === "Authentication required") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          statusCode: 511,
        },
        { status: 511 },
      )
    }

    console.error("Verify payment error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        statusCode: 500,
      },
      { status: 500 },
    )
  }
}
