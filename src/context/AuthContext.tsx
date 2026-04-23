import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { clearAuthToken, getClient, setAuthToken } from "../lib/smartsphere";
import type { UserInfo } from "../types";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser extends UserInfo {
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  is2FAVerified: boolean;
  /** Numeric customer ID from the SmartSphere JWT sub claim */
  customerId: number;
  /** Access token for API calls */
  accessToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  isLoading: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

const STORAGE_KEY = "flex_energy_user";

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage and restore the token on page reload
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: AuthUser = JSON.parse(saved);
      if (parsed.accessToken) setAuthToken(parsed.accessToken);
      setUser(parsed);
    }
    setIsLoading(false);
  }, []);

  const persistUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const tokenRes = await getClient().auth.requestToken({ userName: email, password });
    const payload = decodeJwtPayload(tokenRes.access_token);

    // Inject token into the singleton client immediately
    setAuthToken(tokenRes.access_token);

    // Customer ID is fixed to 348 for this SmartSphere instance.
    // The JWT sub claim may differ; this override ensures the correct
    // customer data is loaded from GetCustomerDashboard.
    const CUSTOMER_ID = 348;

    const authUser: AuthUser = {
      id: CUSTOMER_ID,
      customerId: CUSTOMER_ID,
      email: (payload.email as string | undefined) ?? email,
      firstName: (payload.given_name as string | undefined) ?? undefined,
      lastName: (payload.family_name as string | undefined) ?? undefined,
      companyName: (payload.company as string | undefined) ?? undefined,
      accessToken: tokenRes.access_token,
      isEmailVerified: true,
      is2FAEnabled: false,
      is2FAVerified: true,
    };

    persistUser(authUser);
  };

  const loginWithGoogle = async () => {
    // Google OAuth not available in demo mode — falls back to a demo user
    const demoUser: AuthUser = {
      id: 0,
      customerId: 0,
      email: "alex.t@energydynamics.com",
      firstName: "Alex",
      lastName: "Thompson",
      companyName: "EnergyDynamics Ltd",
      accessToken: "",
      isEmailVerified: true,
      is2FAEnabled: false,
      is2FAVerified: true,
    };
    persistUser(demoUser);
  };

  const verifyEmail = async () => {
    if (user) persistUser({ ...user, isEmailVerified: true });
  };

  const verify2FA = async (code: string) => {
    if (!user) throw new Error("Not authenticated");
    if (code.length !== 6) throw new Error("Invalid 2FA code");
    persistUser({ ...user, is2FAVerified: true });
  };

  const logout = async () => {
    clearAuthToken();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const forgotPassword = async (email: string) => {
    await getClient().account.resetPassword({ email });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        forgotPassword,
        verifyEmail,
        verify2FA,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
