import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
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
    let decoded;

    try {
      decoded = jwt.verify(
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

    const {
      categoryName,
      categoryDescription,
      categorySlug,
    } = body;

    // CATEGORY NAME VALIDATION
    if (
      validator.isEmpty(categoryName || "")
    ) {
      return NextResponse.json(
        {
          message: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    // SLUG VALIDATION
    if (
      categorySlug &&
      validator.isEmpty(categorySlug)
    ) {
      return NextResponse.json(
        {
          message: "Category slug is invalid",
        },
        {
          status: 400,
        }
      );
    }

    // GENERATE SLUG
    let slugSource =
      categorySlug || categoryName;

    let slug = slugSource
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // spaces to -
      .replace(/-+/g, "-"); // multiple - to single -

    // DATABASE
    const client = await clientPromise;
    const db = client.db();

    // UNIQUE SLUG CHECK
    let finalSlug = slug;
    let counter = 2;

    while (true) {
      const existingCategory =
        await db
          .collection("categories")
          .findOne({
            slug: finalSlug,
          });

      if (!existingCategory) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // CREATE CATEGORY
    const newCategory = {
      categoryName,
      categoryDescription:
        categoryDescription || "",
      slug: finalSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: decoded,
    };

    const result = await db
      .collection("categories")
      .insertOne(newCategory);

    return NextResponse.json(
      {
        message:
          "Category created successfully",
        categoryId: result.insertedId,
        slug: finalSlug,
      },
      {
        status: 201,
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