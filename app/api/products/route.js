// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongoose.js";
// import { requireRole } from "@/lib/jwt.js";
// import { Product } from "@/models/index.js";

// export async function GET(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const page = Number.parseInt(searchParams.get("page")) || 1;
//     const limit = Number.parseInt(searchParams.get("limit")) || 12;
//     const search = searchParams.get("search") || "";
//     const category = searchParams.get("category") || "";
//     const sortBy = searchParams.get("sortBy") || "createdAt";
//     const sortOrder = searchParams.get("sortOrder") || "desc";
//     const minPrice = Number.parseFloat(searchParams.get("minPrice")) || 0;
//     const maxPrice =
//       Number.parseFloat(searchParams.get("maxPrice")) || Number.MAX_VALUE;

//     const query = { isActive: true };

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//         { brand: { $regex: search, $options: "i" } },
//         { tags: { $in: [new RegExp(search, "i")] } },
//       ];
//     }

//     if (category && category !== "all") {
//       query.category = category;
//     }

//     if (minPrice > 0 || maxPrice < Number.MAX_VALUE) {
//       query.price = {};
//       if (minPrice > 0) query.price.$gte = minPrice;
//       if (maxPrice < Number.MAX_VALUE) query.price.$lte = maxPrice;
//     }

//     const sortOptions = {
//       "price-low": { price: 1 },
//       "price-high": { price: -1 },
//       name: { name: 1 },
//       rating: { "ratings.average": -1 },
//       newest: { createdAt: -1 },
//       oldest: { createdAt: 1 },
//     };

//     const sort = sortOptions[sortBy] || { createdAt: -1 };

//     const skip = (page - 1) * limit;
//     const [products, total, categories] = await Promise.all([
//       Product.find(query).sort(sort).skip(skip).limit(limit),
//       Product.countDocuments(query),
//       Product.distinct("category", { isActive: true }),
//     ]);

//     const totalPages = Math.ceil(total / limit);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Products fetched successfully",
//         data: {
//           products: Array.isArray(products) ? products : [],
//           categories: Array.isArray(categories) ? categories : [],
//           pagination: {
//             currentPage: page,
//             totalPages,
//             totalProducts: total,
//             hasNextPage: page < totalPages,
//             hasPrevPage: page > 1,
//             limit,
//           },
//           filters: {
//             search,
//             category,
//             sortBy,
//             sortOrder,
//             minPrice,
//             maxPrice,
//           },
//         },
//         statusCode: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get products error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Failed to fetch products",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     await connectDB();
//     const user = requireRole(request, ["admin"]);

//     const body = await request.json();
//     const { name, description, price, image, stock, category, brand, tags } =
//       body || {};

