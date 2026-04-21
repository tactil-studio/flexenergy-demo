import { Chrome, Lock, LogIn, Mail, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

export function LoginView({ onShowForgot }: { onShowForgot: () => void }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-white/15 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-white tracking-tight">FlexEnergy</span>
          </div>
          <h1 className="font-heading font-bold text-4xl xl:text-5xl leading-tight text-white mb-4">
            Your energy,<br />always in hand.
          </h1>
          <p className="text-white/60 text-base max-w-xs">
            Monitor consumption, top up your balance, and stay in control — anytime, anywhere.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {["Real-time balance & consumption", "Instant top-ups in seconds", "Smart depletion alerts"].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
              <span className="text-sm text-white/70">{t}</span>
            </div>
          ))}
          <p className="text-xs text-white/30 pt-4">© 2026 EnergyDynamics AG</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile brand header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Zap className="size-6 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground">FlexEnergy</h1>
            <p className="text-sm text-muted-foreground">EnergyDynamics Platform</p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-sm border border-border space-y-6">
            <div className="hidden lg:block">
              <h2 className="font-heading font-bold text-2xl text-foreground">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  icon={<Mail className="size-4" />}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="size-4" />}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onShowForgot}
                  className="text-primary hover:text-primary/80 px-0"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                <LogIn className="size-4" />
                Sign in
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => loginWithGoogle()}
              className="w-full"
            >
              <Chrome className="size-4" />
              Continue with Google
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button type="button" variant="ghost" size="sm" className="text-primary hover:text-primary/80 px-0">
                Create one
              </Button>
            </p>
          </div>

          <p className="lg:hidden text-center text-xs text-muted-foreground/50">
            © 2026 EnergyDynamics AG
          </p>
        </motion.div>
      </div>
    </div>
  );
}
