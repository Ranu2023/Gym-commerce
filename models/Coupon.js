import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
    },
    discount: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    influencerName: {
      type: String,
      trim: true,
      maxlength: [50, "Influencer name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Usage count cannot be negative"],
    },
    maxUsage: {
      type: Number,
      min: [1, "Max usage must be at least 1"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount cannot be negative"],
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    applicableCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

couponSchema.virtual("isExpired").get(function () {
  return this.validUntil && new Date() > this.validUntil;
});

couponSchema.virtual("isUsageLimitReached").get(function () {
  return this.maxUsage && this.usageCount >= this.maxUsage;
});

couponSchema.methods.isValid = function (orderAmount = 0, cartItems = []) {
  if (!this.isActive) return { valid: false, reason: "Coupon is inactive" };
  if (this.isExpired) return { valid: false, reason: "Coupon has expired" };
  if (this.isUsageLimitReached)
    return { valid: false, reason: "Coupon usage limit reached" };
  if (orderAmount < this.minOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount is $${this.minOrderAmount}`,
    };
  }

  const now = new Date();
  if (this.validFrom && now < this.validFrom) {
    return { valid: false, reason: "Coupon is not yet valid" };
  }

  if (this.applicableCategories?.length > 0) {
    const hasApplicableItems = cartItems?.some((item) =>
      this.applicableCategories?.includes(item?.product?.category)
    );
    if (!hasApplicableItems) {
      return { valid: false, reason: "Coupon not applicable to cart items" };
    }
  }

  if (this.excludedProducts?.length > 0) {
    const hasExcludedItems = cartItems?.some((item) =>
      this.excludedProducts?.some(
        (excludedId) => excludedId?.toString() === item?.productId?.toString()
      )
    );
    if (hasExcludedItems) {
      return {
        valid: false,
        reason: "Coupon not applicable to some cart items",
      };
    }
  }

  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (
  orderAmount,
  cartItems = []
) {
  const validation = this.isValid(orderAmount, cartItems);
  if (!validation.valid) return 0;

  let discountAmount = (orderAmount * this.discount) / 100;

  if (this.maxDiscountAmount && discountAmount > this.maxDiscountAmount) {
    discountAmount = this.maxDiscountAmount;
  }

  return Math.round(discountAmount * 100) / 100;
};

couponSchema.statics.validateCoupon = async function (
  code,
  orderAmount,
  userId,
  cartItems = []
) {
  const coupon = await this.findOne({
    code: code?.toUpperCase(),
    isActive: true,
  });
  if (!coupon) throw new Error("Invalid coupon code");

  const validation = coupon.isValid(orderAmount, cartItems);
  if (!validation.valid) throw new Error(validation.reason);

  return coupon;
};

couponSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
