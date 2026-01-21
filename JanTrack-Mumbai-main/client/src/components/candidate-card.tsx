import { Link } from "wouter";
import { Candidate } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, Briefcase, GraduationCap, ArrowLeftRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  // Calculate average promise completion
  const completedPromises = candidate.promises.filter(p => p.status === 'completed').length;
  const totalPromises = candidate.promises.length;
  const progress = Math.round((completedPromises / totalPromises) * 100);

  return (
    <Card className="group overflow-hidden border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="absolute top-4 right-4">
          <Badge variant={candidate.criminalCases > 0 ? "destructive" : "secondary"} className="font-medium">
            {candidate.criminalCases > 0 ? (
              <span className="flex items-center gap-1">
                <AlertCircle size={12} /> {candidate.criminalCases} Criminal Cases
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} /> Clean Record
              </span>
            )}
          </Badge>
        </div>
      </div>
      
      <div className="px-6 -mt-12 relative z-10">
        <div className="relative">
          <img 
            src={candidate.image} 
            alt={candidate.name}
            className="w-24 h-24 rounded-xl object-cover border-4 border-background shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 border shadow-sm" title="Party Symbol">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {candidate.party[0]}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pt-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif font-bold text-xl text-primary group-hover:text-secondary-foreground transition-colors">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground font-medium">{candidate.party} • {candidate.ward} ({candidate.constituency})</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap size={16} />
            <span className="truncate" title={candidate.education}>{candidate.education}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase size={16} />
            <span>{candidate.assets}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Promise Fulfillment</span>
            <span className={progress >= 50 ? "text-green-600" : "text-amber-600"}>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex flex-col gap-2">
        <Link href={`/candidate/${candidate.id}`}>
          <Button className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Report Card
          </Button>
        </Link>
        <Link href={`/compare?id=${candidate.id}`}>
          <Button variant="outline" className="w-full rounded-full gap-2 border-secondary/30 text-secondary-foreground hover:bg-secondary/10">
            <ArrowLeftRight size={16} /> Compare {candidate.ward} Candidates
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
