import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [10, "Maximum quantity per item is 10"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"],
    },
    totalItems: {
      type: Number,
      default: 0,
      min: [0, "Total items cannot be negative"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

cartSchema.index({ userId: 1 })
cartSchema.index({ "items.productId": 1 })

cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0
  this.totalAmount = this.items?.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0) || 0
  this.lastUpdated = new Date()
  return this
}

cartSchema.methods.getSummary = function () {
  return {
    items: this.items || [],
    totalAmount: this.totalAmount || 0,
    totalItems: this.totalItems || 0,
    lastUpdated: this.lastUpdated,
  }
}

cartSchema.statics.addToCart = async function (userId, productId, quantity, price) {
  let cart = await this.findOne({ userId })

  if (!cart) {
    cart = new this({
      userId,
      items: [{ productId, quantity, price }],
    })
  } else {
    const existingItemIndex = cart.items?.findIndex((item) => item?.productId?.toString() === productId?.toString())

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
      cart.items[existingItemIndex].price = price
    } else {
      cart.items.push({ productId, quantity, price })
    }
  }

  cart.calculateTotals()
  return await cart.save()
}

cartSchema.statics.updateCartItem = async function (userId, productId, quantity) {
  const cart = await this.findOne({ userId })
  if (!cart) throw new Error("Cart not found")

  const itemIndex = cart.items?.findIndex((item) => item?.productId?.toString() === productId?.toString())
  if (itemIndex === -1) throw new Error("Item not found in cart")

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1)
  } else {
    cart.items[itemIndex].quantity = quantity
  }

  cart.calculateTotals()
  return await cart.save()
}

cartSchema.statics.removeFromCart = async function (userId, productId) {
  const cart = await this.findOne({ userId })
  if (!cart) throw new Error("Cart not found")

  cart.items = cart.items?.filter((item) => item?.productId?.toString() !== productId?.toString()) || []
  cart.calculateTotals()
  return await cart.save()
}

cartSchema.statics.clearCart = async function (userId) {
  return await this.findOneAndUpdate(
    { userId },
    {
      items: [],
      totalAmount: 0,
      totalItems: 0,
      lastUpdated: new Date(),
    },
    { new: true, upsert: true }
  )
}

cartSchema.pre("save", function (next) {
  this.calculateTotals()
  next()
})

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema)
