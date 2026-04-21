import { ArrowRight, LogOut, Mail, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useEmailVerification } from "../hooks/useEmailVerification";

export function EmailVerificationView() {
  const { user, isSending, isResending, handleVerify, handleResend, logout } =
    useEmailVerification();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-4xl shadow-xl border border-border text-center"
      >
        <span className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <Mail className="size-8 text-primary" />
        </span>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          We've sent a verification link to{" "}
          <strong className="font-semibold text-foreground">{user?.email}</strong>.
          Please check your inbox.
        </p>

        <nav className="space-y-4" aria-label="Verification actions">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isSending}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSending ? "Verifying..." : "I've verified my email"}
            {!isSending && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground py-4 rounded-2xl font-bold hover:bg-muted/70 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${isResending ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {isResending ? "Resending..." : "Resend email"}
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground text-xs pt-4 hover:text-foreground transition-colors"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </nav>
      </motion.article>
    </main>
  );
}
