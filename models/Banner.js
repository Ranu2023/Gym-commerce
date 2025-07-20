import mongoose from "mongoose"

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, "Subtitle cannot exceed 200 characters"],
    },
    image: {
      type: String,
      required: [true, "Banner image is required"],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [50, "Button text cannot exceed 50 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    targetAudience: {
      type: String,
      enum: ["all", "new-users", "returning-users", "premium-users"],
      default: "all",
    },
    clickCount: {
      type: Number,
      default: 0,
      min: [0, "Click count cannot be negative"],
    },
    impressionCount: {
      type: Number,
      default: 0,
      min: [0, "Impression count cannot be negative"],
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

bannerSchema.index({ isActive: 1, displayOrder: 1 })
bannerSchema.index({ startDate: 1, endDate: 1 })

bannerSchema.virtual("isExpired").get(function () {
  return this.endDate && new Date() > this.endDate
})

bannerSchema.virtual("isScheduled").get(function () {
  return this.startDate && new Date() < this.startDate
})

bannerSchema.virtual("clickThroughRate").get(function () {
  return this.impressionCount > 0 ? (this.clickCount / this.impressionCount) * 100 : 0
})

bannerSchema.methods.incrementClicks = function () {
  this.clickCount += 1
  return this.save()
}

bannerSchema.methods.incrementImpressions = function () {
  this.impressionCount += 1
  return this.save()
}

bannerSchema.statics.findActiveBanners = function (targetAudience = "all") {
  const now = new Date()
  return this.find({
    isActive: true,
    $or: [{ startDate: { $lte: now } }, { startDate: null }],
    $or: [{ endDate: { $gte: now } }, { endDate: null }],
    $or: [{ targetAudience }, { targetAudience: "all" }],
  }).sort({ displayOrder: 1, createdAt: -1 })
}

bannerSchema.statics.getBannerStats = async function (dateRange = {}) {
  const matchStage = {}
  if (dateRange.from || dateRange.to) {
    matchStage.createdAt = {}
    if (dateRange.from) matchStage.createdAt.$gte = new Date(dateRange.from)
    if (dateRange.to) matchStage.createdAt.$lte = new Date(dateRange.to)
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalBanners: { $sum: 1 },
        activeBanners: { $sum: { $cond: ["$isActive", 1, 0] } },
        totalClicks: { $sum: "$clickCount" },
        totalImpressions: { $sum: "$impressionCount" },
        averageCTR: { $avg: { $cond: [{ $gt: ["$impressionCount", 0] }, { $multiply: [{ $divide: ["$clickCount", "$impressionCount"] }, 100] }, 0] } },
      },
    },
  ])

  return stats[0] || {
    totalBanners: 0,
    activeBanners: 0,
    totalClicks: 0,
    totalImpressions: 0,
    averageCTR: 0,
  }
}

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema)
