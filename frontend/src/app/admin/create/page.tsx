"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Question = {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
};

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", ""],
      correctAnswerIndex: 0,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", ""],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      tags: tags.split(",").map((tag) => tag.trim()),
      questions,
    };

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("✅ Quiz created successfully!");
      setTitle("");
      setTags("");
      setQuestions([
        {
          questionText: "",
          options: ["", ""],
          correctAnswerIndex: 0,
        },
      ]);
      router.push("/admin/dashboard");
    } else {
      const json = await res.json();
      toast.error(`❌ Failed to create quiz: ${json.message || "Unknown error"}`);
    }
  };

  return (
    <ProtectedRoute role="admin">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create Quiz Manually</h1>

        <Input
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {questions.map((q, idx) => (
          <Card key={idx}>
            <CardContent className="space-y-2 mt-4">
              <Input
                placeholder={`Question ${idx + 1}`}
                value={q.questionText}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[idx].questionText = e.target.value;
                  setQuestions(updated);
                }}
              />

              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                  />
                  <input
                    type="radio"
                    checked={q.correctAnswerIndex === optIdx}
                    onChange={() => {
                      const updated = [...questions];
                      updated[idx].correctAnswerIndex = optIdx;
                      setQuestions(updated);
                    }}
                  />
                  <label>Correct</label>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => {
                  const updated = [...questions];
                  updated[idx].options.push("");
                  setQuestions(updated);
                }}
              >
                ➕ Add Option
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={handleAddQuestion}>
          ➕ Add Question
        </Button>

        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700"
        >
          ✅ Submit Quiz
        </Button>
      </div>
    </ProtectedRoute>
  );
}
