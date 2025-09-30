-- Create admin function to get all quiz results
CREATE OR REPLACE FUNCTION public.get_all_quiz_results()
RETURNS TABLE (
  id uuid,
  team_name text,
  credits_remaining integer,
  questions_answered integer,
  questions_skipped integer,
  correct_answers integer,
  wrong_answers integer,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    id,
    team_name,
    credits_remaining,
    questions_answered,
    questions_skipped,
    correct_answers,
    wrong_answers,
    created_at
  FROM public.quiz_results
  ORDER BY created_at DESC;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_all_quiz_results() TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_quiz_results() TO authenticated;