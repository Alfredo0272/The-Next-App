import db from "@/app/lib/prisma";
import { HttpError } from "@/types/http.errors";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.email || !data.name || !data.password || !data.age) {
      throw new HttpError(
        400,
        "Email, username, password, and age are required."
      );
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new HttpError(400, "User already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        age: data.age,
      },
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message });
    }

    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
