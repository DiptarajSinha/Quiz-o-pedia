# 🧠 Quiz-o-pedia - AI-Powered Quiz Web App

Quiz-o-pedia is a full-stack, AI-integrated quiz platform where:

- 🧑‍🏫 **Admins** can create quizzes manually or use AI to generate questions.
- 🧑‍🎓 **Users** can take quizzes, get instant scoring, leaderboard rankings, and detailed AI feedback.
- 🤖 Post-quiz **Gemini AI** provides intelligent analysis.
- 📄 PDF report generation for user results.

---

## 🚀 Features

### 👥 Authentication & Roles
- JWT-based login/register
- Role-based access: `Admin` / `User`

### 🧑‍🏫 Admin Panel
- Create quizzes manually
- Generate quizzes using Gemini AI
- Tag quizzes by topic

### 🧑‍🎓 User Dashboard
- View available quizzes
- Attempt each quiz once
- Instant scoring + AI feedback
- View top 3 past attempts
- Download PDF reports

### 💬 AI Chatbot
- Automatically analyzes wrong answers using Gemini
- Chat UI — direct feedback from AI after quiz

### 🏆 Leaderboard
- View top scores per quiz

---

## 📦 Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | Next.js, TailwindCSS, ShadCN UI |
| Backend     | NestJS                   |
| Database    | PostgreSQL (via Supabase)|
| Auth        | JWT + Role-based         |
| AI          | Gemini 2.0 Flash Lite    |
| PDF Export  | jsPDF + autoTable        |

---

## 📸 Preview

Here’s a quick look at the landing page:

![Landing Page](./screenshots/landing-page.png)

This is the Admin dashboard:

![Admin dashboard](./screenshots/admin-dashboard.png)

This is the User dashboard:

![User dashboard](./screenshots/user-dashboard.png)

This is how you can create quiz using AI:

![ai-quiz-generator](./screenshots/ask-ai-assistant.png)

Below is the AI feedback section after quiz submission:

![AI Feedback](./screenshots/ai-feedback.png)

Now, the leaderboard section for each quiz:

![leaderboard](./screenshots/leaderboard.png)

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/quiz-o-pedia.git
cd quiz-o-pedia
