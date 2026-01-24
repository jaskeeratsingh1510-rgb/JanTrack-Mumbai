import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function ReportIssue() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [issueType, setIssueType] = useState("");
  const [constituency, setConstituency] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: issues } = useQuery<any[]>({
    queryKey: ["/api/issues"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/issues", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
      toast({
        title: "Issue Reported Successfully",
        description: "Your report has been logged and sent to the verified monitors.",
      });
      setTitle("");
      setDescription("");
      setIssueType("");
      setConstituency("");
      setFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Evidence Required",
        description: "Please upload an image as evidence.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    // Combine type and description for now as backend schema is simple
    formData.append("description", `[Type: ${issueType}] ${description}`);
    formData.append("location", constituency);
    formData.append("image", file);

    uploadMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Report an Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help us maintain transparency. Report civic issues, verified by our team.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle className="font-serif">Submit New Report</CardTitle>
                <CardDescription>All reports are verified by our team before being published.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Issue Type</Label>
                      <Select value={issueType} onValueChange={setIssueType} required>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure Delay</SelectItem>
                          <SelectItem value="manifesto">Manifesto Violation</SelectItem>
                          <SelectItem value="misinformation">Misinformation</SelectItem>
                          <SelectItem value="funds">Fund Misuse</SelectItem>
                          <SelectItem value="other">Other Civic Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="constituency">Constituency</Label>
                      <Select value={constituency} onValueChange={setConstituency} required>
                        <SelectTrigger id="constituency">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai South">Mumbai South</SelectItem>
                          <SelectItem value="Mumbai North West">Mumbai North West</SelectItem>
                          <SelectItem value="Mumbai North East">Mumbai North East</SelectItem>
                          <SelectItem value="Mumbai Central">Mumbai Central</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary of the issue" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Evidence (Photo)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div className="pointer-events-none">
                        {file ? (
                          <div className="flex flex-col items-center text-primary">
                            <ShieldCheck className="h-10 w-10 mb-2" />
                            <p className="font-medium">{file.name}</p>
                          </div>
                        ) : (
                          <>
                            <Camera className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload image</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Reports Section */}
            <div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Recent Verified Reports</h3>
              <div className="grid gap-4">
                {issues?.map((issue: any) => (
                  <Card
                    key={issue._id}
                    className="flex flex-col md:flex-row overflow-hidden cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-muted">
                      <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <h4 className="font-bold text-lg mb-1">{issue.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {issue.location}</span>
                        <span>•</span>
                        <span className="capitalize">{issue.status.replace('_', ' ')}</span>
                        {issue.isVerified ? (
                          <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-green-200">
                            <ShieldCheck size={10} className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-200">
                            Pending Verification
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    </div>
                  </Card>
                ))}
                {issues?.length === 0 && <p className="text-muted-foreground">No public reports yet.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-serif">
                  <ShieldCheck className="text-secondary" />
                  Verification Process
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4 text-muted-foreground leading-relaxed">
                <p>1. <strong>Submission:</strong> Your report is received by our local monitors.</p>
                <p>2. <strong>Fact-Check:</strong> We cross-reference the report with official data and field evidence.</p>
                <p>3. <strong>Publication:</strong> Once verified, the report appears on the candidate's public dashboard.</p>
                <p>4. <strong>Response:</strong> The concerned candidate's office is notified for a response.</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-serif">
                  <AlertTriangle className="text-destructive" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4 text-muted-foreground">
                <p>Avoid personal attacks. Focus on objective civic issues.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold">{selectedIssue?.title}</DialogTitle>
            <DialogDescription>
              Reported on {new Date(selectedIssue?.createdAt || Date.now()).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
              <img
                src={selectedIssue?.imageUrl}
                alt={selectedIssue?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium border border-secondary/20">
                <MapPin size={14} className="mr-1" /> {selectedIssue?.location}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${selectedIssue?.isVerified
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                {selectedIssue?.isVerified ? (
                  <><ShieldCheck size={14} className="mr-1" /> Verified Report</>
                ) : (
                  "Pending Verification"
                )}
              </span>
              <span className="capitalize inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm font-medium border">
                {selectedIssue?.status?.replace('_', ' ') || "Reported"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedIssue?.description}
              </p>
            </div>

            {selectedIssue?.isVerified && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-primary">
                  <ShieldCheck size={18} />
                  Official Response
                </h4>
                <p className="text-sm text-muted-foreground">
                  This report has been verified by our monitoring team. It has been forwarded to the {selectedIssue?.location} municipal ward office for immediate action.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
