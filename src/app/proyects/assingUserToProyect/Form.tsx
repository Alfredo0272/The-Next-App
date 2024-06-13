import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Proyect, User } from "@prisma/client";

export default function AssignUserToProject() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Proyect[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/proyects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        setError("Failed to load projects");
        console.error(error);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setError("Failed to load users");
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (data.projectId && data.userId) {
      const res = await fetch("/api/proyects/assignUserToProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "An unexpected error occurred");
        console.error("Error assigning user to project:", errorData);
      }
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
          Assign User To Project
        </h1>

        <label
          htmlFor="projectId"
          className="text-slate-500 mb-2 block text-sm"
        >
          Project:
        </label>
        <select
          {...register("projectId", { required: true })}
          className="p-3 rounded block mb-2 bg-slate-200 text-slate-700 w-full"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        {errors.projectId && (
          <p className="text-red-500 text-sm">Project ID is required</p>
        )}

        <label htmlFor="userId" className="text-slate-500 mb-2 block text-sm">
          User:
        </label>
        <select
          {...register("userId", { required: true })}
          className="p-3 rounded block mb-2 bg-slate-200 text-slate-700 w-full"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {user.surname}
            </option>
          ))}
        </select>

        {errors.userId?.type === "required" && (
          <p className="text-red-500 text-sm">User ID is required</p>
        )}

        <button
          type="submit"
          className="bg-amber-500 text-white p-3 rounded w-full mt-4"
        >
          Assign User To Project
        </button>
      </form>
    </div>
  );
}
