import { NextResponse } from "next/server"
import connectDB from "@/lib/mongoose.js"
import { generateToken } from "@/lib/jwt.js"
import { User } from "@/models/index.js"

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
          statusCode: 400,
        },
        { status: 400 },
      )
    }

    const user = await User.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          statusCode: 401,
        },
        { status: 401 },
      )
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          statusCode: 401,
        },
        { status: 401 },
      )
    }

    const authUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = generateToken(authUser)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: { user: authUser, token },
      statusCode: 200,
    })
  } catch (error) {
    console.error("Login error:", error)
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
