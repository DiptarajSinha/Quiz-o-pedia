"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Registration failed");

      setResponse("✅ Registered successfully! Please login.");
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push("/login"); // Redirect after a brief delay
      }, 2000); // Delay for 2 seconds to allow the user to see the success message

    } catch (error: any) {
      setResponse(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold mb-2 text-primary">
            Welcome to Quiz-o-pedia
          </h1>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <select
                {...register("role", { required: true })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">Role is required</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>

            {response && (
              <p className="text-center text-sm mt-2">{response}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
