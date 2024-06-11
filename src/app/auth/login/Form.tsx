"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res && res.ok) {
      router.push("/");
    } else {
      Error("Invalid credentials");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
            {error}
          </p>
        )}

        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <input
          type="text"
          {...register("email", {
            required: true,
          })}
          aria-invalid={errors.email ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your email"
        />

        {errors.email?.type === "required" && (
          <p role="alert" className="text-red-500 text-xs">
            Email is required
          </p>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: true,
          })}
          aria-invalid={errors.password ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="********"
        />

        {errors.password?.type === "required" && (
          <p role="alert" className="text-red-500 text-xs">
            Password is required
          </p>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Login
        </button>
        <Link
          className="text-slate-500 mt-2 block text-sm text-center"
          href={"/auth/register"}
        >
          Don´t have an account?
        </Link>
      </form>
    </div>
  );
}
export default LoginPage;
