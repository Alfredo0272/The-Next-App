"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const handleCreateProject = () => {
    router.push("/projects");
  };

  const handleCreateTask = () => {
    router.push("/tasks");
  };

  const handleAddUserToProyect = () => {
    router.push("/proyects/assingUserToProyect");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-slate-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <h1 className="text-3xl text-red-400 font-bold">
          {session
            ? `Welcome back ${session?.user.name}`
            : "You are not logged in"}
        </h1>
      </div>
      <div>
        {session ? (
          <>
            {console.log(session)}
            <button
              onClick={handleSignOut}
              className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Sign Out
            </button>
            <button
              onClick={handleCreateProject}
              className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Create Proyect
            </button>
            <button
              onClick={handleCreateTask}
              className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Create Task
            </button>
            <button
              onClick={handleAddUserToProyect}
              className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Add Users
            </button>{" "}
            <button
              onClick={handleBack}
              className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Go Back
            </button>{" "}
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="mt-4 lg:mt-0 bg-blue-500 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
