// import mongoose from "mongoose"

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Product name is required"],
//       trim: true,
//       maxlength: [100, "Product name cannot exceed 100 characters"],
//     },
//     description: {
//       type: String,
//       required: [true, "Product description is required"],
//       trim: true,
//       maxlength: [1000, "Description cannot exceed 1000 characters"],
//     },
//     price: {
//       type: Number,
//       required: [true, "Product price is required"],
//       min: [0, "Price cannot be negative"],
//       validate: {
//         validator: (value) => value > 0,
//         message: "Price must be greater than 0",
//       },
//     },
//     image: {
//       type: String,
//       required: [true, "Product image is required"],
//       trim: true,
//     },
//     stock: {
//       type: Number,
//       required: [true, "Stock quantity is required"],
//       min: [0, "Stock cannot be negative"],
//       default: 0,
//     },
//     category: {
//       type: String,
//       required: [true, "Product category is required"],
//       trim: true,
//       enum: {
//         values: ["Protein", "Pre-Workout", "Post-Workout", "Vitamins", "Creatine", "Fat Burners", "Mass Gainers"],
//         message: "Please select a valid category",
//       },
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     sku: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//     nutritionFacts: {
//       servingSize: String,
//       calories: Number,
//       protein: Number,
//       carbs: Number,
//       fat: Number,
//       fiber: Number,
//       sugar: Number,
//     },
//     ingredients: [String],
//     brand: {
//       type: String,
//       trim: true,
//     },
//     weight: {
//       value: Number,
//       unit: {
//         type: String,
//         enum: ["g", "kg", "lb", "oz"],
//         default: "g",
//       },
//     },
//     ratings: {
//       average: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       count: {
//         type: Number,
//         default: 0,
//       },
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// )

// productSchema.index({ name: "text", description: "text" })
// productSchema.index({ category: 1 })
// productSchema.index({ isActive: 1 })
// productSchema.index({ price: 1 })
// productSchema.index({ "ratings.average": -1 })

// productSchema.virtual("formattedPrice").get(function () {
//   return `$${this.price?.toFixed(2)}`
// })

// productSchema.virtual("stockStatus").get(function () {
//   if (this.stock === 0) return "out-of-stock"
//   if (this.stock <= 5) return "low-stock"
//   return "in-stock"
// })

// productSchema.pre("save", function (next) {
//   if (!this.sku && this.isNew) {
//     this.sku = `${this.category?.toUpperCase()?.slice(0, 3)}-${Date.now()}`
//   }
//   next()
// })

// productSchema.statics.findActive = function (filter = {}) {
//   return this.find({ ...filter, isActive: true })
// }

// productSchema.statics.searchProducts = function (query, options = {}) {
//   const searchFilter = {
//     isActive: true,
//     $or: [
//       { name: { $regex: query, $options: "i" } },
//       { description: { $regex: query, $options: "i" } },
//       { category: { $regex: query, $options: "i" } },
//       { tags: { $in: [new RegExp(query, "i")] } },
//     ],
//   }

//   let queryBuilder = this.find(searchFilter)

//   if (options.category) {
//     queryBuilder = queryBuilder.where("category").equals(options.category)
//   }

//   if (options.minPrice || options.maxPrice) {
//     const priceFilter = {}
//     if (options.minPrice) priceFilter.$gte = options.minPrice
//     if (options.maxPrice) priceFilter.$lte = options.maxPrice
//     queryBuilder = queryBuilder
//       .where("price")
//       .gte(priceFilter.$gte || 0)
//       .lte(priceFilter.$lte || Number.POSITIVE_INFINITY)
//   }

//   if (options.sortBy) {
//     const sortOptions = {
//       "price-low": { price: 1 },
//       "price-high": { price: -1 },
//       name: { name: 1 },
//       rating: { "ratings.average": -1 },
//       newest: { createdAt: -1 },
//     }
//     queryBuilder = queryBuilder.sort(sortOptions[options.sortBy] || { createdAt: -1 })
//   }

//   if (options.limit) {
//     queryBuilder = queryBuilder.limit(options.limit)
//   }

//   return queryBuilder
// }

// productSchema.methods.isAvailable = function (quantity = 1) {
//   return this.isActive && this.stock >= quantity
// }

