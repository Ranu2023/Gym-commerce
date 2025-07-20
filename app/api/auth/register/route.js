import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose.js";
import { generateToken } from "@/lib/jwt.js";
import { User } from "@/models/index.js";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, name, role = "user" } = body || {};

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password, and name are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
          statusCode: 409,
        },
        { status: 409 }
      );
    }

    const newUser = new User({
      email,
      password,
      name,
      role,
    });

    const savedUser = await newUser.save();

    const user = {
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
    };

    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: { user, token },
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error?.name === "ValidationError") {
      const messages = Object.values(error.errors)?.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(", "),
          statusCode: 400,
        },
        { status: 400 }
      );
    }

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
