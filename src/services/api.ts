import type {
  AlertSettings,
  AppState,
  Notification,
  Transaction,
  UsageData,
} from "../types";

const INITIAL_STATE: AppState = {
  balance: 142.5,
  user: {
    name: "Alex Thompson",
    email: "alex.t@energydynamics.com",
    plan: "Premium Residential Plan",
    zone: "Zone 4B",
    deviceId: "EM-992-KWH-2024",
    status: "active",
    isVerified: true,
  },
  alerts: {
    lowBalance: true,
    peakUsage: false,
  },
  notifications: [
    {
      id: "1",
      title: "Welcome to FlexEnergy",
      message: "Your account is active and ready to use.",
      timestamp: new Date().toISOString(),
      read: false,
      type: "info",
    },
  ],
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "recharge",
    amount: 50,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    description: "Manual Recharge",
    category: "Payment",
  },
  {
    id: "t2",
    type: "consumption",
    amount: 12.4,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description: "Daily Consumption",
    category: "Usage",
  },
  {
    id: "t3",
    type: "consumption",
    amount: 15.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    description: "Daily Consumption",
    category: "Usage",
  },
  {
    id: "t4",
    type: "recharge",
    amount: 100,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    description: "Auto Recharge",
    category: "Payment",
  },
  {
    id: "t5",
    type: "consumption",
    amount: 8.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    description: "Daily Consumption",
    category: "Usage",
  },
];

const generateUsageData = (days: number): UsageData[] => {
  return Array.from({ length: days }).map((_, i) => ({
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString(),
    value: Math.random() * 20 + 5,
  }));
};

// This service can be easily swapped for a real API in the future
export const apiService = {
  async getAppState(): Promise<AppState> {
    const saved = localStorage.getItem("flex_energy_state");
    if (saved) return JSON.parse(saved);
    return INITIAL_STATE;
  },

  async getTransactions(): Promise<Transaction[]> {
    return MOCK_TRANSACTIONS;
  },

  async getUsageData(period: "day" | "week" | "month"): Promise<UsageData[]> {
    const days = period === "day" ? 24 : period === "week" ? 7 : 30;
    if (period === "day") {
      return Array.from({ length: 24 }).map((_, i) => ({
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * i).toISOString(),
        value: Math.random() * 2 + 0.5,
      }));
    }
    return generateUsageData(days);
  },

  async updateBalance(newBalance: number): Promise<number> {
    const state = await this.getAppState();
    const newState = { ...state, balance: newBalance };
    localStorage.setItem("flex_energy_state", JSON.stringify(newState));
    return newBalance;
  },

  async updateAlerts(alerts: Partial<AlertSettings>): Promise<AlertSettings> {
    const state = await this.getAppState();
    const newState = { ...state, alerts: { ...state.alerts, ...alerts } };
    localStorage.setItem("flex_energy_state", JSON.stringify(newState));
    return newState.alerts;
  },

  async updateNotifications(
    notifications: Notification[],
  ): Promise<Notification[]> {
    const state = await this.getAppState();
    const newState = { ...state, notifications };
    localStorage.setItem("flex_energy_state", JSON.stringify(newState));
    return notifications;
  },
};
