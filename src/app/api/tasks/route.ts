import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.title || !data.description || !data.userId) {
      return NextResponse.json(
        { message: "Missing title or description" },
        { status: 400 }
      );
    }

    const newTask = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        userId: data.userId,
        status: "PENDING",
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Missing projectId" },
        { status: 400 }
      );
    }

    const tasks = await db.task.findMany({
      where: {
        projectId: projectId,
      },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error getting tasks:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
