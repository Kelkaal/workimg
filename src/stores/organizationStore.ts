import { create } from "zustand";

interface OrgState {
  organizationId: string | null;
  setOrganizationId: (id: string | null) => void;
}

export const useOrganizationStore = create<OrgState>((set) => ({
  organizationId: null,
  setOrganizationId: (id) => set({ organizationId: id }),
}));
