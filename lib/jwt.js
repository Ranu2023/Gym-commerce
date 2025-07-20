import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function generateToken(user) {
  return jwt.sign(
    {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      role: user?.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export function getAuthUser(request) {
  const token = request?.headers?.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export function requireAuth(request) {
  const user = getAuthUser(request)

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}

export function requireRole(request, allowedRoles = []) {
  const user = requireAuth(request)

  if (!allowedRoles?.includes(user?.role)) {
    throw new Error("Insufficient permissions")
  }

  return user
}
