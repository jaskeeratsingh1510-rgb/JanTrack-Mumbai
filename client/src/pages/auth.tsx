import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const isLogin = location === "/login" || location === "/admin/login";
  const isAdminLogin = location === "/admin/login";
  const isAdminSignup = location === "/admin/signup";
  const isAdmin = isAdminLogin || isAdminSignup;
  const { toast } = useToast();
  const { effectiveTheme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    otp: "",
    role: isAdmin ? "admin" : "user"
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Admin OTP Flow (Only for Login)
      if (isAdminLogin && !otpSent) {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: formData.username })
        });

        if (res.ok) {
          setOtpSent(true);
          toast({ title: "OTP Sent", description: "Check your email for the verification code." });
        } else {
          toast({ title: "Error", description: "Failed to send OTP. Check credentials or try again.", variant: "destructive" });
        }
        return;
      }

      const endpoint = isLogin ? "/api/login" : "/api/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const userData = await res.json();

        if (isAdminLogin && userData.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges.",
            variant: "destructive"
          });
          // Logout immediately if not authorized
          await fetch("/api/logout", { method: "POST" });
          return;
        }

        toast({
          title: "Success",
          description: isLogin ? "Logged in successfully" : "Account created successfully",
        });

        const targetPath = userData.role === 'admin' ? "/admin" : "/";
        setLocation(targetPath);
        window.location.href = targetPath;
      } else {
        const data = await res.text();
        toast({
          title: "Error",
          description: data || "Authentication failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-3 rounded-xl w-fit mb-2">
              <img
                src={effectiveTheme === "dark" ? "/logo-dark.png" : "/logo.png"}
                alt="Application Logo"
                className="w-32 h-32 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-serif font-bold">
              {isLogin
                ? (isAdminLogin ? "Admin Login" : "Welcome Back")
                : (isAdminSignup ? "Admin Registration" : "Create Account")}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your voter profile"
                : "Join JanTrack Mumbai to participate in verified civic feedback"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="role">{!isLogin ? "Register As" : "Login As"}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isAdmin && <SelectItem value="user">User / Voter</SelectItem>}
                    {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="voter-id">{isAdmin ? "Username" : "Username / Voter ID"}</Label>
                <Input
                  id="voter-id"
                  placeholder={isAdmin ? "admin" : "ABC1234567"}
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              {isAdminSignup && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@jantrack.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={otpSent}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    required
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">OTP sent (Mock: Check console)</p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={async () => {
                        const res = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ username: formData.username })
                        });
                        if (res.ok) toast({ title: "OTP Resent", description: "Check your email again." });
                        else toast({ title: "Failed", description: "Could not resend OTP", variant: "destructive" });
                      }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full font-bold h-11 mt-2">
                {isLogin ? (isAdminLogin ? (otpSent ? "Verify & Login" : "Send OTP") : "Sign In") : "Register Now"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <Link href={isAdmin ? "/admin/signup" : "/signup"}>
                    <a className="text-primary font-bold hover:underline">Sign Up</a>
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Link href={isAdminLogin ? "/admin/login" : "/login"}>
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
