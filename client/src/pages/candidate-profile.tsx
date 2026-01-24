import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FundUtilizationChart } from "@/components/fund-chart";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  GraduationCap,
  Briefcase,
  Gavel,
  Calendar,
  Share2,
  Flag,
  Loader2
} from "lucide-react";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Candidate } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CandidateProfile() {
  const [, params] = useRoute("/candidate/:id");
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);

  const { data: candidate, isLoading, error } = useQuery<Candidate>({
    queryKey: [`/api/candidates/${params?.id}`],
    enabled: !!params?.id
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false
  });

  const { data: feedbacks } = useQuery<any[]>({
    queryKey: [`/api/candidates/${params?.id}/feedback`],
    enabled: !!params?.id
  });

  const feedbackMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/candidates/${params?.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newComment,
          rating,
        })
      });
      if (!res.ok) throw new Error("Failed to post feedback");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/candidates/${params?.id}/feedback`] });
      setNewComment("");
      toast({ title: "Feedback posted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to post feedback", variant: "destructive" });
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !candidate) {
    return <Layout><div className="container mx-auto p-20 text-center">Candidate not found</div></Layout>;
  }

  // Calculate stats
  const completed = candidate.promises.filter(p => p.status === 'completed').length;
  const inProgress = candidate.promises.filter(p => p.status === 'in-progress').length;
  const notStarted = candidate.promises.filter(p => p.status === 'not-started').length;
  const broken = candidate.promises.filter(p => p.status === 'broken').length;
  const total = candidate.promises.length;
  const score = total > 0
    ? Math.round(candidate.promises.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / total)
    : 0;

  return (
    <Layout>
      {/* Profile Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <img
                src={candidate.image}
                alt={candidate.name}
                className="relative w-48 h-48 rounded-xl object-cover shadow-xl border-4 border-background"
              />
              <div className="absolute -bottom-3 -right-3 bg-background p-2 rounded-full shadow-lg border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {candidate.party[0]}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                      {candidate.party}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">
                      <MapPin size={12} className="mr-1" /> {candidate.constituency}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-foreground">{candidate.name}</h1>
                  <p className="text-muted-foreground mt-2 max-w-2xl">{candidate.bio}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 size={16} /> Share
                  </Button>
                  <Button variant="destructive" size="sm" className="gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300">
                    <Flag size={16} /> Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Education</div>
                  <div className="font-semibold flex items-center gap-2">
                    <GraduationCap size={16} className="text-primary" />
                    <span className="truncate">{candidate.education}</span>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Net Assets</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Briefcase size={16} className="text-primary" />
                    {candidate.assets}
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Criminal Record</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Gavel size={16} className={candidate.criminalCases > 0 ? "text-destructive" : "text-green-600"} />
                    {candidate.criminalCases} Cases
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Attendance</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {candidate.attendance}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="manifesto" className="space-y-8">
          <TabsList className="bg-muted/50 p-1 rounded-full border">
            <TabsTrigger value="manifesto" className="rounded-full px-6">Manifesto Tracker</TabsTrigger>
            <TabsTrigger value="funds" className="rounded-full px-6">Funds & Projects</TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-full px-6">Public Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="manifesto" className="space-y-8 animate-in fade-in-50 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Summary Card */}
              <Card className="md:col-span-1 h-fit border-primary/10 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center mb-8">
                    <div className="text-5xl font-serif font-bold text-primary mb-2">{score}%</div>
                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Promise Fulfillment Score</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Completed</span>
                      <span className="font-bold">{completed}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-secondary" /> In Progress</span>
                      <span className="font-bold">{inProgress}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-muted" /> Not Started</span>
                      <span className="font-bold">{notStarted}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center gap-2"><AlertCircle size={16} className="text-destructive" /> Broken</span>
                      <span className="font-bold">{broken}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promises List */}
              <div className="md:col-span-2 space-y-4">
                {candidate.promises.map((promise) => (
                  <Card key={promise.id} className="overflow-hidden border-l-4" style={{
                    borderLeftColor:
                      promise.status === 'completed' ? 'var(--color-green-500)' :
                        promise.status === 'in-progress' ? 'hsl(var(--secondary))' :
                          promise.status === 'broken' ? 'hsl(var(--destructive))' : 'hsl(var(--muted))'
                  }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs uppercase font-normal tracking-wider opacity-70">{promise.category}</Badge>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize
                               ${promise.status === 'completed' ? 'bg-green-100 text-green-700' :
                                promise.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                                  promise.status === 'broken' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }
                             `}>
                              {promise.status.replace('-', ' ')}
                            </span>
                          </div>
                          <h3 className="font-serif font-bold text-xl">{promise.title}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-muted-foreground/50">{promise.completionPercentage}%</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{promise.description}</p>

                      <div className="relative pt-2">
                        <Progress value={promise.completionPercentage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funds" className="animate-in fade-in-50 duration-500">
            <FundUtilizationChart funds={candidate.funds} />
          </TabsContent>

          <TabsContent value="feedback" className="animate-in fade-in-50 duration-500">
            <div className="space-y-8 max-w-3xl mx-auto">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-serif font-bold text-lg">Leave verified feedback</h3>
                  {user ? (
                    <>
                      <Textarea
                        placeholder="Share your experience with this candidate's work..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => feedbackMutation.mutate()}
                          disabled={feedbackMutation.isPending || !newComment.trim()}
                        >
                          {feedbackMutation.isPending ? "Posting..." : "Post Feedback"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 bg-muted/20 rounded-lg">
                      <p className="mb-4 text-muted-foreground">Please log in to leave feedback for this candidate.</p>
                      <Link href="/login">
                        <a className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">Log In</a>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                {feedbacks && feedbacks.length > 0 ? (
                  feedbacks.map((item: any) => (
                    <div key={item._id || item.id} className="flex gap-4 p-4 border rounded-xl bg-card">
                      <Avatar>
                        <AvatarFallback>{item.username ? item.username[0].toUpperCase() : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{item.username}</span>
                          <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No feedback yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs >
      </div >
    </Layout >
  );
}
