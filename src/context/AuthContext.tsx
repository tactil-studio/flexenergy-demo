import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { UserInfo } from "../types";

interface AuthUser extends UserInfo {
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  is2FAVerified: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("flex_energy_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Mock login - initially unverified for demo
    const mockUser: AuthUser = {
      id: 1,
      email,
      firstName: "Alex",
      lastName: "Thompson",
      companyName: "EnergyDynamics Ltd",
      isEmailVerified: false, // Set to false to trigger verification flow
      is2FAEnabled: true, // Set to true to trigger 2FA flow
      is2FAVerified: false,
    };
    setUser(mockUser);
    localStorage.setItem("flex_energy_user", JSON.stringify(mockUser));
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser: AuthUser = {
      id: 1,
      email: "alex.t@energydynamics.com",
      firstName: "Alex",
      lastName: "Thompson",
      companyName: "EnergyDynamics Ltd",
      isEmailVerified: true,
      is2FAEnabled: false,
      is2FAVerified: true,
    };
    setUser(mockUser);
    localStorage.setItem("flex_energy_user", JSON.stringify(mockUser));
  };

  const verifyEmail = async () => {
    if (user) {
      const updatedUser = { ...user, isEmailVerified: true };
      setUser(updatedUser);
      localStorage.setItem("flex_energy_user", JSON.stringify(updatedUser));
    }
  };

  const verify2FA = async (code: string) => {
    if (user && code === "123456") {
      // Mock code
      const updatedUser = { ...user, is2FAVerified: true };
      setUser(updatedUser);
      localStorage.setItem("flex_energy_user", JSON.stringify(updatedUser));
    } else {
      throw new Error("Invalid 2FA code");
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("flex_energy_user");
  };

  const forgotPassword = async (email: string) => {
    console.log(`Reset link sent to ${email}`);
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
