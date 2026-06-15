import clientPromise from "@/app/lib/mogodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // VALIDATION
    if (!validator.isEmail(email || "")) {
      return NextResponse.json(
        {
          message: "Valid email is required",

        },
        {
          status: 400,
        }
      );
    }

    if (validator.isEmpty(password || "")) {
      return NextResponse.json(
        {
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }

    // DB CONNECTION
    const client = await clientPromise;
    const db = client.db();

    // FIND USER
    const user = await db
      .collection("users")
      .findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    // COMPARE PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // RESPONSE
    const response = NextResponse.json(
      {
        message: "Login successful",
        authToken: token,
      },
      {
        status: 200,
      }
    );

    // SET SECURE COOKIE
    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;

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