import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Coins, SkipForward, Send, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useCopyProtection } from "@/hooks/useCopyProtection";

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface QuizInterfaceProps {
  teamName: string;
  questions: Question[];
  onComplete: (stats: QuizStats) => void;
}

export interface QuizStats {
  teamName: string;
  creditsRemaining: number;
  questionsAnswered: number;
  questionsSkipped: number;
  correctAnswers: number;
  wrongAnswers: number;
  completionTimeSeconds: number;
}

const QuizInterface = ({ teamName, questions, onComplete }: QuizInterfaceProps) => {
  useCopyProtection();
  
  const [startTime] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [credits, setCredits] = useState(100);
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    questionsSkipped: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    setFeedback(null);
    setAnswer("");
    setAttempts(0);
  }, [currentIndex]);

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error("Please enter an answer!");
      return;
    }

    const isCorrect = normalizeString(answer) === normalizeString(currentQuestion.answer);
    const isLastQuestion = currentIndex === questions.length - 1;
    let finalCredits = credits;

    if (isCorrect) {
      setStats(prev => ({ ...prev, correctAnswers: prev.correctAnswers + 1, questionsAnswered: prev.questionsAnswered + 1 }));
      toast.success("Correct! No credits deducted! 🎉", {
        duration: isLastQuestion ? 1000 : 2000,
      });
      
      if (isLastQuestion) {
        setTimeout(() => {
          completeQuiz(finalCredits);
        }, 1000);
      } else {
        setFeedback("correct");
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 2000);
      }
    } else {
      // Wrong answer logic
      const currentAttempt = attempts + 1;
      setAttempts(currentAttempt);
      
      if (currentAttempt === 1) {
        // First wrong attempt - no credit deduction, allow retry
        toast.warning("Wrong! You have one more chance to answer.", {
          duration: 2000,
        });
        setFeedback("wrong");
        setAnswer("");
        setTimeout(() => {
          setFeedback(null);
        }, 2000);
      } else {
        // Second wrong attempt - deduct credits and move on
        finalCredits = Math.max(0, credits - 5);
        setCredits(finalCredits);
        setStats(prev => ({ ...prev, wrongAnswers: prev.wrongAnswers + 1, questionsAnswered: prev.questionsAnswered + 1 }));
        toast.error(`Wrong again! -5 credits. Correct answer: ${currentQuestion.answer}`, {
          duration: isLastQuestion ? 1000 : 3000,
        });
        
        if (isLastQuestion) {
          setTimeout(() => {
            completeQuiz(finalCredits);
          }, 1000);
        } else {
          setFeedback("wrong");
          setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
          }, 2000);
        }
      }
    }
  };

  const handleSkip = () => {
    const finalCredits = Math.max(0, credits - 10);
    setCredits(finalCredits);
    setStats(prev => ({ ...prev, questionsSkipped: prev.questionsSkipped + 1 }));
    toast.warning("Question skipped! -10 credits", {
      duration: 2000,
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      completeQuiz(finalCredits);
    }
  };

  const completeQuiz = (finalCredits: number = credits) => {
    const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);
    onComplete({
      teamName,
      creditsRemaining: finalCredits,
      ...stats,
      completionTimeSeconds,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header with Credits */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-6 box-glow-cyan backdrop-blur-sm">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="text-xl font-bold text-primary">{teamName}</p>
            </div>
            <div className="flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-lg border-2 border-primary">
              <Coins className="w-6 h-6 text-accent animate-pulse" />
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold text-primary text-glow-cyan">{credits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-secondary font-semibold">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>

        {/* Question Card */}
        <div className="bg-card border-2 border-secondary/30 rounded-lg p-8 box-glow-purple backdrop-blur-sm animate-slide-up">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-accent font-semibold mb-2">QUESTION</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {feedback && (
              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                feedback === "correct" 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-destructive/10 border-destructive text-destructive"
              }`}>
                {feedback === "correct" ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <p className="font-semibold">Correct Answer!</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    <p className="font-semibold">
                      {attempts === 2 ? `Wrong! Correct: ${currentQuestion.answer}` : "Wrong! Try again!"}
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="space-y-4">
              <label htmlFor="answer" className="block text-sm font-semibold text-muted-foreground">
                Your Answer
              </label>
              <Input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !feedback && handleSubmit()}
                placeholder="Type your answer here..."
                disabled={feedback !== null}
                className="h-14 text-lg bg-input border-2 border-primary/30 focus:border-primary text-foreground"
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleSubmit}
                disabled={feedback !== null || !answer.trim()}
                className="flex-1 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground box-glow-cyan transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Answer
              </Button>
              <Button
                onClick={handleSkip}
                disabled={feedback !== null}
                variant="outline"
                className="h-14 px-8 text-lg font-bold border-2 border-accent text-accent hover:bg-accent/10 box-glow-pink transition-all"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip (-10)
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-primary/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="bg-card border border-destructive/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.wrongAnswers}</p>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </div>
          <div className="bg-card border border-accent/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">{stats.questionsSkipped}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </div>
          <div className="bg-card border border-secondary/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{stats.questionsAnswered}</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
