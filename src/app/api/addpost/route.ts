import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
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
      title,
      status,
      publishDate,
      categories,
      content,
      featuredImage,
      visibility,
      postType,
    } = body;

    // TITLE VALIDATION
    if (
      validator.isEmpty(title || "")
    ) {
      return NextResponse.json(
        {
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    // STATUS VALIDATION
    const allowedStatus = [
      "Published",
      "Draft",
    ];

    if (
      validator.isEmpty(status || "") ||
      !allowedStatus.includes(status)
    ) {
      return NextResponse.json(
        {
          message:
            "Valid status is required",
        },
        {
          status: 400,
        }
      );
    }

    // PUBLISH DATE VALIDATION
    if (
      validator.isEmpty(
        publishDate || ""
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Publish date is required",
        },
        {
          status: 400,
        }
      );
    }

    // POST TYPE VALIDATION
    const allowedPostTypes = [
      "Post",
      "Page",
    ];

    if (
      postType &&
      !allowedPostTypes.includes(
        postType
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid post type",
        },
        {
          status: 400,
        }
      );
    }

    // VISIBILITY VALIDATION
    const allowedVisibility = [
      "Public",
      "Private",
    ];

    if (
      visibility &&
      !allowedVisibility.includes(
        visibility
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid visibility",
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
    const validCategoryIds = [];

    for (const categoryId of categories) {
      if (
        !ObjectId.isValid(categoryId)
      ) {
        return NextResponse.json(
          {
            message:
              "Invalid category id",
          },
          {
            status: 400,
          }
        );
      }

      const category =
        await db
          .collection("categories")
          .findOne({
            _id: new ObjectId(
              categoryId
            ),
          });

      if (!category) {
        return NextResponse.json(
          {
            message:
              "Category not found",
          },
          {
            status: 400,
          }
        );
      }

      validCategoryIds.push(
        new ObjectId(categoryId)
      );
    }

    // GENERATE SLUG
    let slug = title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // UNIQUE SLUG
    let finalSlug = slug;
    let counter = 2;

    while (true) {
      const existingPost =
        await db
          .collection("posts")
          .findOne({
            slug: finalSlug,
          });

      if (!existingPost) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // CREATE POST
    const newPost = {
      title,
      slug: finalSlug,
      status,
      publishDate,
      categories:
        validCategoryIds,
      content: content || "",
      featuredImage:
        featuredImage || {
          link: "",
          alt: "",
        },
      visibility:
        visibility || "Public",
      postType:
        postType || "Post",
      createdAt: new Date(),
      updatedAt: new Date(),
      author: decoded,
    };

    const result = await db
      .collection("posts")
      .insertOne(newPost);

    return NextResponse.json(
      {
        message:
          "Post created successfully",
        postId:
          result.insertedId,
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