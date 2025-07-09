"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

type Result = {
  id: string;
  quiz: { title: string };
  score: number;
  totalQuestions: number;
  submittedAt: string;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Not logged in");

        const decoded: any = jwtDecode(token);
        const userId = decoded.sub;

        const res = await axios.get(`http://localhost:3000/results/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResults(res.data);
      } catch (err) {
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Quiz History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground">No quiz attempts found.</p>
      ) : (
        results.map((result, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>{result.quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Score:</strong> {result.score} / {result.totalQuestions}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(result.submittedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
