-- ============================================================
-- MozhiLearn Migration: 002_secure_role_policy.sql
-- Prevent unauthorized role changes via RLS / Triggers
-- ============================================================

-- Function & Trigger to prevent users from modifying their own role column
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If the role is being altered and the caller is not service_role or admin
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Changing user role is not permitted.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prevent_role_change ON public.profiles;

CREATE TRIGGER trigger_prevent_role_change
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_change();
