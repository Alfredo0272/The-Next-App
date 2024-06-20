"use client";

import { Task, Status } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

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

export default function Board() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const sourceList = tasks.filter(
      (task) => task.status === source.droppableId
    );
    const destList = tasks.filter(
      (task) => task.status === destination.droppableId
    );

    const [removed] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, removed);

    const newTasks = tasks.map((task) => {
      if (task.id === removed.id) {
        return { ...task, status: destination.droppableId as Status };
      }
      return task;
    });

    setTasks(newTasks);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        You are not logged in
      </div>
    );
  }

  const statuses: Status[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row justify-between p-4 space-x-4">
        {statuses.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-4">{status}</h2>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
