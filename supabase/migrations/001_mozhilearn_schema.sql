-- ============================================================
-- MozhiLearn Supabase SQL Migration
-- File: supabase/migrations/001_mozhilearn_schema.sql
-- ============================================================

-- Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name           TEXT NOT NULL,
    role                TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    school_name         TEXT,
    grade_level         INTEGER CHECK (grade_level BETWEEN 1 AND 5),
    preferred_language  TEXT DEFAULT 'ta',
    avatar_url          TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. SCHOOLS TABLE
-- ============================================================
CREATE TABLE public.schools (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    district            TEXT,
    state               TEXT DEFAULT 'Tamil Nadu',
    created_by          UUID REFERENCES public.profiles(id),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TEACHER_SCHOOLS TABLE
-- ============================================================
CREATE TABLE public.teacher_schools (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id           UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (teacher_id, school_id)
);

-- ============================================================
-- 4. STUDENT_TEACHER_MAP TABLE
-- ============================================================
CREATE TABLE public.student_teacher_map (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (teacher_id, student_id)
);

-- ============================================================
-- 5. LESSONS TABLE
-- ============================================================
CREATE TABLE public.lessons (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en            TEXT NOT NULL,
    title_ta            TEXT,
    subject             TEXT NOT NULL,
    grade_level         INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    original_content    TEXT NOT NULL,
    translated_content  TEXT,
    simplified_content_ta TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    vocabulary          JSONB DEFAULT '[]'::jsonb,
    source_language     TEXT DEFAULT 'en',
    target_language     TEXT DEFAULT 'ta',
    status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    source_file_path    TEXT,
    audio_file_path     TEXT,
    created_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    school_id           UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_lessons_created_by ON public.lessons(created_by);
CREATE INDEX idx_lessons_grade_level ON public.lessons(grade_level);
CREATE INDEX idx_lessons_subject ON public.lessons(subject);
CREATE INDEX idx_lessons_school_id ON public.lessons(school_id);
CREATE INDEX idx_lessons_status ON public.lessons(status);

-- ============================================================
-- 6. LESSON_ASSIGNMENTS TABLE
-- ============================================================
CREATE TABLE public.lesson_assignments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    student_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date            DATE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (lesson_id, student_id)
);

-- ============================================================
-- 7. QUIZ_QUESTIONS TABLE
-- ============================================================
CREATE TABLE public.quiz_questions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    question_en         TEXT,
    question_ta         TEXT NOT NULL,
    options             JSONB NOT NULL,
    correct_answer      TEXT NOT NULL,
    explanation_ta      TEXT,
    difficulty          TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_order      INTEGER DEFAULT 1,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. QUIZ_ATTEMPTS TABLE
-- ============================================================
CREATE TABLE public.quiz_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    student_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score               NUMERIC(5,2) DEFAULT 0,
    total_questions     INTEGER DEFAULT 0,
    percentage          NUMERIC(5,2) DEFAULT 0,
    answers             JSONB DEFAULT '[]'::jsonb,
    started_at          TIMESTAMPTZ DEFAULT NOW(),
    submitted_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. LESSON_PROGRESS TABLE
-- ============================================================
CREATE TABLE public.lesson_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    student_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status              TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percent    NUMERIC(5,2) DEFAULT 0,
    time_spent_seconds  INTEGER DEFAULT 0,
    last_accessed_at    TIMESTAMPTZ DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (lesson_id, student_id)
);

-- ============================================================
-- 10. TRANSLATION_REVIEWS TABLE
-- ============================================================
CREATE TABLE public.translation_reviews (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    reviewer_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status              TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'needs_changes')),
    comments            TEXT,
    reviewed_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DB TRIGGERS: AUTOMATIC updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- DB TRIGGER: CREATE PROFILE ON NEW USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, school_name, preferred_language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'school_name',
    'ta'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECURE QUIZ SUBMISSION AND EVALUATION RPC FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(p_lesson_id uuid, p_answers jsonb)
RETURNS jsonb AS $$
DECLARE
  v_student_id uuid;
  v_question_count integer := 0;
  v_correct_count integer := 0;
  v_score numeric(5,2) := 0;
  v_percentage numeric(5,2) := 0;
  v_question RECORD;
  v_answer RECORD;
  v_selected text;
  v_attempt_id uuid;
