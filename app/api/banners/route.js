import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose.js"
import { requireRole } from "@/lib/jwt.js"
import { Banner } from "@/models/index.js"

export async function GET() {
  try {
    await connectDB()

    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      message: "Banners fetched successfully",
      data: Array.isArray(banners) ? banners : [],
      statusCode: 200,
    })
  } catch (error) {
    console.error("Get banners error:", error)
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

export async function POST(request) {
  try {
    const user = requireRole(request, ["admin"])
    await connectDB()

    const body = await request.json()
    const { title, image } = body || {}

    if (!title || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and image are required",
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    const result = await Banner.create({
      title,
      image,
      isActive: true,
      createdBy: user?.id,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully",
        data: { id: result?._id },
        statusCode: 201,
      },
      { status: 201 },
    )
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

    console.error("Create banner error:", error)
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
