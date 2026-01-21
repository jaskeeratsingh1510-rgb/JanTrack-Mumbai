import { Link, useLocation } from "wouter";
import { Search, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:bg-primary/90 transition-colors">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-primary">JanTrack Mumbai</span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/"><a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</a></Link>
            <Link href="/candidates"><a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/candidates' ? 'text-primary' : 'text-muted-foreground'}`}>Candidates</a></Link>
            <Link href="/ward-map"><a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/ward-map' ? 'text-primary' : 'text-muted-foreground'}`}>Ward Map</a></Link>
            <Link href="/dashboard"><a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>Dashboard</a></Link>
            <Link href="/report-issue"><a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/report-issue' ? 'text-primary' : 'text-muted-foreground'}`}>Report Issue</a></Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button size="sm" variant="default" className="rounded-full px-6 font-medium">Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-4">
              <Link href="/"><a className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</a></Link>
              <Link href="/ward-map"><a className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>Ward Map</a></Link>
              <Link href="/dashboard"><a className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</a></Link>
              <Link href="/report-issue"><a className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>Report Issue</a></Link>
            </nav>
            <div className="pt-4 border-t">
              <Link href="/login">
                <Button className="w-full rounded-full" onClick={() => setIsMenuOpen(false)}>Login</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              <span className="text-xl font-serif font-bold text-primary">JanTrack Mumbai</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering citizens with verified data for informed democratic participation. Transparency builds trust.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Candidate Search</a></li>
              <li><a href="#" className="hover:text-primary">Manifesto Tracker</a></li>
              <li><a href="#" className="hover:text-primary">Fund Utilization</a></li>
              <li><a href="#" className="hover:text-primary">Report Issue</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Voter Guide</a></li>
              <li><a href="#" className="hover:text-primary">Election Schedule</a></li>
              <li><a href="#" className="hover:text-primary">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">X</div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">In</div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">Fb</div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2026 JanTrack Mumbai Foundation. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
