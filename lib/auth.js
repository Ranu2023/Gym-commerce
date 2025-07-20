import { verifyToken, getAuthUser, requireAuth, requireRole } from "./jwt.js"

export function getTokenFromRequest(request) {
  try {
    const authHeader = request?.headers?.get("authorization")
    if (!authHeader) {
      return null
    }

    const token = authHeader?.startsWith("Bearer ") ? authHeader?.slice(7) : authHeader

    return token || null
  } catch (error) {
    console.error("Error extracting token from request:", error)
    return null
  }
}

export async function authenticateUser(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      throw new Error("Authentication token required")
    }

    const decoded = verifyToken(token)
    if (!decoded?.id) {
      throw new Error("Invalid token payload")
    }

    return decoded
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

// Re-export all functions from jwt.js
export { verifyToken, getAuthUser, requireAuth, requireRole }
