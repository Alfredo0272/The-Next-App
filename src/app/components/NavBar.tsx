"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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

  const handleCreateTask = () => {
    router.push("/tasks/create");
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <h1 className="text-3xl text-red-500 font-bold">
          {session ? "Welcome back" : "You are not logged in"}
        </h1>
      </div>
      <div>
        {session ? (
          <>
            {console.log(session)}
            <button
              onClick={handleSignOut}
              className="mt-4 lg:mt-0 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Sign Out
            </button>
            <button
              onClick={handleCreateTask}
              className="mt-4 lg:mt-0 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
            >
              Create Task
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="mt-4 lg:mt-0 text-teal-200 hover:text-white mr-4 border-black rounded-lg px-4 py-2"
          >
            <Link href="/auth/login">Sign In</Link>
          </button>
        )}
      </div>
    </nav>
  );
}