// productSchema.methods.updateStock = function (quantity, operation = "subtract") {
//   if (operation === "subtract") {
//     this.stock = Math.max(0, this.stock - quantity)
//   } else if (operation === "add") {
//     this.stock += quantity
//   }
//   return this.save()
// }

// export default mongoose.models.Product || mongoose.model("Product", productSchema)

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: (value) => value > 0,
        message: "Price must be greater than 0",
      },
    },
    // Updated to support multiple images
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images?.length > 0,
        message: "At least one product image is required",
      },
    },
    // Keep the old image field for backward compatibility
    image: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      enum: {
        values: [
          "Protein",
          "Pre-Workout",
          "Post-Workout",
          "Vitamins",
          "Creatine",
          "Fat Burners",
          "Mass Gainers",
        ],
        message: "Please select a valid category",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionFacts: {
      servingSize: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
    },
    ingredients: [String],
    brand: {
      type: String,
      trim: true,
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg", "lb", "oz"],
        default: "g",
      },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "ratings.average": -1 });

productSchema.virtual("formattedPrice").get(function () {
  return `$${this?.price?.toFixed(2) || "0.00"}`;
});

productSchema.virtual("stockStatus").get(function () {
  if (this?.stock === 0) return "out-of-stock";
  if ((this?.stock || 0) <= 5) return "low-stock";
  return "in-stock";
});

// Virtual for primary image (first image or fallback to old image field)
productSchema.virtual("primaryImage").get(function () {
  return this?.images?.[0] || this?.image || null;
});

// Virtual for all images (combines new images array with old image field)
productSchema.virtual("allImages").get(function () {
  const images = [...(this?.images || [])];
  if (this?.image && !images?.includes(this?.image)) {
    images.unshift(this?.image);
  }
  return images?.filter(Boolean) || [];
});

productSchema.pre("save", function (next) {
  try {
    if (!this?.sku && this?.isNew) {
      this.sku = `${
        this?.category?.toUpperCase()?.slice(0, 3) || "PRD"
      }-${Date.now()}`;
    }

    // Migrate old image field to images array if needed
    if (this?.image && (!this?.images || this?.images?.length === 0)) {
      this.images = [this?.image];
    }

    next();
  } catch (error) {
    next(error);
  }
});

productSchema.statics.findActive = function (filter = {}) {
  try {
    return this.find({ ...filter, isActive: true });
  } catch (error) {
    throw new Error(`Error finding active products: ${error?.message}`);
  }
};

productSchema.statics.searchProducts = function (query, options = {}) {
  try {
    const searchFilter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    };

    let queryBuilder = this.find(searchFilter);

    if (options?.category) {
      queryBuilder = queryBuilder.where("category").equals(options?.category);
    }

    if (options?.minPrice || options?.maxPrice) {
      const priceFilter = {};
      if (options?.minPrice) priceFilter.$gte = options?.minPrice;
      if (options?.maxPrice) priceFilter.$lte = options?.maxPrice;
      queryBuilder = queryBuilder
        .where("price")
        .gte(priceFilter?.$gte || 0)
        .lte(priceFilter?.$lte || Number.POSITIVE_INFINITY);
    }

    if (options?.sortBy) {
      const sortOptions = {
        "price-low": { price: 1 },
        "price-high": { price: -1 },
        name: { name: 1 },
        rating: { "ratings.average": -1 },
        newest: { createdAt: -1 },
      };
      queryBuilder = queryBuilder.sort(
        sortOptions?.[options?.sortBy] || { createdAt: -1 }
      );
    }

    if (options?.limit) {
      queryBuilder = queryBuilder.limit(options?.limit);
    }

    return queryBuilder;
  } catch (error) {
    throw new Error(`Error searching products: ${error?.message}`);
  }
};

productSchema.methods.isAvailable = function (quantity = 1) {
  try {
    return this?.isActive && (this?.stock || 0) >= quantity;
  } catch (error) {
    return false;
  }
};

productSchema.methods.updateStock = function (
  quantity,
  operation = "subtract"
) {
  try {
    if (operation === "subtract") {
      this.stock = Math.max(0, (this?.stock || 0) - quantity);
    } else if (operation === "add") {
      this.stock = (this?.stock || 0) + quantity;
    }
    return this.save();
  } catch (error) {
    throw new Error(`Error updating stock: ${error?.message}`);
  }
};

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
