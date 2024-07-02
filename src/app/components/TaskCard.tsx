import { Task, User } from "@prisma/client";
import { useEffect, useState } from "react";

async function getUser(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error fetching user");
    }
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const [user, setUser] = useState<User | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error deleting task");
      }
      console.log("Task deleted successfully");
      onDelete(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    getUser(task.userId).then(setUser);
  }, [task.userId]);

  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
      <div className="font-bold text-lg">{task.title}</div>
      <div className="text-gray-600">{task.description}</div>
      <div className="text-sm text-gray-500 mt-2">
        Assigned to: {user ? user.name : "Not assigned"}
      </div>
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Delete
      </button>
    </div>
  );
}
