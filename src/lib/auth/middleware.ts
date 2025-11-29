// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET!;

// export function withAuth(handler: any) {
//   return async (req: NextRequest) => {
//     try {
//       // ✅ Always read token from httpOnly cookie
//       const token = req.cookies.get("token")?.value;

//       if (!token) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }

//       // 🔐 Verify JWT
//       const decoded = jwt.verify(token, JWT_SECRET);
//       (req as any).user = decoded;

//       return handler(req);

//     } catch (error) {
//       console.error("Auth error:", error);
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }
//   };
// }

// src/lib/auth/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function withAuth(handler: any) {
  return async (req: NextRequest, context?: any) => {  // ✅ Added context parameter
    try {
      // ✅ Always read token from httpOnly cookie
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // 🔐 Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;

      // ✅ Pass both req AND context to handler (context contains params)
      return handler(req, context);

    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}