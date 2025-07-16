import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sdfsdg345";

export const comparePasswords = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const createToken = (payload) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required for token creation");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "60h" });
};

export const verifyToken = (token) => {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is required for token verification");
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid token" });
  }

  req.user = decoded;
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
