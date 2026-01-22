import { Layout } from "@/components/layout";
import { CandidateCard } from "@/components/candidate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

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

function Counter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) => Math.round(latest).toLocaleString());

  return <span ref={ref} className="tabular-nums">{prefix}<motion.span>{displayValue}</motion.span>{suffix}</span>;
}

export default function Home() {
  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop"} alt="Civic Data Map" className="w-full h-full object-cover" />
        </motion.div>

        {/* Blue Tint Overlay - Comes in after image */}
        <motion.div
          className="absolute inset-0 z-1 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        ></motion.div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
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
          </motion.div>


        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">
                <Counter value={1240} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Candidates Tracked</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">
                <Counter value={450} prefix="₹" suffix="Cr" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Funds Monitored</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">
                <Counter value={5600} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Promises Logged</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-primary font-serif">
                <Counter value={25000} suffix="+" />
              </div>
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
            {candidates.slice(0, 3).map((candidate) => (
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

          <motion.div
            className="grid md:grid-cols-3 gap-10"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Manifesto Tracker</h3>
              <p className="text-muted-foreground leading-relaxed">
                We digitize election manifestos and track the status of every single promise made, updating them with real-world evidence.
              </p>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-foreground mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">MPLAD Fund Watch</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize how your constituency development funds are being allocated and utilized down to the specific project.
              </p>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="bg-card p-8 rounded-2xl border hover:border-primary/20 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Citizen Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verified constituents can report issues and rate the progress of local projects, creating a feedback loop for leaders.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
