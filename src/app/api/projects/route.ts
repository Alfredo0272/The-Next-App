import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.title || !data.description) {
      return NextResponse.json(
        { message: "Missing title or description" },
        { status: 400 }
      );
    }

    const newProyect = await db.project.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
    return NextResponse.json(newProyect, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await db.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching projects." },
      { status: 500 }
    );
  }
}
