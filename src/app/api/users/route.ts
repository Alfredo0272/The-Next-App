import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await db.user.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching projects." },
      { status: 500 }
    );
  }
}
