"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Quiz-o-pedia</h1>
      <p className="text-lg mb-6 text-muted-foreground">Register yourself to continue</p>

      <div className="flex space-x-4">
        <Button onClick={() => router.push("/register?role=admin")} variant="default">
          I am an Admin
        </Button>
        <Button onClick={() => router.push("/register?role=user")} variant="default">
          I am a User
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-blue-600 underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </main>
  );
}
