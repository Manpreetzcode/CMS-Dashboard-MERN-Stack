import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import validator from "validator";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken =
      cookieStore.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    try {
      jwt.verify(
        authToken,
        process.env.JWT_SECRET as string
      );
    } catch {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();
    const { postId } = body;

    // VALIDATE POST ID
    if (
      validator.isEmpty(postId || "") ||
      !ObjectId.isValid(postId)
    ) {
      return NextResponse.json(
        {
          message:
            "Valid post id is required",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;
    const db = client.db();

    const post = await db
      .collection("posts")
      .findOne({
        _id: new ObjectId(postId),
      });

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Post fetched successfully",
        post,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}