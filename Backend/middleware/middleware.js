import jwt from "jsonwebtoken";
export default function checkauthuser(req, res, next) {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded; // ✅ attach user info
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}