//     if (
//       !name ||
//       !description ||
//       !price ||
//       !image ||
//       stock === undefined ||
//       !category
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "All required fields must be provided",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     const product = new Product({
//       name,
//       description,
//       price: Number.parseFloat(price),
//       image,
//       stock: Number.parseInt(stock),
//       category,
//       brand,
//       tags: tags ? tags.split(",")?.map((tag) => tag.trim()) : [],
//       isActive: true,
//     });

//     const savedProduct = await product.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product created successfully",
//         data: { id: savedProduct._id },
//         statusCode: 201,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
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

//     if (error?.message === "Insufficient permissions") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Insufficient permissions",
//           statusCode: 403,
//         },
//         { status: 403 }
//       );
//     }

//     if (error?.name === "ValidationError") {
//       const messages = Object.values(error.errors)?.map((err) => err.message);
//       return NextResponse.json(
//         {
//           success: false,
//           message: messages.join(", "),
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     console.error("Create product error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal server error",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models";
import { authenticateUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectToDatabase();

    // Authenticate admin user
    // const user = await authenticateUser(request);
    // if (user?.role !== "admin") {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Admin access required",
    //       statusCode: 403,
    //     },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request?.url || "");
    const page = Number.parseInt(searchParams?.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams?.get("limit") || "10", 10);
    const search = searchParams?.get("search");
    const category = searchParams?.get("category");
    const status = searchParams?.get("status"); // 'active', 'inactive', 'all'

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.isActive = status === "active";
    }

    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { category: { $regex: new RegExp(search, "i") } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const safeProducts = Array.isArray(products) ? products : [];

    return NextResponse.json(
      {
        success: true,
        message: `Found ${safeProducts?.length || 0} products`,
        data: {
          products: safeProducts,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit,
          },
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message === "Admin access required"
            ? error?.message
            : "Failed to fetch products",
        error: error?.message || "Unknown error occurred",
        statusCode: error?.message === "Admin access required" ? 403 : 500,
      },
      { status: error?.message === "Admin access required" ? 403 : 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    // Authenticate admin user
    const user = await authenticateUser(request);
    if (user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
          statusCode: 403,
        },
        { status: 403 }
      );
    }

    const body = await request?.json();
    const { name, description, price, category, stock, images, image } =
      body || {};

    // Validation
    const errors = [];

    if (!name?.trim()) {
      errors.push("Product name is required");
    }

    if (!description?.trim()) {
      errors.push("Product description is required");
    }

    if (!price || isNaN(price) || price <= 0) {
      errors.push("Valid product price is required");
    }

    if (!category?.trim()) {
      errors.push("Product category is required");
    }

    if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
      errors.push("Valid stock quantity is required");
    }

    // Check if at least one image is provided
    const productImages =
      images && Array.isArray(images) ? images?.filter(Boolean) : [];
    if (image && !productImages?.includes(image)) {
      productImages.unshift(image);
    }

    if (productImages?.length === 0) {
      errors.push("At least one product image is required");
    }

    if (errors?.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Check for duplicate product name
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name?.trim()}$`, "i") },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with this name already exists",
          statusCode: 409,
        },
        { status: 409 }
      );
    }

    // Create product
    const productData = {
      name: name?.trim(),
      description: description?.trim(),
      price: Number.parseFloat(price),
      category: category?.trim(),
      stock: Number.parseInt(stock, 10),
      images: productImages,
      image: productImages?.[0] || null, // Keep for backward compatibility
      isActive: true,
      createdBy: user?.userId,
    };

    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: { product },
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(error?.errors || {})?.map(
        (err) => err?.message
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error?.message || "Unknown error occurred",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();

    // Authenticate admin user
    const user = await authenticateUser(request);
    if (user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
          statusCode: 403,
        },
        { status: 403 }
      );
    }

    const body = await request?.json();
    const {
      id,
      name,
      description,
      price,
      category,
      stock,
      images,
      image,
      isActive,
    } = body || {};

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Find product
    const product = await Product.findById(id);
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

    // Validation
    const errors = [];

    if (name !== undefined && !name?.trim()) {
      errors.push("Product name cannot be empty");
    }

    if (description !== undefined && !description?.trim()) {
      errors.push("Product description cannot be empty");
    }

    if (price !== undefined && (isNaN(price) || price <= 0)) {
      errors.push("Valid product price is required");
    }

    if (category !== undefined && !category?.trim()) {
      errors.push("Product category cannot be empty");
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      errors.push("Valid stock quantity is required");
    }

    if (errors?.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Check for duplicate name (excluding current product)
    if (name && name?.trim() !== product?.name) {
      const existingProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${name?.trim()}$`, "i") },
        _id: { $ne: id },
      });

      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            message: "A product with this name already exists",
            statusCode: 409,
          },
          { status: 409 }
        );
      }
    }

    // Update product
    const updateData = {};
    if (name !== undefined) updateData.name = name?.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (price !== undefined) updateData.price = Number.parseFloat(price);
    if (category !== undefined) updateData.category = category?.trim();
    if (stock !== undefined) updateData.stock = Number.parseInt(stock, 10);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // Handle images update
    if (images !== undefined) {
      const productImages = Array.isArray(images)
        ? images?.filter(Boolean)
        : [];
      if (image && !productImages?.includes(image)) {
        productImages.unshift(image);
      }
      updateData.images = productImages;
      updateData.image = productImages?.[0] || null; // Keep for backward compatibility
    } else if (image !== undefined) {
      // If only single image is provided, update both fields
      updateData.image = image;
      if (image) {
        updateData.images = [image];
      }
    }

    updateData.updatedAt = new Date();

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: { product: updatedProduct },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);

    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(error?.errors || {})?.map(
        (err) => err?.message
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error?.message || "Unknown error occurred",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    // Authenticate admin user
    const user = await authenticateUser(request);
    if (user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
          statusCode: 403,
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request?.url || "");
    const id = searchParams?.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Find and delete product
    const product = await Product.findByIdAndDelete(id);
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

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: { deletedProduct: product },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
        error: error?.message || "Unknown error occurred",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
