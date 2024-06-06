import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await fetch("../api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          surname: data.surname,
          age: data.age,
          email: data.email,
          password: data.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await res.json();
        console.error("API call failed:", errorData);
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        <h1 className="text-slate-500 font-bold text-4xl mb-4">Register</h1>

        <label htmlFor="name" className="text-slate-500 mb-2 block text-sm">
          User Name:
        </label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "User name is required",
            minLength: {
              value: 3,
              message: "User name must be at least 3 characters",
            },
          })}
          aria-invalid={errors.name ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your user name"
        />
        {errors.name && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.name.message)}
          </p>
        )}

        <label htmlFor="surname" className="text-slate-500 mb-2 block text-sm">
          Surname:
        </label>
        <input
          type="text"
          id="surname"
          {...register("surname", {
            required: "Surname is required",
            minLength: {
              value: 3,
              message: "Surname must be at least 3 characters",
            },
          })}
          aria-invalid={errors.surname ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your surname"
        />
        {errors.surname && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.surname.message)}
          </p>
        )}

        <label htmlFor="age" className="text-slate-500 mb-2 block text-sm">
          Age:
        </label>
        <input
          type="number"
          id="age"
          {...register("age", {
            required: "Age is required",
            min: {
              value: 18,
              message: "You must be at least 18 years old",
            },
            max: {
              value: 99,
              message: "You must be under 99 years old",
            },
          })}
          aria-invalid={errors.age ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your age"
        />
        {errors.age && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.age.message)}
          </p>
        )}

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Enter a valid email address",
            },
          })}
          aria-invalid={errors.email ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Your email"
        />
        {errors.email && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.email.message)}
          </p>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              message:
                "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, and one number",
            },
          })}
          aria-invalid={errors.password ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.password.message)}
          </p>
        )}

        <label
          htmlFor="confirmPassword"
          className="text-slate-500 mb-2 block text-sm"
        >
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="Enter your password again"
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-red-500 text-xs" aria-live="polite">
            {String(errors.confirmPassword.message)}
          </p>
        )}

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg mt-2 hover:shadow-md">
          Register
        </button>
      </form>
    </div>
  );
}
