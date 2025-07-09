// ✅ app/leaderboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Quiz = {
  id: string;
  title: string;
  description: string;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuizzes(res.data))
      .catch(() => toast.error("Failed to load quizzes"));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Select Quiz to View Leaderboard</h1>
      {quizzes.length === 0 ? (
        <p className="text-muted-foreground">No quizzes available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/leaderboard/${quiz.id}`)}
            >
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {quiz.description}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
