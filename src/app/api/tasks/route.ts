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

const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch("../api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const tasks: Task[] = data.map((task: any) => ({
      ...task,
      status: task.status as Status,
    }));
    return tasks;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};
