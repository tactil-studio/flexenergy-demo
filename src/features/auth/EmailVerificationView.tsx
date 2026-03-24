import { Mail, ArrowRight, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function EmailVerificationView() {
  const { user, verifyEmail, logout } = useAuth();
  const [isSending, setIsSending] = useState(false);

  const handleVerify = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await verifyEmail();
    setIsSending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 text-center"
      >
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify your email</h1>
        <p className="text-slate-500 text-sm mb-8">
          We've sent a verification link to <span className="font-bold text-slate-700">{user?.email}</span>. Please check your inbox.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleVerify}
            disabled={isSending}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSending ? "Verifying..." : "I've verified my email"}
            {!isSending && <ArrowRight className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {}}
            className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
          >
            Resend Email
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest pt-4 hover:text-slate-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
