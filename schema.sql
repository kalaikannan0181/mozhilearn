-- ============================================================
-- SIH26042 — Vernacular Pedagogy Platform
-- PostgreSQL Schema for Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
    school_name     VARCHAR(200),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'All platform users: teachers, students (auth identity), and admins.';
COMMENT ON COLUMN users.role IS 'Restricted to teacher, student, or admin.';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt/Argon2 hash — never store plaintext passwords.';

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 2. LESSONS TABLE
-- ============================================================
CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en        VARCHAR(255) NOT NULL,
    title_ta        VARCHAR(255),
    subject         VARCHAR(100) NOT NULL,
    grade_level     INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    content_en      TEXT NOT NULL,
    content_ta      TEXT,
    audio_url       VARCHAR(500),
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE lessons IS 'Lesson content authored by teachers in English, translated into Tamil.';
COMMENT ON COLUMN lessons.content_ta IS 'Auto-translated Tamil content; may be teacher-edited for accuracy.';
COMMENT ON COLUMN lessons.audio_url IS 'Link to narrated audio file in Supabase Storage.';
COMMENT ON COLUMN lessons.teacher_id IS 'References the teacher (users.role = teacher) who authored this lesson.';

CREATE INDEX idx_lessons_teacher_id ON lessons(teacher_id);
CREATE INDEX idx_lessons_grade_subject ON lessons(grade_level, subject);

-- ============================================================
-- 3. STUDENTS TABLE
-- ============================================================
CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    grade_level     INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    mother_tongue   VARCHAR(50) NOT NULL,
    school_name     VARCHAR(200)
);

COMMENT ON TABLE students IS 'Extended profile for users with role = student.';
COMMENT ON COLUMN students.user_id IS 'One-to-one link to the users table (login identity).';
COMMENT ON COLUMN students.mother_tongue IS 'Student''s native language, e.g. Tamil, Telugu.';

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_grade_level ON students(grade_level);

-- ============================================================
-- 4. QUIZ_RESULTS TABLE
-- ============================================================
CREATE TABLE quiz_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    lesson_id           UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    score               DECIMAL(5,2) NOT NULL CHECK (score >= 0),
    total_questions     INTEGER NOT NULL CHECK (total_questions > 0),
    time_taken_seconds  INTEGER NOT NULL CHECK (time_taken_seconds >= 0),
    completed_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE quiz_results IS 'Records of each quiz attempt tied to a student and lesson, used for teacher analytics.';
COMMENT ON COLUMN quiz_results.score IS 'Raw or percentage score depending on quiz design; DECIMAL for partial-credit support.';

CREATE INDEX idx_quiz_results_student_id ON quiz_results(student_id);
CREATE INDEX idx_quiz_results_lesson_id ON quiz_results(lesson_id);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at);
-- Composite index to speed up "teacher analytics per lesson" queries
CREATE INDEX idx_quiz_results_lesson_score ON quiz_results(lesson_id, score);

-- ============================================================
-- SAMPLE DATA (FOR TESTING)
-- ============================================================

-- Teachers
INSERT INTO users (id, name, email, password_hash, role, school_name)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Meena Rajan', 'meena.rajan@school.edu', '$2b$12$examplehash1', 'teacher', 'Govt Primary School, Erode'),
    ('22222222-2222-2222-2222-222222222222', 'Suresh Kumar', 'suresh.kumar@school.edu', '$2b$12$examplehash2', 'teacher', 'Govt Primary School, Erode');

-- Students (as users first)
INSERT INTO users (id, name, email, password_hash, role, school_name)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Arun Kumar', 'arun.kumar@student.edu', '$2b$12$examplehash3', 'student', 'Govt Primary School, Erode'),
    ('44444444-4444-4444-4444-444444444444', 'Divya Sri', 'divya.sri@student.edu', '$2b$12$examplehash4', 'student', 'Govt Primary School, Erode');

-- Admin
INSERT INTO users (id, name, email, password_hash, role, school_name)
VALUES
    ('55555555-5555-5555-5555-555555555555', 'Admin User', 'admin@platform.edu', '$2b$12$examplehash5', 'admin', NULL);

