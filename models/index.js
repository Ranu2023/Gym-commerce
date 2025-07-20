// Import all models to ensure they are registered
import User from "./User.js"
import Product from "./Product.js"
import Cart from "./Cart.js"
import Coupon from "./Coupon.js"
import Order from "./Order.js"
import Banner from "./Banner.js"
import TrackingEvent from "./TrackingEvent.js"

export { User, Product, Cart, Coupon, Order, Banner, TrackingEvent }

// Export a function to initialize all models
export const initializeModels = () => {
  return {
    User,
    Product,
    Cart,
    Coupon,
    Order,
    Banner,
    TrackingEvent,
  }
}
