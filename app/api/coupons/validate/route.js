import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose.js"
import { requireAuth } from "@/lib/jwt.js"
import { Coupon } from "@/models/index.js"

export async function POST(request) {
  try {
    const user = requireAuth(request)
    await connectDB()

    const body = await request.json()
    const { code } = body || {}

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code is required",
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    const coupon = await Coupon.findOne({
      code: code?.toUpperCase(),
      isActive: true,
    })

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon code",
          statusCode: 404,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Coupon is valid",
      data: {
        code: coupon?.code,
        discount: coupon?.discount,
        influencerName: coupon?.influencerName,
      },
      statusCode: 200,
    })
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

    console.error("Validate coupon error:", error)
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
