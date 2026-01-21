import { Layout } from "@/components/layout";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { CandidateCard } from "@/components/candidate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";


export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop"} alt="Civic Data Map" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40"></div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left-5 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Mumbai Elections 2026 Tracker Live
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Know Your Leader.<br />
              <span className="text-secondary">Vote Informed.</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
              The verified digital report card for every candidate. Track manifesto promises,
              scrutinize funds, and make your vote count with real data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate or constituency..."
                  className="pl-10 h-12 bg-white/90 border-transparent text-foreground placeholder:text-muted-foreground focus:bg-white text-lg shadow-lg"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-secondary text-primary hover:bg-white hover:text-primary font-bold shadow-lg shadow-secondary/20">
                Search
              </Button>
            </div>
          </div>

          <div className="hidden md:block relative animate-in slide-in-from-right-5 duration-1000 delay-200">
            {/* Abstract UI composition */}
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">RK</div>
                  <div>
                    <div className="text-white font-serif font-bold">Rajesh Kumar</div>
                    <div className="text-white/60 text-xs">South City • Progress Party</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">85%</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">Promise Score</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">Metro Expansion</span>
                    <span className="text-secondary text-xs bg-secondary/10 px-2 py-0.5 rounded">In Progress</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[60%]"></div>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">New Public Library</span>
                    <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">Completed</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[100%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">1,240</div>
              <div className="text-sm text-muted-foreground mt-1">Candidates Tracked</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">₹450Cr</div>
              <div className="text-sm text-muted-foreground mt-1">Funds Monitored</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">5,600</div>
              <div className="text-sm text-muted-foreground mt-1">Promises Logged</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">25k+</div>
              <div className="text-sm text-muted-foreground mt-1">Verified Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Candidates */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-3">Trending Candidates</h2>
              <p className="text-muted-foreground max-w-2xl">
                The most viewed candidate profiles in your region this week.
              </p>
            </div>
            <Link href="/candidates">
              <Button variant="outline" className="hidden md:flex">View All Candidates</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_CANDIDATES.slice(0, 3).map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/candidates">
              <Button variant="outline" className="w-full">View All Candidates</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Transparency Tools for Modern Democracy</h2>
            <p className="text-muted-foreground text-lg">
              We aggregate data from government filings, news reports, and official declarations to give you the full picture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Manifesto Tracker</h3>
              <p className="text-muted-foreground leading-relaxed">
                We digitize election manifestos and track the status of every single promise made, updating them with real-world evidence.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-foreground mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">MPLAD Fund Watch</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize how your constituency development funds are being allocated and utilized down to the specific project.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Citizen Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verified constituents can report issues and rate the progress of local projects, creating a feedback loop for leaders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
