import { useState } from "react";
import QuizLanding from "@/components/QuizLanding";
import QuizInterface, { QuizStats } from "@/components/QuizInterface";
import QuizComplete from "@/components/QuizComplete";
import questionsData from "@/data/questions.json";

type GameState = "landing" | "quiz" | "complete";

interface Question {
  id: number;
  question: string;
  answer: string;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [teamName, setTeamName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);

  const getRandomQuestions = (): Question[] => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25);
  };

  const handleStart = (name: string) => {
    setTeamName(name);
    setSelectedQuestions(getRandomQuestions());
    setGameState("quiz");
  };

  const handleComplete = (stats: QuizStats) => {
    setQuizStats(stats);
    setGameState("complete");
  };


  return (
    <>
      {gameState === "landing" && <QuizLanding onStart={handleStart} />}
      {gameState === "quiz" && (
        <QuizInterface
          teamName={teamName}
          questions={selectedQuestions}
          onComplete={handleComplete}
        />
      )}
      {gameState === "complete" && quizStats && (
        <QuizComplete stats={quizStats} />
      )}
    </>
  );
};

export default Index;
