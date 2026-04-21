import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/api";
import type { AlertSettings, AppState, Notification, ViewType } from "../types";
import { formatCurrency, toMinorUnits } from "../types";
import { useAuth } from "./AuthContext";

interface AppContextType {
  state: AppState | null;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  recharge: (amount: number) => Promise<void>;
  toggleAlert: (key: keyof AlertSettings) => Promise<void>;
  updateAlertSettings: (settings: Partial<AlertSettings>) => Promise<void>;
  addNotification: (title: string, message: string, type: Notification["type"]) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  /** First contract ID from the user's dashboard — used by hooks for API calls. */
  contractId: number;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Reload app state whenever the authenticated user changes
  useEffect(() => {
    if (!user) {
      setState(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    apiService
      .getAppState(user.customerId)
      .then((data) => setState(data))
      .catch(() => setState(null))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const contractId = state?.dashboard?.contracts?.[0]?.contractId ?? 0;

  const recharge = async (amount: number) => {
    if (!state?.dashboard || !user) return;
    const amountMinor = toMinorUnits(amount, state.dashboard.scale);

    await apiService.rechargeBalance(user.customerId, contractId, amountMinor, state.dashboard.scale);

    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Balance Recharged",
      message: `Successfully added ${formatCurrency(amountMinor, state.dashboard.contracts?.[0] ? "CHF" : "CHF", state.dashboard.scale)} to your account.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "success",
    };
    const updatedNotifications = [newNotification, ...state.notifications];
    await apiService.updateNotifications(updatedNotifications);

    setState((prev) =>
      prev?.dashboard
        ? {
          ...prev,
          dashboard: { ...prev.dashboard, balance: prev.dashboard.balance + amountMinor },
          notifications: updatedNotifications,
        }
        : prev,
    );
  };

  const toggleAlert = async (key: keyof AlertSettings) => {
    if (!state || !user) return;
    const newAlerts = { ...state.alerts, [key]: !state.alerts[key] };
    const updatedAlerts = await apiService.updateAlerts(user.customerId, newAlerts);
    setState((prev) => (prev ? { ...prev, alerts: updatedAlerts } : null));
  };

  const updateAlertSettings = async (settings: Partial<AlertSettings>) => {
    if (!state || !user) return;
    const newAlerts = { ...state.alerts, ...settings };
    const updatedAlerts = await apiService.updateAlerts(user.customerId, newAlerts);
    setState((prev) => (prev ? { ...prev, alerts: updatedAlerts } : null));
  };

  const addNotification = async (title: string, message: string, type: Notification["type"]) => {
    if (!state) return;
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title, message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    const updatedNotifications = [newNotification, ...state.notifications];
    await apiService.updateNotifications(updatedNotifications);
    setState((prev) => (prev ? { ...prev, notifications: updatedNotifications } : null));
  };

  const markNotificationAsRead = async (id: string) => {
    if (!state) return;
    const updatedNotifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    await apiService.updateNotifications(updatedNotifications);
    setState((prev) => (prev ? { ...prev, notifications: updatedNotifications } : null));
  };

  const clearNotifications = async () => {
    if (!state) return;
    await apiService.updateNotifications([]);
    setState((prev) => (prev ? { ...prev, notifications: [] } : null));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentView,
        setView: setCurrentView,
        recharge,
        toggleAlert,
        updateAlertSettings,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        contractId,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
