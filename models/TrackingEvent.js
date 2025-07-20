import mongoose from "mongoose"

const trackingEventSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["order_placed", "payment_confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
        message: "Invalid tracking status",
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      courierName: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      deliveryAgent: {
        name: String,
        phone: String,
      },
      notes: String,
    },
  },
  {
    timestamps: true,
  },
)

trackingEventSchema.index({ orderId: 1, timestamp: -1 })
trackingEventSchema.index({ status: 1 })

trackingEventSchema.statics.addTrackingEvent = async function (orderId, status, title, description = "", location = "", metadata = {}) {
  const event = new this({
    orderId,
    status,
    title,
    description,
    location,
    metadata,
    timestamp: new Date(),
  })

  return await event.save()
}

trackingEventSchema.statics.getOrderTracking = async function (orderId) {
  return await this.find({ orderId, isActive: true }).sort({ timestamp: -1 })
}

trackingEventSchema.statics.getLatestStatus = async function (orderId) {
  const latestEvent = await this.findOne({ orderId, isActive: true }).sort({ timestamp: -1 })
  return latestEvent?.status || "unknown"
}

export default mongoose.models.TrackingEvent || mongoose.model("TrackingEvent", trackingEventSchema)
