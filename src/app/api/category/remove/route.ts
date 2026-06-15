import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
           const authHeader = cookieStore.get("authToken")?.value;
        if (
          !authHeader
        ) {
          return NextResponse.json(
            {
              message: "Unauthorized",
            },
            {
              status: 401,
            }
          );
        }
    const token = authHeader;

    // VERIFY TOKEN
    try {
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    // BODY DATA
    const body = await req.json();

    const { categoryId } = body;

    // VALIDATE CATEGORY ID
    if (
      !categoryId ||
      !ObjectId.isValid(categoryId)
    ) {
      return NextResponse.json(
        {
          message:
            "Valid category id is required",
        },
        {
          status: 400,
        }
      );
    }

    // DATABASE
    const client =
      await clientPromise;
    const db = client.db();

    // CHECK CATEGORY EXISTS
    const existingCategory =
      await db
        .collection("categories")
        .findOne({
          _id: new ObjectId(
            categoryId
          ),
        });

    if (!existingCategory) {
      return NextResponse.json(
        {
          message:
            "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK CATEGORY USED IN POSTS
    const usedInPost =
      await db
        .collection("posts")
        .findOne({
          categories:
            new ObjectId(categoryId),
        });

    if (usedInPost) {
      return NextResponse.json(
        {
          message:
            "Category is used in posts and cannot be deleted",
        },
        {
          status: 400,
        }
      );
    }

    // DELETE CATEGORY
    await db
      .collection("categories")
      .deleteOne({
        _id: new ObjectId(
          categoryId
        ),
      });

    return NextResponse.json(
      {
        message:
          "Category deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

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