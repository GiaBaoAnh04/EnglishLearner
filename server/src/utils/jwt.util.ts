import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret_key";

export interface JWTPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

export const generateToken = (payload: JWTPayload): string => {
  // Kiểm tra và đảm bảo payload là object hợp lệ
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a valid object");
  }

  const options: SignOptions = {
    expiresIn: "7d", // Hard-code string thay vì dùng env variable
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
