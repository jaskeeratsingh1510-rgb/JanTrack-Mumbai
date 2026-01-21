import { Layout } from "@/components/layout";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { CandidateCard } from "@/components/candidate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState("all");

  const filteredCandidates = MOCK_CANDIDATES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.constituency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = wardFilter === "all" || c.ward === wardFilter;
    return matchesSearch && matchesWard;
  });

  const uniqueWards = Array.from(new Set(MOCK_CANDIDATES.map(c => c.ward))).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

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
