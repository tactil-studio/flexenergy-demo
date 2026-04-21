/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { EmailVerificationView } from "@/features/auth/views/EmailVerificationView";
import { ForgotPasswordView } from "@/features/auth/views/ForgotPasswordView";
import { LoginView } from "@/features/auth/views/LoginView";
import { TwoFactorAuthView } from "@/features/auth/views/TwoFactorAuthView";
import { DashboardView } from "@/features/dashboard/views/DashboardView";
import { HistoryView } from "@/features/history/views/HistoryView";
import { RechargeView } from "@/features/recharge/views/RechargeView";
import { SettingsView } from "@/features/settings/views/SettingsView";
import { UsageView } from "@/features/usage/views/UsageView";

function MainContent() {
  const { currentView, isLoading: isAppLoading } = useApp();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [authView, setAuthView] = useState<"login" | "forgot">("login");

  if (isAuthLoading || isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <output className="flex flex-col items-center gap-4" aria-label="Loading">
          <span className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Loading...</p>
        </output>
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {authView === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginView onShowForgot={() => setAuthView("forgot")} />
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ForgotPasswordView onBack={() => setAuthView("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Verification flows
  if (!user.isEmailVerified) {
    return <EmailVerificationView />;
  }

  if (user.is2FAEnabled && !user.is2FAVerified) {
    return <TwoFactorAuthView />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <BottomNav />
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20 lg:pt-20 pb-28 lg:pb-10 px-4 lg:px-10">
          <div className="max-w-2xl mx-auto lg:max-w-5xl lg:mx-0">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.section
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentView === "dashboard" && <DashboardView />}
                  {currentView === "usage" && <UsageView />}
                  {currentView === "recharge" && <RechargeView />}
                  {currentView === "history" && <HistoryView />}
                  {currentView === "settings" && <SettingsView />}
                </motion.section>
              </AnimatePresence>
            </ErrorBoundary>

            <footer className="text-center py-10">
              <p className="text-xs text-slate-300">
                © 2026 EnergyDynamics AG
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
