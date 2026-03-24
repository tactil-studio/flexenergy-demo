import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/api";
import type { AlertSettings, AppState, Notification, ViewType } from "../types";

interface AppContextType {
  state: AppState | null;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  recharge: (amount: number) => Promise<void>;
  toggleAlert: (key: keyof AlertSettings) => Promise<void>;
  addNotification: (
    title: string,
    message: string,
    type: Notification["type"],
  ) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("settings");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getAppState().then((data) => {
      setState(data);
      setIsLoading(false);
    });
  }, []);

  const recharge = async (amount: number) => {
    if (!state) return;
    const newBalance = state.balance + amount;
    const updatedBalance = await apiService.updateBalance(newBalance);

    // Add notification for recharge
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Balance Recharged",
      message: `Successfully added $${amount.toFixed(2)} to your account.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "success",
    };

    const updatedNotifications = [newNotification, ...state.notifications];
    await apiService.updateNotifications(updatedNotifications);

    setState((prev) =>
      prev
        ? {
            ...prev,
            balance: updatedBalance,
            notifications: updatedNotifications,
          }
        : null,
    );
  };

  const toggleAlert = async (key: keyof AlertSettings) => {
    if (!state) return;
    const newAlerts = { ...state.alerts, [key]: !state.alerts[key] };
    const updatedAlerts = await apiService.updateAlerts(newAlerts);
    setState((prev) => (prev ? { ...prev, alerts: updatedAlerts } : null));
  };

  const addNotification = async (
    title: string,
    message: string,
    type: Notification["type"],
  ) => {
    if (!state) return;
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    const updatedNotifications = [newNotification, ...state.notifications];
    await apiService.updateNotifications(updatedNotifications);
    setState((prev) =>
      prev ? { ...prev, notifications: updatedNotifications } : null,
    );
  };

  const markNotificationAsRead = async (id: string) => {
    if (!state) return;
    const updatedNotifications = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    await apiService.updateNotifications(updatedNotifications);
    setState((prev) =>
      prev ? { ...prev, notifications: updatedNotifications } : null,
    );
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
        addNotification,
        markNotificationAsRead,
        clearNotifications,
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
