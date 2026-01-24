import { Layout } from "@/components/layout";
import { CandidateCard } from "@/components/candidate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeftRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";

// Define Candidate Type (matching the one in admin.tsx/API)
export interface Candidate {
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

export default function CandidatesPage() {
  const [location] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialSearch = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [wardFilter, setWardFilter] = useState("all");

  const { data: candidates = [], isLoading, error } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const sortedCandidates = [...candidates].sort((a, b) => {
    return (parseInt(a.id) || 0) - (parseInt(b.id) || 0);
  });

  const filteredCandidates = sortedCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.constituency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = wardFilter === "all" || c.ward === wardFilter;
    return matchesSearch && matchesWard;
  });

  const uniqueWards = Array.from(new Set(candidates.map(c => c.ward))).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
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
          Failed to load candidates.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-4">Mumbai Candidates 2026</h1>
              <p className="text-lg text-muted-foreground">
                Browse and filter through all verified candidates across Mumbai's BMC wards.
              </p>
            </div>
            {wardFilter !== "all" && (
              <Link href={`/compare?ward=${wardFilter}`}>
                <Button className="gap-2 bg-secondary text-primary hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                  <ArrowLeftRight size={18} /> Compare Ward Candidates
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or constituency..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {uniqueWards.map(ward => (
                <SelectItem key={ward} value={ward}>{ward}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No candidates found matching your criteria.
          </div>
        )}
      </div>
    </Layout>
  );
}