BEGIN
  -- Get active student ID
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Loop through each question of the lesson to count them and grade the answers
  FOR v_question IN 
    SELECT id, correct_answer 
    FROM public.quiz_questions 
    WHERE lesson_id = p_lesson_id
  LOOP
    v_question_count := v_question_count + 1;
    
    -- Extract the student's selected answer for this question
    -- p_answers format: [{"question_id": "...", "selected_option": "..."}]
    v_selected := NULL;
    FOR v_answer IN SELECT * FROM jsonb_to_recordset(p_answers) AS x(question_id uuid, selected_option text) LOOP
      IF v_answer.question_id = v_question.id THEN
        v_selected := v_answer.selected_option;
        EXIT;
      END IF;
    END LOOP;
    
    IF v_selected IS NOT NULL AND v_selected = v_question.correct_answer THEN
      v_correct_count := v_correct_count + 1;
    END IF;
  END LOOP;
  
  -- Calculate score and percentage
  IF v_question_count > 0 THEN
    v_score := v_correct_count::numeric;
    v_percentage := (v_correct_count::numeric / v_question_count::numeric) * 100;
  END IF;
  
  -- Insert quiz attempt
  INSERT INTO public.quiz_attempts (lesson_id, student_id, score, total_questions, percentage, answers, submitted_at)
  VALUES (p_lesson_id, v_student_id, v_score, v_question_count, v_percentage, p_answers, now())
  RETURNING id INTO v_attempt_id;
  
  -- Update/Insert lesson progress
  INSERT INTO public.lesson_progress (lesson_id, student_id, status, progress_percent, last_accessed_at, completed_at)
  VALUES (p_lesson_id, v_student_id, 'completed', 100, now(), now())
  ON CONFLICT (lesson_id, student_id) 
  DO UPDATE SET 
    status = 'completed',
    progress_percent = 100,
    last_accessed_at = now(),
    completed_at = COALESCE(public.lesson_progress.completed_at, now());
    
  -- Return result summary
  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score', v_score,
    'total_questions', v_question_count,
    'percentage', v_percentage,
    'correct_count', v_correct_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_teacher_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- 1. Profiles
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Teachers can view mapped students" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.student_teacher_map WHERE teacher_id = auth.uid() AND student_id = public.profiles.id)
);

-- 2. Schools
CREATE POLICY "Authenticated users can read schools" ON public.schools FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage schools" ON public.schools FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Teachers can create schools during onboarding" ON public.schools FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- 3. Teacher Schools Mappings
CREATE POLICY "Teachers can read own school mapping" ON public.teacher_schools FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Admin can manage teacher school mapping" ON public.teacher_schools FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Student Teacher Mappings
CREATE POLICY "Teachers can read own student mappings" ON public.student_teacher_map FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Students can read own teacher mappings" ON public.student_teacher_map FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Admin can manage mappings" ON public.student_teacher_map FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Lessons
CREATE POLICY "Teachers can manage own lessons" ON public.lessons FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Teachers can read public and own school lessons" ON public.lessons FOR SELECT USING (
    status = 'published' AND (created_by = auth.uid() OR school_id IN (SELECT school_id FROM public.teacher_schools WHERE teacher_id = auth.uid()))
);
CREATE POLICY "Students can read assigned published lessons" ON public.lessons FOR SELECT USING (
    status = 'published' AND (
        created_by IS NULL OR -- public demo lessons
        id IN (SELECT lesson_id FROM public.lesson_assignments WHERE student_id = auth.uid())
    )
);
CREATE POLICY "Admin full access lessons" ON public.lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Lesson Assignments
CREATE POLICY "Teachers can manage own assignments" ON public.lesson_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.lessons WHERE id = public.lesson_assignments.lesson_id AND created_by = auth.uid())
);
CREATE POLICY "Students can read own assignments" ON public.lesson_assignments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Admin full access assignments" ON public.lesson_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Quiz Questions
CREATE POLICY "Teachers can manage questions for own lessons" ON public.quiz_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.lessons WHERE id = public.quiz_questions.lesson_id AND created_by = auth.uid())
);
CREATE POLICY "Students can read questions for assigned lessons" ON public.quiz_questions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.lessons l
        LEFT JOIN public.lesson_assignments la ON la.lesson_id = l.id
        WHERE l.id = public.quiz_questions.lesson_id AND l.status = 'published' AND (l.created_by IS NULL OR la.student_id = auth.uid())
    )
);

