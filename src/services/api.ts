import type {
  AlertSettings,
  AppState,
  Contract,
  CustomerDashboard,
  MeasureData,
  Notification,
  Transaction,
  UserInfo,
} from "../types";

const _MOCK_USER: UserInfo = {
  id: 1,
  email: "alex.t@energydynamics.com",
  firstName: "Alex",
  lastName: "Thompson",
  companyName: "EnergyDynamics Ltd",
};

const MOCK_CONTRACTS: Contract[] = [
  {
    contractId: 101,
    buContractId: "BU-101-ELE",
    customerId: 1,
    description: "Residential Electricity - Main",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    serviceStatus: "Active",
    statusDateTime: "2024-01-01T00:00:00Z",
    zpbs: [{ zpbId: "ZPB-001", obis: "1.8.0" }],
    electricalRates: [{ tariffId: "T-RES-01", validFrom: "2024-01-01", validTo: "2025-12-31" }],
    triggerLockDays: 30,
    triggerPrelockDays: 15,
    triggerDeadlineLockDays: 5,
  },
];

const MOCK_DASHBOARD: CustomerDashboard = {
  sourceId: 1,
  status: true,
  balance: 14250, // 142.50 CHF in minor units
  consume: 450.5,
  scale: 2,
  contracts: [
    {
      contractId: 101,
      buContractId: "BU-101-ELE",
      description: "Residential Electricity - Main",
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2025-12-31T23:59:59Z",
      serviceStatus: "Active",
      customerId: 1,
    },
  ],
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    transactionId: "tx_001",
    customerId: 1,
    contractId: 101,
    amountMinor: 5000,
    scale: 2,
    currency: "CHF",
    transactionSource: "Stripe",
    transactionStatus: "Settled",
    description: "Manual Recharge",
    transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    transactionId: "tx_002",
    customerId: 1,
    contractId: 101,
    amountMinor: -1240,
    scale: 2,
    currency: "CHF",
    transactionSource: "System",
    transactionStatus: "Settled",
    description: "Daily Consumption",
    transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    transactionId: "tx_003",
    customerId: 1,
    contractId: 101,
    amountMinor: -1520,
    scale: 2,
    currency: "CHF",
    transactionSource: "System",
    transactionStatus: "Settled",
    description: "Daily Consumption",
    transactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

const INITIAL_ALERTS: AlertSettings = {
  lowBalance: true,
  peakUsage: false,
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Welcome to FlexEnergy",
    message: "Your account is active and ready to use.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info",
  },
];

export const apiService = {
  async getAppState(): Promise<AppState> {
    const saved = localStorage.getItem("flex_energy_state");
    if (saved) return JSON.parse(saved);
    
    return {
      dashboard: MOCK_DASHBOARD,
      contracts: MOCK_CONTRACTS,
      alerts: INITIAL_ALERTS,
      notifications: INITIAL_NOTIFICATIONS,
    };
  },

  async getTransactions(): Promise<Transaction[]> {
    return MOCK_TRANSACTIONS;
  },

  async getUsageData(period: "day" | "week" | "month"): Promise<MeasureData[]> {
    const points = period === "day" ? 24 : period === "week" ? 7 : 30;
    const interval = period === "day" ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24;
    
    return Array.from({ length: points }).map((_, i) => ({
      timestamp: new Date(Date.now() - interval * i).toISOString(),
      value: Math.random() * (period === "day" ? 2 : 20) + 0.5,
      unit: "kWh",
    }));
  },

  async updateBalance(newBalanceMinor: number): Promise<number> {
    const state = await this.getAppState();
    if (state.dashboard) {
      state.dashboard.balance = newBalanceMinor;
      localStorage.setItem("flex_energy_state", JSON.stringify(state));
    }
    return newBalanceMinor;
  },

  async updateAlerts(alerts: Partial<AlertSettings>): Promise<AlertSettings> {
    const state = await this.getAppState();
    state.alerts = { ...state.alerts, ...alerts };
    localStorage.setItem("flex_energy_state", JSON.stringify(state));
    return state.alerts;
  },

  async updateNotifications(
    notifications: Notification[],
  ): Promise<Notification[]> {
    const state = await this.getAppState();
    state.notifications = notifications;
    localStorage.setItem("flex_energy_state", JSON.stringify(state));
    return notifications;
  },
};