-- Student profiles
INSERT INTO students (id, user_id, grade_level, mother_tongue, school_name)
VALUES
    ('a1111111-aaaa-1111-aaaa-111111111111', '33333333-3333-3333-3333-333333333333', 3, 'Tamil', 'Govt Primary School, Erode'),
    ('a2222222-aaaa-2222-aaaa-222222222222', '44444444-4444-4444-4444-444444444444', 4, 'Tamil', 'Govt Primary School, Erode');

-- Lessons
INSERT INTO lessons (id, title_en, title_ta, subject, grade_level, content_en, content_ta, audio_url, teacher_id)
VALUES
    ('b1111111-bbbb-1111-bbbb-111111111111', 'The Water Cycle', 'நீர் சுழற்சி', 'Environmental Science', 4,
     'Water evaporates from oceans, forms clouds, and falls as rain.',
     'கடல்களில் இருந்து நீர் ஆவியாகி, மேகங்களை உருவாக்கி, மழையாகப் பொழிகிறது.',
     'https://storage.example.com/audio/water-cycle-ta.mp3',
     '11111111-1111-1111-1111-111111111111'),
    ('b2222222-bbbb-2222-bbbb-222222222222', 'Basic Addition', 'அடிப்படை கூட்டல்', 'Mathematics', 3,
     'Addition means combining two or more numbers to get a total.',
     'கூட்டல் என்பது இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை இணைத்து மொத்தத்தைப் பெறுவது.',
     'https://storage.example.com/audio/addition-ta.mp3',
     '22222222-2222-2222-2222-222222222222');

-- Quiz results
INSERT INTO quiz_results (student_id, lesson_id, score, total_questions, time_taken_seconds)
VALUES
    ('a1111111-aaaa-1111-aaaa-111111111111', 'b1111111-bbbb-1111-bbbb-111111111111', 80.00, 10, 240),
    ('a2222222-aaaa-2222-aaaa-222222222222', 'b2222222-bbbb-2222-bbbb-222222222222', 90.00, 10, 180),
    ('a1111111-aaaa-1111-aaaa-111111111111', 'b2222222-bbbb-2222-bbbb-222222222222', 70.00, 10, 300);

-- ============================================================
-- SAMPLE ANALYTICS QUERY (Teacher view)
-- ============================================================
-- Average score per lesson, for a given teacher
-- SELECT l.title_en, l.title_ta, AVG(qr.score) AS avg_score, COUNT(qr.id) AS attempts
-- FROM lessons l
-- JOIN quiz_results qr ON qr.lesson_id = l.id
-- WHERE l.teacher_id = '11111111-1111-1111-1111-111111111111'
-- GROUP BY l.id, l.title_en, l.title_ta;

-- ============================================================
-- 5. MOTHER TONGUE INTERACTIVE LEARNING EXTENSIONS
-- ============================================================

