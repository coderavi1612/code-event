-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view quiz results" ON public.quiz_results;

-- Create a secure function to get leaderboard (top 10 only)
-- This prevents bulk data extraction while allowing leaderboard display
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  team_name text,
  credits_remaining integer,
  questions_answered integer,
  correct_answers integer,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    team_name,
    credits_remaining,
    questions_answered,
    correct_answers,
    created_at
  FROM public.quiz_results
  ORDER BY credits_remaining DESC, correct_answers DESC, created_at ASC
  LIMIT 10;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;