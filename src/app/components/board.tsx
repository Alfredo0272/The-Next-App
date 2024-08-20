"use client";

import { Task, Status, Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const getProjects = async (): Promise<Project[]> => {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data;
};

const getTasks = async (projectId: string): Promise<Task[]> => {
  const response = await fetch(`/api/tasks?projectId=${projectId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data;
};

export default function Board() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      getProjects().then((projects) => setProjects(projects));
    }
  }, [status]);

  useEffect(() => {
    if (selectedProject) {
      getTasks(selectedProject).then((tasks) => setTasks(tasks));
    }
  }, [selectedProject]);

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

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
      <div className="flex items-center justify-between flex-wrap bg-slate-500 p-6 m-2">
        <h1 className="text-3xl text-red-400 font-bold flex items-center">
          Sign in to view this page
        </h1>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-between flex-wrap bg-slate-500 p-6 m-2">
        <h1 className="text-3xl text-red-400 font-bold flex items-center">
          Hola {session?.user?.name}, no se encontraron proyectos
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedProject || ""}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="" disabled>
            Selecciona un proyecto
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex">
            {columns.map((column) => (
              <Droppable key={column} droppableId={column}>
                {(provided) => (
                  <div
                    className="flex-col m-2 bg-gray-100 p-4 rounded-lg w-1/3"
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
                              <TaskCard
                                task={task}
                                onDelete={handleDeleteTask}
                              />
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
      )}
    </div>
  );
}