-- 8. Quiz Attempts
CREATE POLICY "Students can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers can read attempts of mapped students" ON public.quiz_attempts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.student_teacher_map WHERE teacher_id = auth.uid() AND student_id = public.quiz_attempts.student_id)
);
CREATE POLICY "Admin full access attempts" ON public.quiz_attempts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 9. Lesson Progress
CREATE POLICY "Students can manage own progress" ON public.lesson_progress FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers can read progress of mapped students" ON public.lesson_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.student_teacher_map WHERE teacher_id = auth.uid() AND student_id = public.lesson_progress.student_id)
);
CREATE POLICY "Admin full access progress" ON public.lesson_progress FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. Translation Reviews
CREATE POLICY "Teachers can manage reviews for own lessons" ON public.translation_reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM public.lessons WHERE id = public.translation_reviews.lesson_id AND created_by = auth.uid())
);
CREATE POLICY "Admin full access reviews" ON public.translation_reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- ============================================================
-- STORAGE BUCKETS AND STORAGE POLICIES
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('lesson-files', 'lesson-files', false, 10485760, null), -- 10MB limit
    ('lesson-audio', 'lesson-audio', false, 10485760, null)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies (simplifying for demo flow)
CREATE POLICY "Allow authenticated read on storage objects" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id IN ('lesson-files', 'lesson-audio'));

CREATE POLICY "Allow teachers to upload and delete files" ON storage.objects
    FOR ALL TO authenticated USING (
        bucket_id IN ('lesson-files', 'lesson-audio') AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    );

-- ============================================================
-- SEED DATA (Demo Lessons for Hackathon SIH Prototype)
-- ============================================================

-- Insert public demo lesson: Photosynthesis (Grade 3 Science)
INSERT INTO public.lessons (id, title_en, title_ta, subject, grade_level, original_content, translated_content, simplified_content_ta, learning_objectives, vocabulary, status, created_by)
VALUES (
    'd1111111-1111-1111-1111-111111111111',
    'Photosynthesis',
    'ஒளிச்சேர்க்கை (Photosynthesis)',
    'Science',
    3,
    'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. Leaves have a green color because of chlorophyll, which absorbs light energy.',
    'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடைப் பயன்படுத்தி ஆக்ஸிஜன் மற்றும் சர்க்கரை வடிவிலான ஆற்றலை உருவாக்கும் செயல்முறையாகும். இலைகள் குளோரோபில் (பச்சை நிறமி) காரணமாக பச்சை நிறத்தைக் கொண்டுள்ளன, இது ஒளி ஆற்றலை உறிஞ்சுகிறது.',
    'தாவரங்கள் சூரிய ஒளி, நீர், மற்றும் காற்றைப் பயன்படுத்தி தங்களுக்குத் தேவையான உணவைத் தயாரிக்கும் முறைக்கு "ஒளிச்சேர்க்கை" என்று பெயர். செடிகளின் இலைகளில் இருக்கும் பச்சையம் (chlorophyll) தான் இதற்கு உதவுகிறது. இந்த முறையில் தாவரங்கள் மனிதர்களுக்குத் தேவையான ஆக்சிஜனை வெளியிடுகின்றன.',
    '["Understand how plants make food using sunlight", "Identify the role of chlorophyll in leaves", "Recognize that plants release oxygen"]'::jsonb,
    '[{"en": "Photosynthesis", "ta": "ஒளிச்சேர்க்கை"}, {"en": "Chlorophyll", "ta": "பச்சையம்"}, {"en": "Sunlight", "ta": "சூரிய ஒளி"}]'::jsonb,
    'published',
    NULL
);

