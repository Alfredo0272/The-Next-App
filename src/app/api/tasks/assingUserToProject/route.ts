import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { taskId, userId } = data;

    if (!taskId || !userId) {
      return NextResponse.json(
        { message: "Missing taskId or userId" },
        { status: 400 }
      );
    }

    const task = await db.task.findUnique({ where: { id: taskId } });
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedTask = await db.task.update({
      data: {
        userId,
      },
      where: { id: taskId },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error assigning user to task:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred while assigning user to task.",
      },
      { status: 500 }
    );
  }
}
