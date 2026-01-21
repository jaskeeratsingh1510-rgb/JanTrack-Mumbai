import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ReportIssue() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Issue Reported Successfully",
        description: "Your report has been logged and sent to the verified monitors.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Report an Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help us maintain transparency. Report civic issues, manifesto violations, or misinformation in your constituency.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
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
                      <Select required>
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
                      <Select required>
                        <SelectTrigger id="constituency">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="south">Mumbai South</SelectItem>
                          <SelectItem value="north-west">Mumbai North West</SelectItem>
                          <SelectItem value="north-east">Mumbai North East</SelectItem>
                          <SelectItem value="central">Mumbai Central</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title</Label>
                    <Input id="title" placeholder="Brief summary of the issue" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Provide specific details, dates, and names if applicable..." 
                      className="min-h-[150px]"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Evidence (Photos/Documents)</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                      <Camera className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop files</p>
                      <p className="text-xs text-muted-foreground/60">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Verified Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
                <p>Avoid personal attacks or defamatory language. Focus on objective facts, evidence, and civic progress.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
