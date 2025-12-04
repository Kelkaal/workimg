"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string | null;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateProfileImage: (imageUrl: string) => void;
  refreshUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Decode JWT token to get user info
function decodeToken(token: string): Partial<UserProfile> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: decoded.userId || decoded.sub,
      fullName: decoded.fullName || decoded.name || "",
      email: decoded.sub || decoded.email || "",
    };
  } catch {
    return null;
  }
}

// Helper to load user from storage (pure function)
function loadUserFromStorage(): UserProfile | null {
  if (typeof window === "undefined") return null;

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return null;

  const tokenData = decodeToken(token);
  if (!tokenData) return null;

  const savedProfile = localStorage.getItem(`userProfile_${tokenData.id}`);
  const savedData = savedProfile ? JSON.parse(savedProfile) : {};
  const savedImage = localStorage.getItem(`profileImage_${tokenData.email}`);

  const userProfile: UserProfile = {
    id: tokenData.id || "",
    fullName: savedData.fullName || tokenData.fullName || "",
    email: tokenData.email || "",
    photoUrl: savedImage || savedData.photoUrl || null,
    phoneNumber: savedData.phoneNumber || "",
    jobTitle: savedData.jobTitle || "",
    department: savedData.department || "",
    bio: savedData.bio || "",
  };

  return userProfile;
}

// Store for useSyncExternalStore
let userSnapshot: UserProfile | null = null;
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): UserProfile | null {
  return userSnapshot;
}

function getServerSnapshot(): UserProfile | null {
  return null;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// Initialize on client
if (typeof window !== "undefined") {
  userSnapshot = loadUserFromStorage();
}

export function UserProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [loading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch user profile from API - no dependencies to avoid memoization issues
  const fetchUserProfile = useCallback(async () => {
    if (typeof window === "undefined") return;

    const currentUser = userSnapshot;
    if (!currentUser?.id) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const apiUser = result.data || result;

        if (apiUser) {
          const updatedProfile: UserProfile = {
            id: apiUser.id || currentUser?.id || "",
            fullName:
              apiUser.fullName || apiUser.name || currentUser?.fullName || "",
            email: apiUser.email || currentUser?.email || "",
            photoUrl: apiUser.photoUrl || currentUser?.photoUrl || null,
            phoneNumber: apiUser.phoneNumber || "",
            jobTitle: apiUser.jobTitle || "",
            department: apiUser.department || "",
            bio: apiUser.bio || "",
          };

          // Save to localStorage
          localStorage.setItem(
            `userProfile_${updatedProfile.id}`,
            JSON.stringify(updatedProfile)
          );
          localStorage.setItem("userFullName", updatedProfile.fullName);
          localStorage.setItem("userEmail", updatedProfile.email);

          if (updatedProfile.photoUrl) {
            localStorage.setItem(
              `profileImage_${updatedProfile.email}`,
              updatedProfile.photoUrl
            );
          }

          userSnapshot = updatedProfile;
          emitChange();
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }, []);

  // Fetch on first render if user exists
  if (user?.id && !hasFetched && typeof window !== "undefined") {
    setHasFetched(true);
    fetchUserProfile();
  }

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    if (!userSnapshot) return;

    const updated = { ...userSnapshot, ...updates };

    // Save to localStorage
    localStorage.setItem(`userProfile_${updated.id}`, JSON.stringify(updated));

    if (updates.fullName) {
      localStorage.setItem("userFullName", updates.fullName);
    }
    if (updates.email) {
      localStorage.setItem("userEmail", updates.email);
    }

    userSnapshot = updated;
    emitChange();

    // Dispatch event for other components
    window.dispatchEvent(new Event("profileUpdated"));
  }, []);

  const updateProfileImage = useCallback((imageUrl: string) => {
    if (!userSnapshot) return;

    const updated = { ...userSnapshot, photoUrl: imageUrl };

    // Save to localStorage
    localStorage.setItem(`userProfile_${updated.id}`, JSON.stringify(updated));
    localStorage.setItem(`profileImage_${updated.email}`, imageUrl);

    userSnapshot = updated;
    emitChange();

    // Dispatch event for other components
    window.dispatchEvent(new Event("profileUpdated"));
  }, []);

  const refreshUser = useCallback(() => {
    userSnapshot = loadUserFromStorage();
    emitChange();
    fetchUserProfile();
  }, [fetchUserProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("organizationId");
    sessionStorage.removeItem("organizationId");
    userSnapshot = null;
    emitChange();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        updateProfileImage,
        refreshUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
