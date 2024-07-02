import db from "@/app/lib/prisma";
import { Status, Task } from "@prisma/client";
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

    const newTask = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
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
    const tasks = await db.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error getting tasks:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
