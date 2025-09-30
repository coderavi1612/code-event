-- Create quiz results table for storing participant scores
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  credits_remaining INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  questions_skipped INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their quiz results (public quiz)
CREATE POLICY "Anyone can insert quiz results" 
ON public.quiz_results 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read quiz results (for leaderboard)
CREATE POLICY "Anyone can view quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_quiz_results_credits ON public.quiz_results(credits_remaining DESC, created_at ASC);