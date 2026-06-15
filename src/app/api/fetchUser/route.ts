import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mogodb"; // adjust path

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & {
      userId: string;
      email: string;
    };

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne(
      {
        _id: new ObjectId(decoded.userId),
      },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Authenticated",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      { status: 500 }
    );
  }
}