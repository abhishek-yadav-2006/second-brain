import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwt_password } from "./config";
import { CustomRequest } from "./types";

export const userMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");
  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, jwt_password) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
