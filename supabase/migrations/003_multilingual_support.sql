-- ============================================================
-- MozhiLearn Migration: 003_multilingual_support.sql
-- SIH26042 Multilingual Pedagogy Support (Ho, Mundari, Santhali, Hindi)
-- ============================================================

-- 1. LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS public.languages (
    code                    TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    native_name             TEXT NOT NULL,
    status                  TEXT NOT NULL CHECK (status IN ('active', 'beta', 'coming_soon')),
    voice_available         BOOLEAN DEFAULT FALSE,
    offline_pack_available  BOOLEAN DEFAULT FALSE
);

INSERT INTO public.languages (code, name, native_name, status, voice_available, offline_pack_available)
VALUES 
    ('hi', 'Hindi', 'हिन्दी', 'active', true, true),
    ('sat', 'Santhali', 'ᱥᱟᱱᱛᱟᱲᱤ', 'active', true, true),
    ('hoc', 'Ho', 'Ho', 'beta', false, false),
    ('unr', 'Mundari', 'Mundari', 'beta', false, false)
ON CONFLICT (code) DO UPDATE 
SET 
    status = EXCLUDED.status,
    voice_available = EXCLUDED.voice_available,
    offline_pack_available = EXCLUDED.offline_pack_available;

-- 2. UPDATE PROFILES TABLE WITH PREFERRED LANGUAGE CODE
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language_code TEXT REFERENCES public.languages(code) DEFAULT 'sat';

-- 3. TEACHER LANGUAGES MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.teacher_languages (
    teacher_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    language_code       TEXT REFERENCES public.languages(code),
    PRIMARY KEY (teacher_id, language_code)
);

-- 4. LESSON TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_translations (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id               UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    source_language_code    TEXT NOT NULL REFERENCES public.languages(code) DEFAULT 'hi',
    target_language_code    TEXT NOT NULL REFERENCES public.languages(code),
    title                   TEXT NOT NULL,
    lesson_script           TEXT,
    activity_instructions   TEXT,
    assessment_prompts      JSONB,
    audio_url               TEXT,
    translation_status      TEXT NOT NULL DEFAULT 'draft' CHECK (translation_status IN ('draft', 'review', 'published', 'archived')),
    reviewed_by             TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (lesson_id, target_language_code)
);

-- RLS Enablement
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read of languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read of lesson translations" ON public.lesson_translations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow teachers to manage lesson translations" ON public.lesson_translations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
