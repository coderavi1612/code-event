import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Users, Target, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuizResult {
  id: string;
  team_name: string;
  credits_remaining: number;
  questions_answered: number;
  questions_skipped: number;
  correct_answers: number;
  wrong_answers: number;
  completion_time_seconds: number | null;
  created_at: string;
}

interface Stats {
  totalSubmissions: number;
  averageScore: number;
  averageCredits: number;
  topScore: number;
}

const AdminDashboard = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    averageScore: 0,
    averageCredits: 0,
    topScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllResults();
  }, []);

  const fetchAllResults = async () => {
    try {
      const { data, error } = await (supabase as any).rpc("get_all_quiz_results");

      if (error) throw error;

      setResults(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: QuizResult[]) => {
    if (data.length === 0) {
      setStats({
        totalSubmissions: 0,
        averageScore: 0,
        averageCredits: 0,
        topScore: 0,
      });
      return;
    }

    const totalSubmissions = data.length;
    const averageScore = Math.round(
      data.reduce((sum, r) => sum + r.correct_answers, 0) / totalSubmissions
    );
    const averageCredits = Math.round(
      data.reduce((sum, r) => sum + r.credits_remaining, 0) / totalSubmissions
    );
    const topScore = Math.max(...data.map((r) => r.credits_remaining));

    setStats({
      totalSubmissions,
      averageScore,
      averageCredits,
      topScore,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Code Club Quiz - Performance Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-xs text-muted-foreground">correct answers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Credits</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCredits}</div>
              <p className="text-xs text-muted-foreground">remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topScore}</div>
              <p className="text-xs text-muted-foreground">credits remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Quiz Submissions</CardTitle>
            <CardDescription>Complete list of all quiz attempts with detailed metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead className="text-right">Correct</TableHead>
                    <TableHead className="text-right">Wrong</TableHead>
                    <TableHead className="text-right">Skipped</TableHead>
                    <TableHead className="text-right">Total Answered</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No submissions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.team_name}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {result.credits_remaining}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {result.correct_answers}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {result.wrong_answers}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {result.questions_skipped}
                        </TableCell>
                        <TableCell className="text-right">{result.questions_answered}</TableCell>
                        <TableCell className="text-right font-medium text-secondary">
                          {formatTime(result.completion_time_seconds)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(result.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
