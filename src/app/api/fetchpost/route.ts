import clientPromise from "@/app/lib/mogodb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // DB CONNECTION
    const client = await clientPromise;
    const db = client.db();

    // FETCH ONLY PUBLISHED POSTS
    const posts = await db
      .collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        message: "Posts fetched successfully",
        posts,
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