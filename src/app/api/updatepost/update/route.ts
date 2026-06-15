import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        authToken,
        process.env.JWT_SECRET as string
      );
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      postId,
      title,
      status,
      publishDate,
      categories,
      content,
      featuredImage,
      visibility,
      postType,
    } = body;

    // POST ID VALIDATION
    if (
      validator.isEmpty(postId || "") ||
      !ObjectId.isValid(postId)
    ) {
      return NextResponse.json(
        { message: "Valid post id is required" },
        { status: 400 }
      );
    }

    // TITLE VALIDATION
    if (validator.isEmpty(title || "")) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
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
          message: "Valid status is required",
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

    // FEATURED IMAGE VALIDATION
    // if (featuredImage) {
    //   if (
    //     typeof featuredImage !==
    //       "object" ||
    //     !featuredImage.link
    //   ) {
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Featured image must contain image link",
    //       },
    //       {
    //         status: 400,
    //       }
    //     );
    //   }

    //   if (
    //     !validator.isURL(
    //       featuredImage.link || ""
    //     )
    //   ) {
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Featured image link is invalid",
    //       },
    //       {
    //         status: 400,
    //       }
    //     );
    //   }
    // }

    const client =
      await clientPromise;
    const db = client.db();

    // CHECK POST EXISTS
    const existingPost =
      await db
        .collection("posts")
        .findOne({
          _id: new ObjectId(postId),
        });

    if (!existingPost) {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK CATEGORY EXISTS
    const validCategoryIds =
      [];

    for (const categoryId of categories || []) {
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
      const slugPost =
        await db
          .collection("posts")
          .findOne({
            slug: finalSlug,
            _id: {
              $ne: new ObjectId(
                postId
              ),
            },
          });

      if (!slugPost) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // UPDATE POST
    await db
      .collection("posts")
      .updateOne(
        {
          _id: new ObjectId(postId),
        },
        {
          $set: {
            title,
            slug: finalSlug,
            status,
            publishDate,
            categories:
              validCategoryIds,
            content:
              content || "",
            featuredImage:
              featuredImage || {
                link: "",
                alt: "",
              },
            visibility:
              visibility ||
              "Public",
            postType:
              postType ||
              "Post",
            updatedAt:
              new Date(),
            author: decoded,
          },
        }
      );

    return NextResponse.json(
      {
        message:
          "Post updated successfully",
        postId,
        slug: finalSlug,
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