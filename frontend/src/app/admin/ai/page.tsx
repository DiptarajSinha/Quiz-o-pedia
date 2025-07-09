"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AIQuizPage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleGenerate = async () => {
    if (!topic || count <= 0 || !token) {
      toast.error("Please enter a valid topic and number of questions");
      return;
    }

    setLoading(true);
    setAiQuestions([]);
    try {
      const res = await fetch("http://localhost:3000/quizzes/generate-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, numQuestions: count }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiQuestions(data);
        toast.success("✅ AI Questions generated!");
      } else {
        toast.error(`❌ Failed to generate quiz: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      toast.error("❌ AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!topic || aiQuestions.length === 0 || !token) return;
    setSaving(true);

    const transformedQuestions = aiQuestions.map((q, idx) => {
      const correctAnswerNormalized = q.correctAnswer.trim().toLowerCase();
      const correctAnswerIndex = q.options.findIndex(
        (opt: string) => opt.trim().toLowerCase() === correctAnswerNormalized
      );

      if (correctAnswerIndex === -1) {
        console.warn(
          `⚠️ Question ${idx + 1}: Correct answer "${q.correctAnswer}" not found in options:`,
          q.options
        );
      }

      return {
        questionText: q.text,
        options: q.options,
        correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      };
    });

    try {
      const res = await fetch("http://localhost:3000/quizzes/confirm-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: topic,
          tags: [topic],
          questions: transformedQuestions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Quiz saved successfully! Redirecting to dashboard...");
        // Reset form
        setTopic("");
        setAiQuestions([]);
        setCount(5);

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 3000);
      } else {
        toast.error(`❌ Failed to save quiz: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      toast.error("❌ Saving quiz failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute role="admin">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">✨ AI-Assisted Quiz Generator</h1>

        <div className="space-y-2">
          <Input
            placeholder="Topic (e.g. React JS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Number of Questions"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
          />

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "✨ Generate Quiz"
            )}
          </Button>
        </div>

        {/* Quiz Preview */}
        {aiQuestions.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">📋 Preview Generated Questions</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerate}
                disabled={loading}
              >
                🔁 Retry AI
              </Button>
            </div>

            {aiQuestions.map((q, idx) => (
              <div key={idx} className="border rounded p-3 shadow-sm bg-white">
                <p className="font-medium">
                  {idx + 1}. {q.text}
                </p>
                <ul className="list-disc ml-5 mt-1 text-sm text-muted-foreground">
                  {q.options.map((opt: string, i: number) => (
                    <li key={i}>
                      {opt}{" "}
                      {opt.trim().toLowerCase() ===
                      q.correctAnswer.trim().toLowerCase()
                        ? "(Correct)"
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Button
              onClick={handleConfirmSave}
              className="bg-green-600 hover:bg-green-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "✅ Save to Quiz List"
              )}
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
