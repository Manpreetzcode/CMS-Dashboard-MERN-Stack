import clientPromise from "@/app/lib/mogodb";
import bcrypt from "bcryptjs";
import validator from "validator";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const { name, email, password } = body;

    // VALIDATION
    if (validator.isEmpty(name || "")) {
      return Response.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email || "")) {
      return Response.json(
        { message: "Valid email is required" },
        { status: 400 }
      );
    }

    if (validator.isEmpty(password || "")) {
      return Response.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    if (!validator.isLength(password, { min: 6 })) {
      return Response.json(
        {
          message:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db();

    // CHECK IF USER ALREADY EXISTS
    const existingAdmin = await db
      .collection("users")
      .findOne();

    if (existingAdmin) {
      return Response.json(
        {
          message: "Dashboard already installed",
        },
        {
          status: 403,
        }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });

    return Response.json(
      {
        message: "Admin created successfully",
        userId: result.insertedId,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    return Response.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}