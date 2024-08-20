import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { projectId, userId } = data;

    if (!projectId || !userId) {
      return NextResponse.json(
        { message: "Missing projectId or userId" },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({ where: { id: projectId } });
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingAssignment = await db.projectToUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { message: "User already assigned to this project" },
        { status: 409 }
      );
    }

    const projectToUser = await db.projectToUser.create({
      data: {
        projectId,
        userId,
      },
    });

    return NextResponse.json(projectToUser, { status: 201 });
  } catch (error) {
    console.error("Error assigning user to project:", error);
    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while assigning user to project.",
      },
      { status: 500 }
    );
  }
}