-- 5.1 Languages Configuration
CREATE TABLE IF NOT EXISTS languages (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                    VARCHAR(20) UNIQUE NOT NULL,
    display_name            VARCHAR(100) NOT NULL,
    native_name             VARCHAR(100),
    script                  VARCHAR(50),
    status                  VARCHAR(30) NOT NULL CHECK (status IN ('AVAILABLE', 'LIMITED', 'PLANNED', 'DISABLED')),
    translation_supported   BOOLEAN DEFAULT FALSE,
    audio_supported         BOOLEAN DEFAULT FALSE,
    offline_pack_supported  BOOLEAN DEFAULT FALSE,
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.2 Reference Language Sources
CREATE TABLE IF NOT EXISTS language_sources (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    source_type         VARCHAR(50) NOT NULL,
    organization        VARCHAR(200),
    url_or_reference    TEXT,
    publication_year    INTEGER,
    license_notes       TEXT,
    language_id         UUID REFERENCES languages(id) ON DELETE SET NULL,
    imported_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.3 Language Dictionary
CREATE TABLE IF NOT EXISTS language_dictionary (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id         UUID REFERENCES languages(id) ON DELETE CASCADE,
    source_word         VARCHAR(255) NOT NULL,
    target_word         VARCHAR(255) NOT NULL,
    english_meaning     TEXT,
    transliteration     VARCHAR(255),
    part_of_speech      VARCHAR(50),
    grade               INTEGER CHECK (grade BETWEEN 1 AND 5),
    subject             VARCHAR(100),
    topic               VARCHAR(100),
    source_id           UUID REFERENCES language_sources(id) ON DELETE SET NULL,
    verification_status VARCHAR(50) DEFAULT 'DRAFT',
    verified_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.4 Translation Memory
CREATE TABLE IF NOT EXISTS translation_memory (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_language_id      UUID REFERENCES languages(id),
    target_language_id      UUID REFERENCES languages(id),
    source_text_normalized  TEXT NOT NULL,
    translated_text         TEXT NOT NULL,
    context_grade           INTEGER CHECK (context_grade BETWEEN 1 AND 5),
    context_subject         VARCHAR(100),
    context_topic           VARCHAR(100),
    source_type             VARCHAR(50),
    verification_status     VARCHAR(50) DEFAULT 'DRAFT',
    approved_by             UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at             TIMESTAMP,
    usage_count             INTEGER DEFAULT 0,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.5 Validation Records
CREATE TABLE IF NOT EXISTS validation_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type         VARCHAR(50) NOT NULL,
    entity_id           UUID NOT NULL,
    validation_type     VARCHAR(50) NOT NULL,
    status              VARCHAR(50) NOT NULL,
    reviewer_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_role       VARCHAR(50),
    notes               TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.6 Learning Stories & Story Pages
CREATE TABLE IF NOT EXISTS learning_stories (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES lessons(id) ON DELETE CASCADE,
    language_id         UUID REFERENCES languages(id),
    title               VARCHAR(255) NOT NULL,
    learning_objective  TEXT,
    grade               INTEGER CHECK (grade BETWEEN 1 AND 5),
    verification_status VARCHAR(50) DEFAULT 'DRAFT',
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_pages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id            UUID REFERENCES learning_stories(id) ON DELETE CASCADE,
    page_order          INTEGER NOT NULL,
    text_content        TEXT NOT NULL,
    image_key_or_url    VARCHAR(500),
    audio_id            UUID,
    verification_status VARCHAR(50) DEFAULT 'DRAFT'
);

-- 5.7 Flashcards & Activities
CREATE TABLE IF NOT EXISTS learning_flashcards (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES lessons(id) ON DELETE CASCADE,
    language_id         UUID REFERENCES languages(id),
    concept_key         VARCHAR(100) NOT NULL,
    image_key_or_url    VARCHAR(500),
    source_term         VARCHAR(255) NOT NULL,
    target_term         VARCHAR(255) NOT NULL,
    transliteration     VARCHAR(255),
    audio_id            UUID,
    grade               INTEGER CHECK (grade BETWEEN 1 AND 5),
    subject             VARCHAR(100),
    topic               VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'DRAFT',
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_activities (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES lessons(id) ON DELETE CASCADE,
    language_id         UUID REFERENCES languages(id),
    activity_type       VARCHAR(50) NOT NULL,
    title               VARCHAR(255) NOT NULL,
    instructions        TEXT,
    activity_data_json  JSONB,
    grade               INTEGER CHECK (grade BETWEEN 1 AND 5),
    verification_status VARCHAR(50) DEFAULT 'DRAFT',
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5.8 Offline Language Packs
CREATE TABLE IF NOT EXISTS offline_language_packs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id         UUID REFERENCES languages(id),
    grade               INTEGER CHECK (grade BETWEEN 1 AND 5),
    subject             VARCHAR(100),
    topic               VARCHAR(100),
    version             VARCHAR(20) NOT NULL,
    manifest_json       JSONB NOT NULL,
    size_bytes          BIGINT DEFAULT 0,
    verification_status VARCHAR(50) DEFAULT 'DRAFT',
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at        TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_lang_dict_lookup ON language_dictionary(language_id, source_word);
CREATE INDEX IF NOT EXISTS idx_trans_memory_lookup ON translation_memory(source_language_id, target_language_id, source_text_normalized);
CREATE INDEX IF NOT EXISTS idx_validation_entity ON validation_records(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_lesson_lang ON learning_activities(lesson_id, language_id);
CREATE INDEX IF NOT EXISTS idx_offline_packs_grade_lang ON offline_language_packs(language_id, grade);