-- Insert questions for Photosynthesis
INSERT INTO public.quiz_questions (lesson_id, question_en, question_ta, options, correct_answer, explanation_ta, difficulty, question_order)
VALUES 
    (
        'd1111111-1111-1111-1111-111111111111',
        'What gas do plants release during photosynthesis?',
        'ஒளிச்சேர்க்கையின் போது தாவரங்கள் எந்த வாயுவை வெளியிடுகின்றன?',
        '["Oxygen (ஆக்ஸிஜன்)", "Carbon Dioxide (கார்பன் டை ஆக்சைடு)", "Nitrogen (நைட்ரஜன்)", "Hydrogen (ஹைட்ரஜன்)"]'::jsonb,
        'Oxygen (ஆக்ஸிஜன்)',
        'ஒளிச்சேர்க்கையின் போது தாவரங்கள் ஆக்சிஜனை (Oxygen) வெளியிடுகின்றன, இது நாம் சுவாசிக்க உதவுகிறது.',
        'easy',
        1
    ),
    (
        'd1111111-1111-1111-1111-111111111111',
        'What gives leaves their green color?',
        'இலைகளுக்கு பச்சை நிறத்தை கொடுப்பது எது?',
        '["Water (நீர்)", "Chlorophyll (பச்சையம்)", "Sunlight (சூரிய ஒளி)", "Soil (மண்)"]'::jsonb,
        'Chlorophyll (பச்சையம்)',
        'பச்சையம் (Chlorophyll) தான் இலைகளுக்கு பச்சை நிறத்தைக் கொடுக்கிறது மற்றும் சூரிய ஒளியை உறிஞ்ச உதவுகிறது.',
        'easy',
        2
    ),
    (
        'd1111111-1111-1111-1111-111111111111',
        'Which of the following is NOT needed for photosynthesis?',
        'ஒளிச்சேர்க்கைக்கு கீழே உள்ளவற்றில் எது தேவையில்லை?',
        '["Sunlight (சூரிய ஒளி)", "Water (நீர்)", "Oxygen (ஆக்சிஜன்)", "Carbon Dioxide (கார்பன் டை ஆக்சைடு)"]'::jsonb,
        'Oxygen (ஆக்சிஜன்)',
        'தாவரங்கள் உணவு தயாரிக்க ஆக்சிஜனைப் பயன்படுத்துவதில்லை, மாறாக ஆக்சிஜனை வெளியிடுகின்றன.',
        'medium',
        3
    );

-- Insert public demo lesson: Basic Addition (Grade 2 Mathematics)
INSERT INTO public.lessons (id, title_en, title_ta, subject, grade_level, original_content, translated_content, simplified_content_ta, learning_objectives, vocabulary, status, created_by)
VALUES (
    'd2222222-2222-2222-2222-222222222222',
    'Basic Addition',
    'அடிப்படை கூட்டல் (Basic Addition)',
    'Mathematics',
    2,
    'Addition is bringing two or more numbers together to make a new total. The symbol for addition is + (plus). For example, 3 + 2 equals 5.',
    'கூட்டல் என்பது புதிய மொத்தத்தை உருவாக்க இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாக இணைப்பதாகும். கூட்டலின் குறியீடு + (பிளஸ்) ஆகும். உதாரணமாக, 3 + 2 என்பது 5 ஆகும்.',
    'கூட்டல் என்றால் இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாகச் சேர்த்து மொத்த மதிப்பைக் காண்பது ஆகும். கூட்டலைக் குறிக்க நாம் "+" என்ற குறியீட்டைப் பயன்படுத்துகிறோம். உதாரணமாக, உங்களிடம் 3 ஆப்பிள்கள் உள்ளன, அம்மா மேலும் 2 தருகிறார் என்றால் மொத்தம் 5 ஆப்பிள்கள்.',
    '["Learn to combine two numbers", "Understand the + addition sign", "Perform simple double-digit sum additions"]'::jsonb,
    '[{"en": "Addition", "ta": "கூட்டல்"}, {"en": "Total", "ta": "மொத்தம்"}, {"en": "Plus Sign", "ta": "கூட்டல் குறி (+)"}]'::jsonb,
    'published',
    NULL
);

-- Insert questions for Addition
INSERT INTO public.quiz_questions (lesson_id, question_en, question_ta, options, correct_answer, explanation_ta, difficulty, question_order)
VALUES 
    (
        'd2222222-2222-2222-2222-222222222222',
        'What is 5 + 4?',
        '5 + 4-ன் மதிப்பு என்ன?',
        '["7", "8", "9", "10"]'::jsonb,
        '9',
        '5 உடன் 4-ஐக் கூட்டினால் 9 கிடைக்கும்.',
        'easy',
        1
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'Which symbol is used for addition?',
        'கூட்டலுக்குப் பயன்படுத்தப்படும் குறியீடு எது?',
        '["-", "+", "x", "/"]'::jsonb,
        '+',
        '+ (பிளஸ்) என்பது கூட்டலுக்கான கணிதக் குறியீடு ஆகும்.',
        'easy',
        2
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'If you have 6 pencils and buy 3 more, how many do you have now?',
        'உங்களிடம் 6 பென்சில்கள் உள்ளன, மேலும் 3 வாங்கினால் இப்போது மொத்தம் எத்தனை பென்சில்கள் இருக்கும்?',
        '["8", "9", "10", "12"]'::jsonb,
        '9',
        '6 + 3 = 9 பென்சில்கள்.',
        'medium',
        3
    );

