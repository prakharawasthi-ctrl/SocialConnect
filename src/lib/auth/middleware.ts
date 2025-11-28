import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: any) {
  return async (req: NextRequest) => {
    try {
      // 1️⃣ First try Authorization: Bearer
      const authHeader = req.headers.get("authorization");
      let token = null;

      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }

      // 2️⃣ Fallback to cookie
      if (!token) {
        token = req.cookies.get("token")?.value || null;
      }

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 4️⃣ Attach user to request
      (req as any).user = decoded;

      return handler(req);

    } catch (error) {
      console.error("Auth error:", error);

      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}
