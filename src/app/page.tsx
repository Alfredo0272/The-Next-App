"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
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
    <div>
      {session ? (
        <>
          {console.log(session)}
          <h1 className="text-3xl text-red-500 font-bold">Welcome back</h1>
          <button onClick={handleSignOut} className="border-black rounded-lg">
            Sign Out
          </button>
          <button
            onClick={handleCreateTask}
            className="border-black rounded-lg"
          >
            Create task
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-red-500 font-bold">
            You are not logged in
          </h1>
          <button className="border-black rounded-lg">
            <Link href={"/auth/login"}>Sign In</Link>
          </button>
        </>
      )}
    </div>
  );
}