-- Insert public demo lesson: Our National Flag (Grade 2 Social Studies)
INSERT INTO public.lessons (id, title_en, title_ta, subject, grade_level, original_content, translated_content, simplified_content_ta, learning_objectives, vocabulary, status, created_by)
VALUES (
    'd3333333-3333-3333-3333-333333333333',
    'Our National Flag',
    'நமது தேசியக் கொடி (Our National Flag)',
    'Social Studies',
    2,
    'The National Flag of India is a horizontal tricolor of saffron, white, and green with the Ashoka Chakra (a 24-spoke wheel in navy blue) in the center. Saffron stands for courage, white stands for peace, and green stands for growth.',
    'இந்தியாவின் தேசியக் கொடி என்பது காவி, வெள்ளை மற்றும் பச்சை ஆகிய மூன்று வண்ணங்களைக் கொண்ட ஒரு மூவர்ணக் கொடியாகும். நடுவில் கடற்படை நீல நிறத்தில் 24 ஆரங்களைக் கொண்ட அசோக சக்கரம் உள்ளது. காவி தைரியத்தையும், வெள்ளை அமைதியையும், பச்சை வளர்ச்சியையும் குறிக்கிறது.',
    'நமது இந்தியத் தேசியக் கொடி ஒரு மூவர்ணக் கொடி ஆகும். இதில் காவி (தைரியம்), வெள்ளை (அமைதி/உண்மை), மற்றும் பச்சை (வளம்) ஆகிய மூன்று வண்ணங்கள் உள்ளன. கொடியின் நடுவே 24 கம்பிகளைக் கொண்ட நீல நிற அசோகச் சக்கரம் அமைந்துள்ளது.',
    '["Identify the three colors of the flag", "Describe the meaning of each color", "Explain what the Ashoka Chakra is"]'::jsonb,
    '[{"en": "National Flag", "ta": "தேசியக் கொடி"}, {"en": "Saffron", "ta": "காவி நிறம்"}, {"en": "Peace", "ta": "அமைதி"}, {"en": "Ashoka Chakra", "ta": "அசோக சக்கரம்"}]'::jsonb,
    'published',
    NULL
);

-- Insert questions for Flag
INSERT INTO public.quiz_questions (lesson_id, question_en, question_ta, options, correct_answer, explanation_ta, difficulty, question_order)
VALUES 
    (
        'd3333333-3333-3333-3333-333333333333',
        'How many colors are in the Indian National Flag?',
        'இந்தியத் தேசியக் கொடியில் எத்தனை வண்ணங்கள் உள்ளன?',
        '["2", "3", "4", "5"]'::jsonb,
        '3',
        'தேசியக் கொடி மூவர்ணக் கொடி எனப்படும், இதில் காவி, வெள்ளை, பச்சை ஆகிய மூன்று வண்ணங்கள் உள்ளன.',
        'easy',
        1
    ),
    (
        'd3333333-3333-3333-3333-333333333333',
        'What does the white color in our national flag stand for?',
        'தேசியக் கொடியில் உள்ள வெள்ளை நிறம் எதைக் குறிக்கிறது?',
        '["Courage (தைரியம்)", "Peace and Truth (அமைதி மற்றும் உண்மை)", "Growth (வளர்ச்சி)", "Strength (வலிமை)"]'::jsonb,
        'Peace and Truth (அமைதி மற்றும் உண்மை)',
        'வெள்ளை நிறம் அமைதி மற்றும் உண்மையைக் குறிக்கிறது.',
        'easy',
        2
    ),
    (
        'd3333333-3333-3333-3333-333333333333',
        'How many spokes are in the Ashoka Chakra?',
        'அசோக சக்கரத்தில் எத்தனை ஆரங்கள் (கம்பிகள்) உள்ளன?',
        '["20", "22", "24", "26"]'::jsonb,
        '24',
        'தேசியக் கொடியின் நடுவே அமைந்துள்ள அசோக சக்கரத்தில் 24 ஆரங்கள் உள்ளன.',
        'medium',
        3
    );
