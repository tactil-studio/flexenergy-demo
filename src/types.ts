export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  zone: string;
  deviceId: string;
  status: "active" | "inactive";
  isVerified: boolean;
}

export interface AlertSettings {
  lowBalance: boolean;
  peakUsage: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

export interface AppState {
  balance: number;
  user: UserProfile;
  alerts: AlertSettings;
  notifications: Notification[];
}

export type ViewType = "usage" | "recharge" | "history" | "settings";

export interface Transaction {
  id: string;
  type: "recharge" | "consumption";
  amount: number;
  timestamp: string;
  description: string;
  category?: string;
}

export interface UsageData {
  timestamp: string;
  value: number;
}
