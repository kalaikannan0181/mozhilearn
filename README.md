# 🌐 MozhiLearn — AI-Powered Mother Tongue Learning Platform

> Built for **Smart India Hackathon 2026** | Problem Statement **SIH26042**
>
> **Team Name**: MozhiTech
>
> **College**: Nandha Engineering College, Erode

MozhiLearn is an AI-powered multilingual teaching and learning platform for mother tongue-based primary education in India (Grades 1–5). It helps teachers transform lesson content, classroom instructions, audio, worksheets, flashcards, and quizzes from a selected source language into a student’s selected mother tongue.

---

## 📌 Problem Statement

**SIH26042 — AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education**

In India's multilingual classrooms, teachers and students may use different languages. When learning content is not available in a child's familiar language, understanding can become harder than the lesson itself.

---

## 💡 Solution Overview & Architecture

MozhiLearn is language-pair agnostic by design:

```text
Teacher Source Language Selection
                ↓
Speech-to-Text / Lesson Input
                ↓
AI Translation + Grade-Level Pedagogy Engine
                ↓
Selected Student Mother Tongue
                ↓
Teacher Review
                ↓
Audio Support + Worksheets + Flashcards + Quiz
                ↓
Student Learning & Progress Analytics
```

1. **Teachers** enter or speak lesson content in their chosen classroom language through a simple dashboard.
2. The platform **assists adaptation** into the student's selected learning language or mother tongue, with audio support generated for foundational readers.
3. **Teachers** review and verify AI-assisted content before sharing it with students.
4. **Students** access lessons, practice activities, worksheets, and quizzes in their familiar language.
5. **Teachers** monitor learning progress and class-level comprehension analytics.

---

## ⚠️ Accuracy & Scope

> MozhiLearn is designed as a configurable multilingual platform for Indian languages. Available language pairs depend on validated translation, speech, and educational-content resources. All AI-generated material requires teacher review before classroom use.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js (App Router, Tailwind CSS) |
| Backend & Database | Supabase (PostgreSQL, Auth, Storage) |
| Audio Learning Support | Web Speech API & Multilingual Speech Synthesis |
| Package Manager | pnpm |

---

## ✨ Features

- 🔤 Configurable Indian language translation & adaptation for lesson content
- 📚 Curriculum-aligned mother tongue learning library with audio support
- 📝 Interactive quizzes in the student's selected language with secure server-side scoring
- 👩‍🏫 Teacher content-authoring tool for lesson creation, reviews, and activity building
- 📊 Student learning progress dashboard for both students and teachers
- 🔐 Role-based authentication (Student / Teacher / Admin)
- 📈 Teacher analytics view — lesson-wise and student-wise performance

---

## ⚙️ Installation Instructions (Run Locally)

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v11 or higher)
- A [Supabase](https://supabase.com) project (free tier works)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalaikannan0181/mozhilearn.git
   cd mozhilearn
   ```

2. **Install dependencies**
   ```bash
   npx pnpm install
   ```

3. **Set up database schema (SQL Migration)**
   - Open your Supabase Dashboard.
   - Go to **SQL Editor** → **New Query**.
   - Copy the contents of [`supabase/migrations/001_mozhilearn_schema.sql`](file:///c:/Users/kalai/Downloads/mozhilearn/supabase/migrations/001_mozhilearn_schema.sql) and paste them into the SQL Editor.
   - Click **Run** to execute the migration. This will automatically create all tables, triggers, secure RPC grading functions, storage buckets, and seed the demo lessons.

4. **Configure environment variables**
   Create a `.env.local` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://ojikhuxjdswfwjfuxnob.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1plQ3upmO5mALvpBUJPwZQ_DwxqWeJA
   ```
   *(Ensure `.env.local` is listed in your `.gitignore` to prevent credentials exposure).*

5. **Start the development server**
   ```bash
   npx pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

## Authentication Setup and Testing

Authentication uses Supabase Auth with the public browser key. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never add a service-role key to the frontend.

Role information is stored in Supabase user metadata. Test `/signup?role=teacher` and `/signup?role=student`, confirm email when required, and verify each role reaches its matching dashboard. Also verify wrong passwords show an error, logged-out dashboard visits redirect to `/login`, students cannot open the teacher dashboard, logout returns to `/`, and the existing homepage still works.

---

## 🔒 Security Notes
- **Row Level Security (RLS)** is enabled on all tables in Supabase.
- **Client safety**: The client-side queries for `quiz_questions` omit the `correct_answer` column, preventing students from inspecting network requests to find correct choices.
- **Server grading**: Quizzes are graded securely in PostgreSQL database via the `submit_quiz_attempt` RPC function using `security definer`.

---

## 👥 Team Members (MozhiTech)

**Nandha Engineering College, Erode**

- **Kalaikannan** - Team Lead / Full-Stack Developer
- *And other contributors of Team MozhiTech.*

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for Smart India Hackathon 2026</p>
