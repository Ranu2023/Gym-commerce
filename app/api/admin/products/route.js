// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongoose";
// import { Product } from "@/models";
// import { authenticateUser } from "@/lib/auth";

// export async function GET(request) {
//   try {
//     await connectToDatabase();

//     // Authenticate admin user
//     const user = await authenticateUser(request);
//     if (user?.role !== "admin") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Admin access required",
//           statusCode: 403,
//         },
//         { status: 403 }
//       );
//     }

//     const { searchParams } = new URL(request?.url || "");
//     const page = Number.parseInt(searchParams?.get("page") || "1", 10);
//     const limit = Number.parseInt(searchParams?.get("limit") || "10", 10);
//     const search = searchParams?.get("search");
//     const category = searchParams?.get("category");
//     const status = searchParams?.get("status"); // 'active', 'inactive', 'all'

//     // Build filter
//     const filter = {};

//     if (status && status !== "all") {
//       filter.isActive = status === "active";
//     }

//     if (category && category !== "all") {
//       filter.category = { $regex: new RegExp(category, "i") };
//     }

//     if (search) {
//       filter.$or = [
//         { name: { $regex: new RegExp(search, "i") } },
//         { description: { $regex: new RegExp(search, "i") } },
//         { category: { $regex: new RegExp(search, "i") } },
//       ];
//     }

//     const skip = (page - 1) * limit;

//     const [products, totalCount] = await Promise.all([
//       Product.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Product.countDocuments(filter),
//     ]);

//     const totalPages = Math.ceil(totalCount / limit);
//     const safeProducts = Array.isArray(products) ? products : [];

//     return NextResponse.json(
//       {
//         success: true,
//         message: `Found ${safeProducts?.length || 0} products`,
//         data: {
//           products: safeProducts,
//           pagination: {
//             currentPage: page,
//             totalPages,
//             totalCount,
//             hasNextPage: page < totalPages,
//             hasPrevPage: page > 1,
//             limit,
//           },
//         },
//         statusCode: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching admin products:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error?.message === "Admin access required"
//             ? error?.message
//             : "Failed to fetch products",
//         error: error?.message || "Unknown error occurred",
//         statusCode: error?.message === "Admin access required" ? 403 : 500,
//       },
//       { status: error?.message === "Admin access required" ? 403 : 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     await connectToDatabase();

//     // Authenticate admin user
//     const user = await authenticateUser(request);
//     if (user?.role !== "admin") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Admin access required",
//           statusCode: 403,
//         },
//         { status: 403 }
//       );
//     }

//     const body = await request?.json();
//     const { name, description, price, category, stock, image } = body || {};

//     // Validation
//     const errors = [];

//     if (!name?.trim()) {
//       errors.push("Product name is required");
//     }

//     if (!description?.trim()) {
//       errors.push("Product description is required");
//     }

//     if (!price || isNaN(price) || price <= 0) {
//       errors.push("Valid product price is required");
//     }

//     if (!category?.trim()) {
//       errors.push("Product category is required");
//     }

//     if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
//       errors.push("Valid stock quantity is required");
//     }

//     if (errors?.length > 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors,
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     // Check for duplicate product name
//     const existingProduct = await Product.findOne({
//       name: { $regex: new RegExp(`^${name?.trim()}$`, "i") },
//     });

//     if (existingProduct) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "A product with this name already exists",
//           statusCode: 409,
//         },
//         { status: 409 }
//       );
//     }

//     // Create product
//     const productData = {
//       name: name?.trim(),
//       description: description?.trim(),
//       price: Number.parseFloat(price),
//       category: category?.trim(),
//       stock: Number.parseInt(stock, 10),
//       image: image || null,
//       isActive: true,
//       createdBy: user?.userId,
//     };

//     const product = new Product(productData);
//     await product.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product created successfully",
//         data: { product },
//         statusCode: 201,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating product:", error);

//     if (error?.name === "ValidationError") {
//       const validationErrors = Object.values(error?.errors || {})?.map(
//         (err) => err?.message
//       );
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors: validationErrors,
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to create product",
//         error: error?.message || "Unknown error occurred",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request) {
//   try {
//     await connectToDatabase();

//     // Authenticate admin user
//     const user = await authenticateUser(request);
//     if (user?.role !== "admin") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Admin access required",
//           statusCode: 403,
//         },
//         { status: 403 }
//       );
//     }

