"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Quiz = {
  id: string;
  title: string;
  description: string;
};

type Result = {
  id: string;
  score: number;
  submittedAt: string;
  quiz: {
    id: string;
    title: string;
  };
};

export default function UserDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    setUserEmail(decoded.email);

    fetchQuizzes(token);
    fetchResults(token);
  }, []);

  const fetchQuizzes = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:3000/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);
    } catch (err) {
      toast.error("Failed to fetch quizzes");
    }
  };

  const fetchResults = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:3000/results/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResults(res.data.slice(0, 3));
      const attempted = res.data.map((r: Result) => r.quiz.id);
      setAttemptedQuizIds(attempted);
    } catch (err) {
      toast.error("Failed to fetch past results");
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    if (attemptedQuizIds.includes(quizId)) {
      toast.error("❌ You’ve already attempted this quiz. Please select another quiz.");
    } else {
      router.push(`/quiz/${quizId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <ProtectedRoute role="user">
      <div className="max-w-6xl mx-auto my-6 px-4 space-y-8">
        {/* ✅ Top Navigation Bar */}
        <div className="flex items-center justify-between py-4 border-b">
          <Button variant="ghost" onClick={() => router.push("/leaderboard")}>
            🏆 Leaderboards
          </Button>
          <h1 className="text-2xl font-bold">👤 Welcome, {userEmail}</h1>
          <Button variant="outline" onClick={handleLogout}>
            🔒 Logout
          </Button>
        </div>

        {/* Available Quizzes */}
        <section>
          <h2 className="text-xl font-semibold mb-2">📝 Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-muted-foreground">No quizzes available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">
                      {quiz.description}
                    </p>
                    <Button onClick={() => handleStartQuiz(quiz.id)}>
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Results */}
        <section>
          <h2 className="text-xl font-semibold mb-2">📚 Your Top 3 Results</h2>
          {results.length === 0 ? (
            <p className="text-muted-foreground">No quiz attempts yet.</p>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => router.push(`/quiz/${result.quiz.id}/report`)}
                className="cursor-pointer hover:shadow-lg transition rounded-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{result.quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">Score: {result.score}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted on{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
