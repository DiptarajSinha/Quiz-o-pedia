"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

type Question = {
  id: string;
  text: string;
  options: string[];
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

type Answer = {
  questionId: string;
  selectedOption: string;
};

export default function QuizAttemptPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/quizzes/${id}`);
        setQuiz(res.data);
      } catch {
        toast.error("Failed to load quiz");
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOption } : a
        );
      } else {
        return [...prev, { questionId, selectedOption }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/quizzes/${id}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  const handleDownloadPdf = () => {
    const jsPDF = require("jspdf");
    require("jspdf-autotable");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Quiz Title: ${quiz?.title}`, 14, 32);
    doc.text(`Score: ${result.score} / ${result.totalQuestions}`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 48);

    const tableData = result.feedback.map((f: any, index: number) => [
      index + 1,
      f.question,
      f.selected || "-",
      f.correct,
      f.isCorrect ? "✅" : "❌",
    ]);

    (doc as any).autoTable({
      head: [["#", "Question", "Your Answer", "Correct Answer", "Status"]],
      body: tableData,
      startY: 60,
      styles: { fontSize: 10, cellWidth: "wrap" },
      headStyles: { fillColor: [100, 100, 255] },
    });

    doc.save("quiz-report.pdf");
  };

  const handleChat = async () => {
    if (!result?.feedback || !quiz || !Array.isArray(result.feedback)) {
      toast.error("Missing feedback or quiz data");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/chatbot/respond",
        {
          userMessage: chatInput,
          quiz,
          feedback: result.feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatReply(res.data.reply);
    } catch (err) {
      toast.error("Failed to get AI response");
      console.error(err);
    }
  };

  if (!quiz) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <p className="text-muted-foreground">{quiz.description}</p>
        </CardHeader>
        <CardContent>
          {quiz.questions.map((q, index) => (
            <div key={q.id} className="mb-6">
              <p className="font-medium">
                {index + 1}. {q.text}
              </p>
              <div className="space-y-2 mt-2">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                      disabled={submitted}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!submitted && (
            <Button onClick={handleSubmit} className="mt-4">
              Submit Quiz
            </Button>
          )}

          {submitted && result && (
            <>
              <div className="mt-6 p-4 border rounded-md bg-green-50">
                <h2 className="text-lg font-semibold mb-2">
                  ✅ You scored {result.score} / {result.totalQuestions}
                </h2>
                <ul className="list-disc ml-6">
                  {result.feedback.map((f: any, idx: number) => (
                    <li key={idx} className="mb-1">
                      <span className="font-medium">{f.question}</span> —{" "}
                      {f.isCorrect ? (
                        <span className="text-green-600">Correct</span>
                      ) : (
                        <>
                          <span className="text-red-600">Wrong</span>, you chose{" "}
                          <strong>{f.selected}</strong>, correct is{" "}
                          <strong>{f.correct}</strong>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 mt-4 flex-wrap">
                  <Button onClick={handleDownloadPdf}>Download Report as PDF</Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/user")}
                  >
                    🔙 Back to Dashboard
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold mb-2">Ask the AI Assistant</h2>
                <Input
                  type="text"
                  placeholder="Ask something like 'Explain Q2'"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleChat} disabled={!chatInput.trim()}>
                  Ask
                </Button>

                {chatReply && (
                  <div className="mt-4 p-3 border rounded-md bg-muted">
                    <p>{chatReply}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
