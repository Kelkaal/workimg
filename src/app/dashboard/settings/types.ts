// app/dashboard/settings/types.ts
export interface FeatureFlags {
  allowStaffAddItems: boolean;
  requireApproval: boolean;
  enableSnapshots: boolean;
  trackLocation: boolean;
  lowStockEmail: boolean;
  checkoutEmail: boolean;
  dailySummary: boolean;
  systemUpdates: boolean;
  preventNegativeStock: boolean;
  requireNotesAdjustments: boolean;
  twoFactor: boolean;
  loginAttemptLimit: boolean;
  activityLogging: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Store Staff" | "Viewer";
  // role: "Admin" | "Store Staff" | "Viewer";
  status: "Active" | "Inactive";
  lastActive: string;
  avatar: string;
}

export interface GeneralSettings {
  companyName: string;
  timeZone: string;
  dateFormat: string;
  currency: string;
  language: string;
}

export interface InventorySettings {
  lowStockThreshold: number;
  autoArchiveDays: string;
  defaultUnit: string;
  retentionPeriod: string;
  backupFrequency: string;
}

export interface SecuritySettings {
  sessionTimeout: string;
  minPasswordLength: boolean;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
}
