// import { NextResponse } from "next/server";
// import { uploadImage } from "@/lib/cloudinary.js";

// export async function POST(request) {
//   try {
//     const contentType = request.headers.get("content-type");

//     if (!contentType || !contentType.includes("multipart/form-data")) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Content-Type must be multipart/form-data",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const formData = await request.formData();
//     const file = formData.get("image");

//     if (!file) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "No file provided. Please select an image to upload.",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     if (!(file instanceof File)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid file format. Please upload a valid image file.",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "image/gif",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "File size too large. Please upload an image smaller than 5MB.",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const imageUrl = await uploadImage(file);

//     if (!imageUrl) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Failed to upload image. Please try again.",
//           statusCode: 500,
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Image uploaded successfully",
//         data: {
//           url: imageUrl,
//           filename: file.name,
//           size: file.size,
//           type: file.type,
//         },
//         statusCode: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Image upload error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Internal server error during image upload",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images"); // Get all files with name "images"
    const singleFile = formData.get("image"); // Get single file with name "image"

    // Handle both single and multiple file uploads
    const filesToProcess = [];

    if (files && files.length > 0) {
      // Multiple files
      filesToProcess.push(...files.filter((file) => file instanceof File));
    }

    if (singleFile && singleFile instanceof File) {
      // Single file (for backward compatibility)
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid image files provided",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of filesToProcess) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.`,
            statusCode: 400,
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: `File ${file.name} is too large. Maximum size is 5MB.`,
            statusCode: 400,
          },
          { status: 400 }
        );
      }
    }

    // Upload files to Cloudinary
    const uploadPromises = filesToProcess.map(async (file) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "gym-supplements",
                transformation: [
                  { width: 800, height: 800, crop: "limit" },
                  { quality: "auto" },
                  { format: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  reject(error);
                } else {
                  resolve(result?.secure_url);
                }
              }
            )
            .end(buffer);
        });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        throw new Error(`Failed to process ${file.name}`);
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(Boolean);

      if (validUrls.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to upload any images",
            statusCode: 500,
          },
          { status: 500 }
        );
      }

      // Return response based on whether it was single or multiple upload
      if (filesToProcess.length === 1) {
        // Single file upload (backward compatibility)
        return NextResponse.json(
          {
            success: true,
            message: "Image uploaded successfully",
            data: {
              url: validUrls[0],
              urls: validUrls, // Also provide array for consistency
            },
            statusCode: 200,
          },
          { status: 200 }
        );
      } else {
        // Multiple files upload
        return NextResponse.json(
          {
            success: true,
            message: `${validUrls.length} images uploaded successfully`,
            data: {
              urls: validUrls,
              count: validUrls.length,
            },
            statusCode: 200,
          },
          { status: 200 }
        );
      }
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload images to cloud storage",
          error: uploadError.message,
          statusCode: 500,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process image upload",
        error: error.message || "Unknown error occurred",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
