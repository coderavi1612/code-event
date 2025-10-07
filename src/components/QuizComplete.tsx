import { useEffect, useState } from "react";
import { Trophy, Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { QuizStats } from "./QuizInterface";

interface QuizCompleteProps {
  stats: QuizStats;
}

const QuizComplete = ({ stats }: QuizCompleteProps) => {
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    saveResults();
  }, []);

  const saveResults = async () => {
    try {
      const { error } = await (supabase as any).from("quiz_results").insert({
        team_name: stats.teamName,
        credits_remaining: stats.creditsRemaining,
        questions_answered: stats.questionsAnswered,
        questions_skipped: stats.questionsSkipped,
        correct_answers: stats.correctAnswers,
        wrong_answers: stats.wrongAnswers,
        completion_time_seconds: stats.completionTimeSeconds,
      });

      if (error) throw error;

      setSaving(false);
    } catch (error) {
      console.error("Error saving results:", error);
      setSaving(false);
    }
  };


  const getPerformanceMessage = () => {
    if (stats.creditsRemaining >= 90) return "OUTSTANDING! 🌟";
    if (stats.creditsRemaining >= 70) return "EXCELLENT! 🎯";
    if (stats.creditsRemaining >= 50) return "GREAT JOB! 💪";
    if (stats.creditsRemaining >= 30) return "GOOD EFFORT! 👍";
    return "KEEP PRACTICING! 📚";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <Code2 className="w-16 h-16 text-primary mx-auto animate-glow-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-glow-cyan" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            QUIZ COMPLETE!
          </h1>
          <p className="text-xl text-secondary">{getPerformanceMessage()}</p>
        </div>

        {/* Stats Card */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-8 box-glow-cyan backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div>
              <p className="text-lg text-muted-foreground mb-2">Participant</p>
              <p className="text-3xl font-bold text-primary">{stats.teamName}</p>
            </div>

            <div className="inline-flex items-center gap-3 bg-primary/10 px-8 py-4 rounded-lg border-2 border-primary">
              <Trophy className="w-10 h-10 text-accent animate-pulse" />
              <div>
                <p className="text-sm text-muted-foreground">Final Score</p>
                <p className="text-5xl font-bold text-primary text-glow-cyan">{stats.creditsRemaining}</p>
                <p className="text-sm text-muted-foreground">Credits</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-primary/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-primary">{stats.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="bg-card border border-destructive/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-destructive">{stats.wrongAnswers}</p>
                <p className="text-sm text-muted-foreground">Wrong</p>
              </div>
              <div className="bg-card border border-accent/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-accent">{stats.questionsSkipped}</p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
              <div className="bg-card border border-secondary/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-secondary">{stats.questionsAnswered}</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Organized by <span className="text-primary font-bold">Code Club</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you for participating! Keep coding! 💻✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;
