import { Layout } from "@/components/layout";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Briefcase, GraduationCap, Gavel, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComparePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const ward = searchParams.get('ward');
  const candidateId = searchParams.get('id');

  const candidates = ward 
    ? MOCK_CANDIDATES.filter(c => c.ward === ward)
    : candidateId 
      ? MOCK_CANDIDATES.filter(c => c.id === candidateId)
      : [];

  if (candidates.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto p-20 text-center">
          <h2 className="text-2xl font-serif font-bold">No candidates found for comparison in this ward.</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            {candidates.length > 1 ? `Compare Candidates: ${ward || candidates[0].ward}` : `Candidate Details: ${candidates[0].name}`}
          </h1>
          <p className="text-lg text-muted-foreground">
            {candidates.length > 1 
              ? "Side-by-side comparison of all verified candidates contesting in this ward."
              : "Detailed breakdown of metrics for the selected candidate."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 overflow-x-auto">
        <Table className="min-w-[800px] border">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px] font-bold py-6 text-primary">Metric</TableHead>
              {candidates.map(c => (
                <TableHead key={c.id} className="text-center py-6">
                  <div className="flex flex-col items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-20 h-20 rounded-xl object-cover border-2 border-background shadow-sm" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-primary text-base leading-tight">{c.name}</div>
                      <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{c.party}</Badge>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium bg-muted/20">Criminal Cases</TableCell>
              {candidates.map(c => (
                <TableCell key={c.id} className="text-center font-bold">
                  <span className={c.criminalCases > 0 ? "text-destructive" : "text-green-600"}>
                    {c.criminalCases}
                  </span>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium bg-muted/20">Education</TableCell>
              {candidates.map(c => (
                <TableCell key={c.id} className="text-center text-sm">{c.education}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium bg-muted/20">Net Assets</TableCell>
              {candidates.map(c => (
                <TableCell key={c.id} className="text-center font-semibold">{c.assets}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium bg-muted/20">Attendance</TableCell>
              {candidates.map(c => (
                <TableCell key={c.id} className="text-center">
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-12 bg-muted h-2 rounded-full overflow-hidden">
                       <div className="bg-primary h-full" style={{ width: `${c.attendance}%` }}></div>
                     </div>
                     <span className="text-xs font-bold">{c.attendance}%</span>
                   </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium bg-muted/20">Manifesto Score</TableCell>
              {candidates.map(c => {
                const score = Math.round((c.promises.filter(p => p.status === 'completed').length / c.promises.length) * 100);
                return (
                  <TableCell key={c.id} className="text-center font-bold text-lg text-primary">
                    {score}%
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
