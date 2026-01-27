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
  Loader2,
  AlertTriangle,
  User,
  Flag,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Candidate } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getCandidateImage } from "@/lib/candidate-utils";

export default function CandidateProfile() {
  const [, params] = useRoute("/candidate/:id");
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

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

  const reportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate?.id,
          candidateName: candidate?.name,
          reason: reportReason,
          description: reportDescription
        })
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in to report a candidate.");
        }
        throw new Error("Failed to submit report");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsReportDialogOpen(false);
      setReportReason("");
      setReportDescription("");
      toast({ title: "Report submitted successfully", description: "Admins will review your report." });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

              <img
                src={getCandidateImage(candidate)}
                alt={candidate.name}
                className="relative w-48 h-48 rounded-xl object-cover shadow-xl border-4 border-background"
              />
              <div className="absolute -bottom-3 -right-3 bg-background p-2 rounded-full shadow-lg border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {candidate.party[0]}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                <div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 mb-2">
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                      {candidate.party}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">
                      <MapPin size={12} className="mr-1" /> {candidate.constituency}
                    </Badge>
                    <Badge variant="outline" className="border-muted bg-muted/20">
                      {candidate.ward.startsWith('Ward') ? candidate.ward : `Ward ${candidate.ward}`}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                    {candidate.name}
                    {candidate.gender && <span className="text-2xl text-muted-foreground font-sans font-normal ml-2">({candidate.gender})</span>}
                  </h1>
                  <p className="text-muted-foreground mt-2 max-w-2xl">{candidate.bio}</p>
                </div>



                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={async () => {
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: `Candidate Profile: ${candidate.name}`,
                            text: `Check out the profile and report card of ${candidate.name} on JanTrack Mumbai!`,
                            url: window.location.href,
                          });
                        } else {
                          await navigator.clipboard.writeText(window.location.href);
                          toast({ title: "Link Copied", description: "Profile link copied to clipboard." });
                        }
                      } catch (err) {
                        console.error('Error sharing:', err);
                        toast({ title: "Share failed", description: "Could not share or copy link.", variant: "destructive" });
                      }
                    }}
                  >
                    <Share2 size={16} /> Share
                  </Button>

                  <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300">
                        <Flag size={16} /> Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report Candidate</DialogTitle>
                        <DialogDescription>
                          Select a reason for reporting this candidate. Your report will be reviewed by admins.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="reason">Reason</Label>
                          <Select onValueChange={setReportReason} value={reportReason}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="False Information">False Information</SelectItem>
                              <SelectItem value="Hate Speech">Hate Speech</SelectItem>
                              <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                              <SelectItem value="Spam">Spam</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            placeholder="Provide more details..."
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => reportMutation.mutate()}
                          disabled={!reportReason || reportMutation.isPending}
                        >
                          {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>



              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-6">
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
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 border-b rounded-none h-auto md:bg-muted/50 md:p-1 md:rounded-full md:border md:justify-center no-scrollbar">
            <TabsTrigger value="manifesto" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none md:rounded-full md:border-b-0 md:data-[state=active]:bg-background md:data-[state=active]:shadow px-4 md:px-6 py-2 md:py-1.5 whitespace-nowrap">Manifesto Tracker</TabsTrigger>
            <TabsTrigger value="funds" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none md:rounded-full md:border-b-0 md:data-[state=active]:bg-background md:data-[state=active]:shadow px-4 md:px-6 py-2 md:py-1.5 whitespace-nowrap">Funds & Projects</TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none md:rounded-full md:border-b-0 md:data-[state=active]:bg-background md:data-[state=active]:shadow px-4 md:px-6 py-2 md:py-1.5 whitespace-nowrap">Public Feedback</TabsTrigger>
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

            {/* Official Manifesto Download Link */}
            {(() => {
              const party = candidate.party;
              let manifestoUrl = null;

              if (party === 'BJP' || party === 'Shiv Sena') {
                manifestoUrl = "https://www.devendrafadnavis.in/bmc26manifesto-english/";
              } else if (['Shiv Sena (UBT)', 'Shiv Sena(UBT)', 'MNS', 'Maharashtra Navnirman Sena'].includes(party)) {
                manifestoUrl = "https://drive.google.com/file/d/16UeIBWKki2QrqrQCZtsiWbGv7y3vhVXJ/view";
              }

              if (!manifestoUrl) return null;

              return (
                <div className="mt-4 flex justify-center">
                  <a
                    href={manifestoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="link" size="sm" className="gap-2 text-muted-foreground hover:text-primary h-auto py-1 text-xs">
                      <FileText size={12} />
                      Download Official Manifesto PDF
                    </Button>
                  </a>
                </div>
              );
            })()}
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
        </Tabs>
      </div>
    </Layout>
  );
}
