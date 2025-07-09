"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Quiz = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);
    } catch (err) {
      toast.error("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto my-10 relative px-4">
      {/* Logout button - top right */}
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout}>
          🔒 Logout
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        <Button onClick={() => router.push("/admin/create")}>
          ➕ Create Quiz Manually
        </Button>
        <Button variant="secondary" onClick={() => router.push("/admin/ai")}>
          🤖 Generate with AI
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{quiz.description}</p>
                <p className="text-sm mt-2 text-gray-500">
                  Created At: {new Date(quiz.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
