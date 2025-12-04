import { create } from "zustand";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    // Check if we're on the client
    if (typeof window === "undefined") {
      return;
    }

    set({ loading: true, error: null });

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        set({ loading: false });
        return; // Silently return if no token
      }

      // Get organization ID for the profile endpoint
      const orgId =
        sessionStorage.getItem("organizationId") ||
        localStorage.getItem("organizationId");

      // Use organization profile endpoint if orgId exists, otherwise fallback
      const endpoint = orgId
        ? `${API_BASE_URL}/api/v1/organizations/${orgId}/profile/me`
        : `${API_BASE_URL}/api/v1/users/me`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Don't throw on 401/403 - just silently fail
        if (response.status === 401 || response.status === 403) {
          set({ loading: false });
          return;
        }
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Failed to fetch user profile"
          );
        } catch {
          throw new Error("Failed to fetch user profile");
        }
      }

      const data = await response.json();

      // console.log('Fetched user data:', data);

      // Parse the user data from backend
      // Backend returns: { user: { id, email, name, ... } }
      // We need to split name into firstName and lastName
      const backendUser = data.data; // use data.data, not data.user
      const nameParts = backendUser.fullName?.split(" ") || ["User", ""];

      // Check localStorage for profile image if API doesn't return one
      let photoUrl = backendUser.photoUrl;
      if (!photoUrl && backendUser.email) {
        photoUrl =
          localStorage.getItem(`profileImage_${backendUser.email}`) ||
          undefined;
      }

      const user: User = {
        id: backendUser.id,
        firstName: nameParts[0] || "User",
        lastName: nameParts.slice(1).join(" ") || "",
        email: backendUser.email,
        photoUrl: photoUrl,
      };

      set({ user, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null, error: null }),
}));
