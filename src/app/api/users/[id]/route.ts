import db from "@/app/lib/prisma";

export default async function GET(id: string) {
  try {
    if (!id) {
      throw new Error("ID parameter is required.");
    }

    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return { message: "User not found" };
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return { message: "An unexpected error occurred while getting user." };
  }
}
