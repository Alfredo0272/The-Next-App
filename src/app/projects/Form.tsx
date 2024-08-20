import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function RegisterProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    if (data.title && data.description) {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Error creating project:", res);
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
          Create New Project
        </h1>

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
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

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
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
