"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Feedback = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
  options: string[]; // ✅ New: include all options to display like Google Forms
};

type ResultData = {
  score: number;
  totalQuestions: number;
  submittedAt: string;
  feedback: Feedback[];
  quiz: {
    title: string;
    id: string;
    description?: string;
  };
};

export default function QuizReportPage() {
  const { id } = useParams(); // quiz ID
  const router = useRouter();

  const [result, setResult] = useState<ResultData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in");
      router.push("/login");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await axios.get("http://localhost:3000/results/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const match = res.data.find((r: any) => r.quiz.id.toString() === id);
        if (!match) {
          toast.error("You haven't attempted this quiz yet.");
          router.push("/user");
          return;
        }

        setResult(match);

        // ✅ Auto-analyze
        if (!match.feedback || !Array.isArray(match.feedback)) {
          toast.error("Invalid feedback data, cannot analyze");
          return;
        }

        const aiRes = await axios.post(
          "http://localhost:3000/chatbot/respond",
          {
            userMessage:
              "Give a short analysis of the mistakes and suggest improvements.",
            quiz: match.quiz,
            feedback: match.feedback,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAiAnalysis(aiRes.data.reply);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load result or analysis");
        console.error("AI Error:", err);
        }
    };

    fetchResult();
  }, [id, router]);

  const handleDownloadPdf = async () => {
    if (!result) return;

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Quiz: ${result.quiz.title}`, 14, 32);
    doc.text(`Score: ${result.score} / ${result.totalQuestions}`, 14, 40);
    doc.text(`Date: ${new Date(result.submittedAt).toLocaleString()}`, 14, 48);

    const tableData = result.feedback.map((f, index) => [
      index + 1,
      f.question,
      f.selected || "-",
      f.correct,
      f.isCorrect ? "✅" : "❌",
    ]);

    autoTable(doc, {
      head: [["#", "Question", "Your Answer", "Correct Answer", "Status"]],
      body: tableData,
      startY: 60,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 255] },
    });

    doc.save("quiz-report.pdf");
  };

  if (!result) return <p className="text-center mt-10">Loading report...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📄 Quiz Report</CardTitle>
          <p className="text-muted-foreground">
            {result.quiz.title} • Submitted on{" "}
            {new Date(result.submittedAt).toLocaleString()}
          </p>
        </CardHeader>

        <CardContent>
          <h2 className="font-semibold mb-3">
            ✅ Score: {result.score} / {result.totalQuestions}
          </h2>

          {/* 📝 Enhanced Google Forms-like view */}
          {result.feedback?.map((f, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-medium mb-2">
                {idx + 1}. {f.question}
              </p>
              <div className="space-y-2 ml-4">
                {f.options?.map((opt, i) => {
                  const isSelected = opt === f.selected;
                  const isCorrect = opt === f.correct;

                  const borderColor = isCorrect
                    ? "border-green-500"
                    : isSelected
                    ? "border-red-500"
                    : "border-gray-300";

                  const bgColor = isCorrect
                    ? "bg-green-100"
                    : isSelected
                    ? "bg-red-100"
                    : "";

                  return (
                    <div
                      key={i}
                      className={`border ${borderColor} p-2 rounded ${bgColor}`}
                    >
                      <span className="font-medium">{opt}</span>
                      {isCorrect && <span className="ml-2 text-green-600">✅ Correct</span>}
                      {isSelected && !isCorrect && (
                        <span className="ml-2 text-red-600">❌ Your choice</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-4 mt-6">
            <Button onClick={handleDownloadPdf}>📥 Download PDF</Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-muted-foreground text-muted-foreground hover:text-primary"
              onClick={() => router.push("/user")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Gemini Analysis Section */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>💡 AI Auto Analysis</CardTitle>
            <p className="text-muted-foreground text-sm">Powered by Gemini</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiAnalysis}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
