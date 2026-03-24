import { ShieldCheck, ArrowRight, LogOut, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function TwoFactorAuthView() {
  const { verify2FA, logout } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      await verify2FA(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 text-center"
      >
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
        <p className="text-slate-500 text-sm mb-8">
          Enter the 6-digit code from your authenticator app to secure your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center text-3xl font-bold tracking-[0.5em] focus:border-blue-600 focus:ring-0 transition-all placeholder:text-slate-200"
            />
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || code.length !== 6}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
            {!isVerifying && <ArrowRight className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest pt-4 hover:text-slate-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </motion.div>
    </div>
  );
}
