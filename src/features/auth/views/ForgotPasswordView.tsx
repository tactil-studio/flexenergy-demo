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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            FlexEnergy
          </h1>
          <p className="text-sm text-slate-400">
            EnergyDynamics Platform
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {isSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-green-900">
                Check your inbox
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="font-bold">{email}</span>.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all"
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-xs font-medium text-slate-500 ml-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
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
                  className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-300">
          © 2024 EnergyDynamics AG
        </p>
      </motion.div>
    </div>
  );
}
