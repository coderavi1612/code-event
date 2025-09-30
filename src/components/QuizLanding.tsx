import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Zap, Trophy } from "lucide-react";
import { teamNameSchema } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

interface QuizLandingProps {
  onStart: (teamName: string) => void;
}

const QuizLanding = ({ onStart }: QuizLandingProps) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = teamNameSchema.safeParse(teamName);
    
    if (!result.success) {
      toast({
        title: "Invalid Team Name",
        description: result.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    
    onStart(result.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          {/* <div className="flex justify-center">
            <div className="relative">
              <Code2 className="w-20 h-20 text-primary animate-glow-pulse" />
              <Zap className="w-8 h-8 text-accent absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div> */}
          <div className="flex items-center justify-center">
          <img src="fevicon-1.png" alt="Code-Club"  className="w-80 h-80 -mb-24 -mt-32"/></div>
          {/* <h1 className="text-5xl md:text-7xl font-bold text-glow-cyan" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            CODE CLUB
          </h1> */}
          <p className="text-2xl md:text-4xl text-secondary text-glow-purple" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            QUIZ CHALLENGE
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-8 box-glow-cyan backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-primary">Competition Rules</h2>
            </div>
            
            <div className="grid gap-4 text-foreground/90">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">Starting Credits: <span className="text-green-500"> 100 Credits</span></p>
                  <p className="text-sm text-muted-foreground">Keep your credits high to win!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 border border-secondary">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-secondary">Wrong Answer: <span className="text-red-500"> &nbsp;- 5 Credits</span> </p>
                  <p className="text-sm text-muted-foreground">Think carefully before submitting!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 border border-accent">
                  <span className="text-accent font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-accent">Skipped Question: <span className="text-red-500"> &nbsp;-10 Credits</span> </p>
                  <p className="text-sm text-muted-foreground">It's better to try than skip!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">10 Random Questions</p>
                  <p className="text-sm text-muted-foreground">From a pool of 50 questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card border-2 border-secondary/30 rounded-lg p-6 box-glow-purple backdrop-blur-sm">
            <label htmlFor="teamName" className="block text-lg font-semibold text-secondary mb-3">
              Enter Your Name / Team Name
            </label>
            <Input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Team Alpha or John Doe"
              className="h-14 text-lg bg-input border-2 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground box-glow-cyan transition-all duration-300 hover:scale-[1.02]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            START QUIZ
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm">
          Powered by <span className="text-primary font-semibold">Code Club</span> • Good Luck! 🚀
        </p>
      </div>
    </div>
  );
};

export default QuizLanding;
