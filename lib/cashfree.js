import { Cashfree as CashfreeSDK } from "cashfree-pg"

// Initialize Cashfree
const cf = new CashfreeSDK({
  env: process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
})

// Set credentials
cf.XClientId = process.env.CASHFREE_APP_ID
cf.XClientSecret = process.env.CASHFREE_SECRET_KEY

// Export the SDK class for external use
export const Cashfree = CashfreeSDK

// Helper function to create payment order
export async function PGCreateOrder(orderData) {
  try {
    console.log("Creating Cashfree order with data:", orderData)

    const response = await cf.PGCreateOrder("2023-08-01", orderData)
    console.log("Cashfree order response:", response)

    return response?.data
  } catch (error) {
    console.error("Error creating Cashfree order:", error)
    throw error
  }
}

// Helper function to verify payment
export async function PGOrderFetchPayments(orderId) {
  try {
    console.log("Fetching payment for order:", orderId)

    const response = await cf.PGOrderFetchPayments("2023-08-01", orderId)
    console.log("Payment fetch response:", response)

    return response?.data
  } catch (error) {
    console.error("Error fetching payment:", error)
    throw error
  }
}

// Helper function to verify webhook signature
export function PGVerifyWebhookSignature(rawBody, signature, timestamp) {
  try {
    return cf.PGVerifyWebhookSignature(rawBody, signature, timestamp)
  } catch (error) {
    console.error("Error verifying webhook signature:", error)
    return false
  }
}

export default cf