//     const body = await request?.json();
//     const { id, name, description, price, category, stock, image, isActive } =
//       body || {};

//     if (!id) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product ID is required",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     // Find product
//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product not found",
//           statusCode: 404,
//         },
//         { status: 404 }
//       );
//     }

//     // Validation
//     const errors = [];

//     if (name !== undefined && !name?.trim()) {
//       errors.push("Product name cannot be empty");
//     }

//     if (description !== undefined && !description?.trim()) {
//       errors.push("Product description cannot be empty");
//     }

//     if (price !== undefined && (isNaN(price) || price <= 0)) {
//       errors.push("Valid product price is required");
//     }

//     if (category !== undefined && !category?.trim()) {
//       errors.push("Product category cannot be empty");
//     }

//     if (stock !== undefined && (isNaN(stock) || stock < 0)) {
//       errors.push("Valid stock quantity is required");
//     }

//     if (errors?.length > 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors,
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     // Check for duplicate name (excluding current product)
//     if (name && name?.trim() !== product?.name) {
//       const existingProduct = await Product.findOne({
//         name: { $regex: new RegExp(`^${name?.trim()}$`, "i") },
//         _id: { $ne: id },
//       });

//       if (existingProduct) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "A product with this name already exists",
//             statusCode: 409,
//           },
//           { status: 409 }
//         );
//       }
//     }

//     // Update product
//     const updateData = {};
//     if (name !== undefined) updateData.name = name?.trim();
//     if (description !== undefined) updateData.description = description?.trim();
//     if (price !== undefined) updateData.price = Number.parseFloat(price);
//     if (category !== undefined) updateData.category = category?.trim();
//     if (stock !== undefined) updateData.stock = Number.parseInt(stock, 10);
//     if (image !== undefined) updateData.image = image;
//     if (isActive !== undefined) updateData.isActive = Boolean(isActive);
//     updateData.updatedAt = new Date();

//     const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product updated successfully",
//         data: { product: updatedProduct },
//         statusCode: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating product:", error);

//     if (error?.name === "ValidationError") {
//       const validationErrors = Object.values(error?.errors || {})?.map(
//         (err) => err?.message
//       );
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation failed",
//           errors: validationErrors,
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to update product",
//         error: error?.message || "Unknown error occurred",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request) {
//   try {
//     await connectToDatabase();

//     // Authenticate admin user
//     const user = await authenticateUser(request);
//     if (user?.role !== "admin") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Admin access required",
//           statusCode: 403,
//         },
//         { status: 403 }
//       );
//     }

//     const { searchParams } = new URL(request?.url || "");
//     const id = searchParams?.get("id");

//     if (!id) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product ID is required",
//           statusCode: 400,
//         },
//         { status: 400 }
//       );
//     }

//     // Find and delete product
//     const product = await Product.findByIdAndDelete(id);
//     if (!product) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product not found",
//           statusCode: 404,
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product deleted successfully",
//         data: { deletedProduct: product },
//         statusCode: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to delete product",
//         error: error?.message || "Unknown error occurred",
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
    console.error("Error fetching admin products:", error);
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

    // Handle images - ensure we have at least one image
    let productImages = [];

    // Process images array
    if (images && Array.isArray(images)) {
      productImages = images.filter(
        (img) => img && typeof img === "string" && img.trim()
      );
    }

    // Process single image (backward compatibility)
    if (image && typeof image === "string" && image.trim()) {
      if (!productImages.includes(image.trim())) {
        productImages.unshift(image.trim());
      }
    }

    if (productImages.length === 0) {
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
    if (images !== undefined || image !== undefined) {
      let productImages = [];

      // Process images array
      if (images && Array.isArray(images)) {
        productImages = images.filter(
          (img) => img && typeof img === "string" && img.trim()
        );
      }

      // Process single image (backward compatibility)
      if (image && typeof image === "string" && image.trim()) {
        if (!productImages.includes(image.trim())) {
          productImages.unshift(image.trim());
        }
      }

      // If no new images provided, keep existing ones
      if (
        productImages.length === 0 &&
        product.images &&
        product.images.length > 0
      ) {
        productImages = product.images;
      }

      updateData.images = productImages;
      updateData.image = productImages?.[0] || null; // Keep for backward compatibility
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
