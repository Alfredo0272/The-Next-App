"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Project } from "@prisma/client";

const getProjects = async () => {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

export default function RegisterTaskForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const getSessionAsync = async () => {
    const session = await getSession();
    if (!session) {
      router.push("/auth/signin");
    }
    return session;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const session = await getSessionAsync();
      if (!session || !session.user) {
        throw new Error("User not authenticated");
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          userId: session.user.id,
          projectId: data.projectId,
          status: "PENDING",
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Error creating task:", res);
        setError("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center bg-amber-50">
      <form
        onSubmit={onSubmit}
        className="w-1/4 bg-white p-6 rounded-lg shadow-md"
      >
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
            {error}
          </p>
        )}

        <h1 className="text-slate-600 font-bold text-4xl mb-4">
          Create New Task
        </h1>

        <label htmlFor="title" className="text-slate-500 mb-2 block text-sm">
          Title:
        </label>
        <input
          type="text"
          {...register("title", {
            required: true,
          })}
          aria-invalid={errors.title ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-200 text-slate-700 w-full"
          placeholder="Title of your project"
        />
        {errors.title?.type === "required" && (
          <p role="alert" className="text-red-500 text-xs">
            Title is required
          </p>
        )}

        <label
          htmlFor="projectId"
          className="text-slate-500 mb-2 block text-sm"
        >
          Project to assign:
        </label>
        <select
          {...register("projectId", {
            required: true,
          })}
          aria-invalid={errors.projectId ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-200 text-slate-700 w-full"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {errors.projectId?.type === "required" && (
          <p role="alert" className="text-red-500 text-xs">
            Project is required
          </p>
        )}

        <label
          htmlFor="description"
          className="text-slate-500 mb-2 block text-sm"
        >
          Description:
        </label>
        <input
          type="text"
          {...register("description", {
            required: true,
          })}
          aria-invalid={errors.description ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-200 text-slate-700 w-full"
          placeholder="Add a description of your project"
        />
        {errors.description?.type === "required" && (
          <p role="alert" className="text-red-500 text-xs">
            Description is required
          </p>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Create
        </button>
      </form>
    </div>
  );
}
