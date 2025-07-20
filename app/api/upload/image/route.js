import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary.js";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type must be multipart/form-data",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided. Please select an image to upload.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file format. Please upload a valid image file.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File size too large. Please upload an image smaller than 5MB.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImage(file);

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image. Please try again.",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
          filename: file.name,
          size: file.size,
          type: file.type,
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during image upload",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
