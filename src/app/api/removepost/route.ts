import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest) {
  try {
    // GET TOKEN
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

    const { id } = body;

    // VALIDATION
    if (validator.isEmpty(id || "")) {
      return NextResponse.json(
        {
          message: "Post id is required",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK OBJECT ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid post id",
        },
        {
          status: 400,
        }
      );
    }

    // DATABASE
    const client = await clientPromise;
    const db = client.db();

    // DELETE POST
    const result = await db
      .collection("posts")
      .deleteOne({
        _id: new ObjectId(id),
      });

    // CHECK POST EXISTS
    if (result.deletedCount === 0) {
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
        message: "Post deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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