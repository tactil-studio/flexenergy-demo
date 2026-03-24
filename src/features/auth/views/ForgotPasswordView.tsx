import { ArrowLeft, Mail, Send } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            FlexEnergy
          </h1>
          <p className="text-sm text-muted-foreground">
            EnergyDynamics Platform
          </p>
        </div>

        <div className="bg-card p-8 rounded-3xl shadow-xl shadow-border border border-border space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {isSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-success/10 border border-success/20 rounded-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 bg-success/15 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-success" />
              </div>
              <p className="text-sm font-semibold text-success">
                Check your inbox
              </p>
              <p className="text-xs text-success/80 leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="font-bold">{email}</span>.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="w-full py-4 bg-success text-success-foreground rounded-2xl font-bold text-sm hover:bg-success/90 transition-all"
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-xs font-medium text-muted-foreground ml-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-input border-none rounded-2xl focus:ring-2 focus:ring-ring transition-all outline-none text-sm text-foreground"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-4 bg-card border border-border text-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-300">
          © 2026 EnergyDynamics AG
        </p>
      </motion.div>
    </div>
  );
}
