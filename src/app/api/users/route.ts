import clientPromise from "@/app/lib/mogodb";
import { NextResponse } from "next/server";

export async function POST() {
  try {

    const client = await clientPromise;
    const db = client.db("auxDashboard");

    // check first user
    const user = await db
      .collection("users")
      .findOne();

    // if user exists
    if (user) {
      return NextResponse.json(
        {
          installed: true,
          name:user.name,
          message: "User already exists",
        },
        {
          status: 200,
        }
      );
    }

    // no user found
    return NextResponse.json(
      {
        installed: false,
        message: "No user found",
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    return NextResponse.json(
      {
        error: "Database connection failed",
      },
      {
        status: 500,
      }
    );
  }
}