import { Link, useLocation } from "wouter";
import { Search, Menu, X, ShieldCheck, Twitter, Facebook, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useQuery<User>({ queryKey: ["/api/user"], retry: false });
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST" });
    },
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: () => {
      toast({ title: "Logout failed", variant: "destructive" });
    },
  });

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
            {[
              ['Home', '/'],
              ['Candidates', '/candidates'],
              ['Ward Map', '/ward-map'],
              ['Dashboard', '/dashboard'],
              ['Report Issue', '/report-issue']
            ].map(([label, path]) => (
              <Link key={path} href={path}>
                <a className={`text-sm font-medium transition-colors relative py-1 ${location === path ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  {label}
                  {location === path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 top-full block h-[2px] w-full bg-secondary"
                    />
                  )}
                </a>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-medium text-sm">
                    Hi, {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="default" className="rounded-full px-6 font-medium">Login</Button>
              </Link>
            )}
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
              {user ? (
                <div className="space-y-2">
                  <div className="w-full text-center font-medium py-2">Hi, {user.username}</div>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="w-full rounded-full" onClick={() => setIsMenuOpen(false)}>Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground dark:bg-white dark:text-slate-900 py-16 mt-20">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 dark:bg-slate-100 p-2 rounded-lg">
                <ShieldCheck className="text-white dark:text-primary" size={24} />
              </div>
              <span className="text-2xl font-serif font-bold text-white dark:text-slate-900 tracking-tight">JanTrack</span>
            </div>
            <p className="text-primary-foreground/80 dark:text-slate-600 text-sm leading-relaxed max-w-xs">
              Empowering Mumbai citizens with verified data for informed democratic participation. Transparency builds trust.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-100 flex items-center justify-center hover:bg-white dark:hover:bg-primary hover:text-primary dark:hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-100 flex items-center justify-center hover:bg-white dark:hover:bg-primary hover:text-primary dark:hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-100 flex items-center justify-center hover:bg-white dark:hover:bg-primary hover:text-primary dark:hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-100 flex items-center justify-center hover:bg-white dark:hover:bg-primary hover:text-primary dark:hover:text-white transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-white dark:text-slate-900">Platform</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70 dark:text-slate-600">
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Candidate Search</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Manifesto Tracker</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Fund Utilization</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Report Issue</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-white dark:text-slate-900">Legal & Help</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70 dark:text-slate-600">
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Voter Guide</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg text-white dark:text-slate-900">Stay Informed</h4>
            <p className="text-sm text-primary-foreground/70 dark:text-slate-600">
              Get the latest candidate analysis and ward reports directly in your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 dark:bg-slate-100 border border-white/20 dark:border-slate-200 rounded-md px-4 py-2 text-sm text-white dark:text-slate-900 placeholder:text-white/50 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <Button className="w-full bg-secondary text-primary hover:bg-white dark:hover:bg-primary dark:hover:text-white font-bold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 dark:border-slate-200 text-center text-sm text-primary-foreground/50 dark:text-slate-400">
          © 2026 JanTrack Mumbai Foundation. All rights reserved. • Built for Democracy.
        </div>
      </footer>
    </div>
  );
}
