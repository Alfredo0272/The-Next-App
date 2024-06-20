import db from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const task = await db.task.delete({
      where: { id: id },
    });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while deleting task." },
      { status: 500 }
    );
  }
}
