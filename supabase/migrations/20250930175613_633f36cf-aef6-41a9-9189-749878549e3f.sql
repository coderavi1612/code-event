-- Add completion_time column to quiz_results table
ALTER TABLE public.quiz_results 
ADD COLUMN completion_time_seconds integer;

-- Drop and recreate the get_all_quiz_results function to include completion_time
DROP FUNCTION IF EXISTS public.get_all_quiz_results();

CREATE OR REPLACE FUNCTION public.get_all_quiz_results()
 RETURNS TABLE(
   id uuid, 
   team_name text, 
   credits_remaining integer, 
   questions_answered integer, 
   questions_skipped integer, 
   correct_answers integer, 
   wrong_answers integer, 
   completion_time_seconds integer,
   created_at timestamp with time zone
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    id,
    team_name,
    credits_remaining,
    questions_answered,
    questions_skipped,
    correct_answers,
    wrong_answers,
    completion_time_seconds,
    created_at
  FROM public.quiz_results
  ORDER BY created_at DESC;
$function$;