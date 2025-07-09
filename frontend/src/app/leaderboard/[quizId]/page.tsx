"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

type Entry = {
  id: string;
  score: number;
  submittedAt: string;
  user: {
    email: string;
  };
};

export default function LeaderboardPage() {
  const { quizId } = useParams();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/leaderboard/${quizId}`);
        setEntries(res.data);
      } catch (err) {
        toast.error("Failed to load leaderboard");
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="max-w-2xl mx-auto my-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">No scores yet.</p>
          ) : (
            <table className="w-full border mt-4 text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className="border-b">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{entry.user.email}</td>
                    <td className="p-2">{entry.score}</td>
                    <td className="p-2">{new Date(entry.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
