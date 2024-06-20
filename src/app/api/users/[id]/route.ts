import db from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(id: string) {
  try {
    const users = await db.user.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching user." },
      { status: 500 }
    );
  }
}
