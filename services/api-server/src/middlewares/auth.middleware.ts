import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

const ProtectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { userId,email  } = payload;
    req.user = { userId, email };

    console.log(`Authenticated User: ${email}, ID: ${userId}, `);

    next();
  } catch (error:any) {
    console.log("ProtectedRoute Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
    



export { ProtectedRoute };