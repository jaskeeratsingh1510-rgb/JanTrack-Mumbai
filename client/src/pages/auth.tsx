import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const [location] = useLocation();
  const isLogin = location === "/login";

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-xl w-fit mb-2">
              <ShieldCheck size={32} />
            </div>
            <CardTitle className="text-2xl font-serif font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your voter profile"
                : "Join JanTrack Mumbai to participate in verified civic feedback"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="voter-id">Voter ID / Email</Label>
                <Input id="voter-id" placeholder="ABC1234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full font-bold h-11 mt-2">
                {isLogin ? "Sign In" : "Register Now"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <Link href="/signup">
                    <a className="text-primary font-bold hover:underline">Sign Up</a>
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Link href="/login">
                    <a className="text-primary font-bold hover:underline">Log In</a>
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
