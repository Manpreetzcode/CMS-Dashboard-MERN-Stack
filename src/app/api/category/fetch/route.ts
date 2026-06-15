import clientPromise from "@/app/lib/mogodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // DATABASE
    const client = await clientPromise;
    const db = client.db();

    // FETCH ALL CATEGORIES
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // CALCULATE POST COUNT FOR EACH CATEGORY
    const categoriesWithPostCount =
      await Promise.all(
        categories.map(async (category) => {
          return {
            categoryId: category._id,
            categoryName:
              category.categoryName,
            categorySlug: category.slug,
          };
        })
      );

    return NextResponse.json(
      {
        message:
          "Categories fetched successfully",
        categories:
          categoriesWithPostCount,
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