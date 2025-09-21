import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes with JWT authentication
 */
export default function authMiddleware(req, res, next) {
  // Expected format: "Authorization: Bearer <token>"
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store { id: "..." } in request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
