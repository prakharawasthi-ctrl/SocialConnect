import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: any) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to request
      (req as any).user = decoded;

      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}
