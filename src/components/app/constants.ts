// --- TYPES ---
export interface Organization {
  id: string;
  name: string;
  description: string;
  status: "owner" | "admin";
  memberCount: number;
  createdAt: Date;
  updatedAt?: Date;
  isOwner: boolean;
  productCount: number;
  deleted: boolean;
}

export interface Invitation {
  id: string;
  organizationId: string;
  organizationName: string;
  inviterName: string;
  inviteeEmail: string;
  role: "ADMIN" | "STAFF" | "OWNER";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "EXPIRED";
  createdOn: string;
  // Legacy fields for backward compatibility
  name?: string;
  invitedBy?: string;
  daysAgo?: number;
  accepted?: boolean;
  declined?: boolean;
}

export interface OrganizationFormData {
  name: string;
  description: string;
  status: "owner" | "admin";
  memberCount: number;
}

// --- MOCK DATA ---
export const initialInvitations: Invitation[] = [];

// --- STORAGE KEYS ---
export const STORAGE_KEYS = {
  ORGANIZATIONS: "inventrix_organizations",
  INVITATIONS: "inventrix_invitations",
};
