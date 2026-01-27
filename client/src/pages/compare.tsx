import { Layout } from "@/components/layout";
import { useLocation, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Reuse Candidate Interface
interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  ward: string;
  age: number;
  education: string;
  image: string;
  criminalCases: number;
  assets: string;
  attendance: number;
  promises: any[];
  funds: {
    allocated: number;
    utilized: number;
    projects: any[];
  };
  bio: string;
}

export default function ComparePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const ward = searchParams.get('ward');
  const candidateId = searchParams.get('id');

  const { data: allCandidates = [], isLoading, error } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
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

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh] text-destructive">
          Failed to load candidates for comparison.
        </div>
      </Layout>
    );
  }

  let candidates: Candidate[] = [];
  if (ward) {
    candidates = allCandidates.filter(c => c.ward === ward);
  } else if (candidateId) {
    const mainCandidate = allCandidates.find(c => c.id === candidateId);
    if (mainCandidate) {
      candidates = allCandidates.filter(c => c.ward === mainCandidate.ward);
    }
  }

  if (candidates.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto p-20 text-center">
          <h2 className="text-2xl font-serif font-bold">No candidates found for comparison in this ward.</h2>
        </div>
      </Layout>
    );
  }

  const currentWard = ward || candidates[0].ward;

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            {candidates.length > 1 ? `Compare Candidates: ${currentWard}` : `Candidate Details: ${candidates[0].name}`}
          </h1>
          <p className="text-lg text-muted-foreground">
            {candidates.length > 1
              ? "Row-by-row comparison of candidate credentials and key manifesto promises."
              : "Detailed breakdown of metrics for the selected candidate."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 overflow-x-auto">
        <Table className="min-w-[1000px] border shadow-sm">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold py-6 text-primary border-r w-[250px]">Candidate</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r w-[120px]">Criminal Cases</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r w-[180px]">Education</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r w-[150px]">Net Assets</TableHead>
              <TableHead className="font-bold py-6 text-primary border-r w-[350px]">Key Manifesto Promises</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary w-[120px]">Promise Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map(c => {
              // The instruction asked to replace the score calculation logic, but provided the existing logic.
              // Assuming the intent was to keep the existing logic as no new logic was provided.
              const score = c.promises.length > 0
                ? Math.round(c.promises.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / c.promises.length)
                : 0;

              return (
                <TableRow key={c.id} className="hover:bg-muted/5">
                  <TableCell className="border-r py-6">
                    <Link href={`/candidate/${c.id}`}>
                      <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={c.image} alt={c.name} className="w-16 h-16 rounded-xl object-cover border-2 border-background shadow-sm" />
                        <div>
                          <div className="font-serif font-bold text-primary text-base leading-tight">{c.name}</div>
                          <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{c.party}</Badge>
                          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter font-bold">{c.ward}</div>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg border-r">
                    <span className={c.criminalCases > 0 ? "text-destructive" : "text-green-600"}>
                      {c.criminalCases}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium border-r">{c.education}</TableCell>
                  <TableCell className="text-center font-bold border-r">{c.assets}</TableCell>
                  <TableCell className="border-r py-4 px-6">
                    <ul className="space-y-3">
                      {c.promises.slice(0, 2).map((p, i) => (
                        <li key={i} className="text-xs flex gap-2 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-primary/80 uppercase tracking-tighter text-[9px]">{p.category}</span>
                            <span className="italic text-muted-foreground leading-tight">{p.title}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-serif font-bold text-primary">{score}%</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Promise Score</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
