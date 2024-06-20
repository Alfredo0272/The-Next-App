import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await db.user.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!user) {
      return Error("User not found");
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return Error("An unexpected error occurred while fetching user.");
  }
}
