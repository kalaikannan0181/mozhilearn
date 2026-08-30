# 🌐 MozhiLearn — AI-Powered Mother Tongue Learning Platform

> Built for **Smart India Hackathon 2026** | Problem Statement **SIH26042**
>
> **Team Name**: MozhiTech
>
> **College**: Nandha Engineering College, Erode

MozhiLearn is an AI-powered vernacular pedagogy platform that helps primary school students (Grades 1–5) learn in their mother tongue. It gives teachers real-time translation tools to convert English lesson content into regional languages, and lets students learn, listen, and take quizzes in the language they understand best.

---

## 📌 Problem Statement

**SIH26042 — AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education**

Most digital learning content in Indian primary schools is available only in English or Hindi, leaving regional-language students at a comprehension disadvantage. Teachers in rural and semi-urban schools also lack easy tools to translate and adapt classroom material into local languages while keeping the meaning intact. This creates a learning gap that widens over a child's foundational years.

---

## 💡 Solution Overview

MozhiLearn bridges this gap by combining a lesson-authoring workflow with real-time AI translation:

1. **Teachers** write or upload lesson content in English through a simple dashboard.
2. The platform **auto-translates** the content into Tamil (and other regional languages), with audio narration generated for early readers.
3. **Students** access lessons in their mother tongue — reading, listening, and interacting with the material at their own pace.
4. Students take **quizzes** in their native language, graded securely on the server.
5. **Teachers** view an analytics dashboard showing lesson engagement, quiz performance, and areas where students are struggling.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js (App Router, Tailwind CSS) |
| Backend & Database | Supabase (PostgreSQL, Auth, Storage) |
| Text-to-Speech | Web Speech API (Tamil `ta-IN` locale) |
| Package Manager | pnpm |

---

## ✨ Features

- 🔤 Real-time English ⇄ Tamil translation for lesson content (AI simulation model for prototype)
- 📚 Curriculum-aligned vernacular lesson library with audio narration
- 📝 Interactive quizzes in the student's mother tongue with secure server-side scoring
- 👩‍🏫 Teacher content-authoring tool for quick lesson creation and quiz building
- 📊 Student progress dashboard for both students and teachers
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
