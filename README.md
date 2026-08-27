# 🌐 MozhiLearn — AI-Powered Mother Tongue Learning Platform

> Built for **Smart India Hackathon 2026** | Problem Statement **SIH26042**

MozhiLearn is an AI-powered vernacular pedagogy platform that helps primary school students (Grades 1–5) learn in their mother tongue. It gives teachers real-time translation tools to convert English lesson content into regional languages, and lets students learn, listen, and take quizzes in the language they understand best.

---

## 📌 Problem Statement

**SIH26042 — AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education**

Most digital learning content in Indian primary schools is available only in English or Hindi, leaving regional-language students at a comprehension disadvantage. Teachers in rural and semi-urban schools also lack easy tools to translate and adapt classroom material into local languages while keeping the meaning intact. This creates a learning gap that widens over a child's foundational years.

---

## 💡 Solution Overview

MozhiLearn bridges this gap by combining a lesson-authoring workflow with real-time AI translation:

1. **Teachers** write or upload lesson content in English through a simple dashboard.
2. The platform **auto-translates** the content into Tamil (and other regional languages) using the Google Translate API, with audio narration generated for early readers.
3. **Students** access lessons in their mother tongue — reading, listening, and interacting with the material at their own pace.
4. Students take **quizzes** in their native language, and results are logged automatically.
5. **Teachers** view an analytics dashboard showing lesson engagement, quiz performance, and areas where students are struggling.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend & Database | Supabase (PostgreSQL, Auth, Storage) |
| Translation | Google Translate API |
| Text-to-Speech | Web Speech API / Google Cloud TTS |
| Hosting | Cloudflare Pages |
| Version Control | Git & GitHub |
| Design | Figma |

---

## ✨ Features

- 🔤 Real-time English ⇄ Tamil translation for lesson content
- 📚 Curriculum-aligned vernacular lesson library with audio narration
- 📝 Interactive quizzes in the student's mother tongue with instant scoring
- 👩‍🏫 Teacher content-authoring tool for quick lesson creation
- 📊 Student progress dashboard for both students and teachers
- 🔐 Role-based authentication (Student / Teacher / Admin)
- 📈 Teacher analytics view — lesson-wise and student-wise performance

---

## ⚙️ Installation Instructions (Run Locally)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A [Supabase](https://supabase.com) project (free tier works)
- A Google Cloud project with the Translate API enabled

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/mozhilearn.git
cd mozhilearn

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Fill in `.env` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

```bash
# 4. Run the database schema
# Open the Supabase SQL Editor and run schema.sql from the /database folder

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🚀 Deployment

MozhiLearn is deployed on **Cloudflare Pages** with continuous deployment from the `main` branch.

- **Live Demo:** `https://mozhilearn.pages.dev` *(update with actual URL)*
- **Backend:** Supabase (hosted PostgreSQL + Auth + Storage)

---

## 👥 Team Members

| Name | Role |
|---|---|
| [Team Member 1] | Team Lead / Full-Stack Developer |
| [Team Member 2] | Frontend Developer (React) |
| [Team Member 3] | Backend Developer (Supabase) |
| [Team Member 4] | AI/Translation Integration Engineer |
| [Team Member 5] | UI/UX Designer |
| [Team Member 6] | QA / Documentation & Presentation Lead |

**Team Name:** [Your Team Name]

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for Smart India Hackathon 2026</p>
