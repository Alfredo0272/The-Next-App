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
  const response = await fetch("/api/tasks");
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data;
};

export default function Board() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      getTasks().then((tasks) => setTasks(tasks));
    }
  }, [status]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as Status;
    const destinationStatus = result.destination.droppableId as Status;
    const taskId = result.draggableId;

    if (sourceStatus === destinationStatus) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: destinationStatus }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status: destinationStatus } : task
        );

        setTasks(updatedTasks);
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const columns = Object.values(Status);

  if (!session) {
    return (
      <div className="flex items-center justify-between flex-wrap bg-slate-500 p-6 m-2 ">
        <h1 className="text-3xl text-red-400 font-bold flex items-center">
          Sign in to view this page
        </h1>
      </div>
    );
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                className="column bg-gray-100 p-4 rounded-lg"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="column-title text-lg font-semibold mb-2">
                  {column}
                </h2>
                {tasks
                  .filter((task) => task.status === column)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} onDelete={handleDeleteTask} />
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
