import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose.js";
import { requireRole } from "@/lib/jwt.js";
import { Product } from "@/models/index.js";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page")) || 1;
    const limit = Number.parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minPrice = Number.parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice =
      Number.parseFloat(searchParams.get("maxPrice")) || Number.MAX_VALUE;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (minPrice > 0 || maxPrice < Number.MAX_VALUE) {
      query.price = {};
      if (minPrice > 0) query.price.$gte = minPrice;
      if (maxPrice < Number.MAX_VALUE) query.price.$lte = maxPrice;
    }

    const sortOptions = {
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      name: { name: 1 },
      rating: { "ratings.average": -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const skip = (page - 1) * limit;
    const [products, total, categories] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
      Product.distinct("category", { isActive: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        data: {
          products: Array.isArray(products) ? products : [],
          categories: Array.isArray(categories) ? categories : [],
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit,
          },
          filters: {
            search,
            category,
            sortBy,
            sortOrder,
            minPrice,
            maxPrice,
          },
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch products",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = requireRole(request, ["admin"]);

    const body = await request.json();
    const { name, description, price, image, stock, category, brand, tags } =
      body || {};

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      stock === undefined ||
      !category
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      description,
      price: Number.parseFloat(price),
      image,
      stock: Number.parseInt(stock),
      category,
      brand,
      tags: tags ? tags.split(",")?.map((tag) => tag.trim()) : [],
      isActive: true,
    });

    const savedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: { id: savedProduct._id },
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
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

    if (error?.message === "Insufficient permissions") {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient permissions",
          statusCode: 403,
        },
        { status: 403 }
      );
    }

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

    console.error("Create product error:", error);
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
