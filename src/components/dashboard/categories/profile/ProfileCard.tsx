"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Download, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.staging.soma.emerj.net";

interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  createdOn: string;
  lastModifiedOn: string;
}

export default function ProfileCard() {
  const { user: contextUser, updateProfileImage, updateUser } = useUser();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with context
  useEffect(() => {
    if (contextUser) {
      setProfileImage(contextUser.photoUrl);
    }
  }, [contextUser]);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.error("No auth token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUser(data.data);

      // Update context with fetched data
      updateUser({
        fullName: data.data.fullName,
        email: data.data.email,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // Fallback to context data or localStorage
      const fallbackName =
        contextUser?.fullName || localStorage.getItem("userFullName") || "User";
      const fallbackEmail =
        contextUser?.email ||
        localStorage.getItem("userEmail") ||
        "user@example.com";

      setUser({
        id: contextUser?.id || "local",
        fullName: fallbackName,
        email: fallbackEmail,
        emailVerified: true,
        enabled: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Try to upload to Cloudinary first
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        if (result.url) {
          // Update context (this will sync everywhere)
          updateProfileImage(result.url);
          setProfileImage(result.url);
          toast.success("Profile image updated!");
          setIsUploading(false);
          return;
        }
      }

      // Fallback to base64 if upload fails
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfileImage(base64String);
        setProfileImage(base64String);
        toast.success("Profile image updated!");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleDownloadData = () => {
    if (!user) return;

    // Create a data object with user info
    const userData = {
      profile: {
        name: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        accountStatus: user.enabled ? "Active" : "Inactive",
        memberSince: new Date(user.createdOn).toLocaleDateString(),
        lastModified: new Date(user.lastModifiedOn).toLocaleDateString(),
      },
      exportedOn: new Date().toISOString(),
    };

    // Convert to JSON and create download
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profile_data_${user.email}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getLastLogin = () => {
    // Calculate from lastModifiedOn or use a default
    const lastModified = user?.lastModifiedOn
      ? new Date(user.lastModifiedOn)
      : new Date();
    const now = new Date();
    const diffMs = now.getTime() - lastModified.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-[#900022] animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center text-gray-600">
          Failed to load profile. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl md:flex md:justify-between md:items-start shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-[#900022] to-[#600015] overflow-hidden relative">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleImageClick}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8B1538] rounded-full flex items-center justify-center text-white hover:bg-[#731229] disabled:opacity-50 disabled:cursor-not-allowed transition hover:cursor-pointer"
            title="Change profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {user.fullName}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-3 truncate">
            {user.email}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs sm:text-sm font-medium rounded-full flex items-center gap-1">
              <span className="text-purple-500">♦</span> Admin
            </span>
            <span
              className={`px-3 py-1 ${
                user.enabled
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              } text-xs sm:text-sm font-medium rounded-full flex items-center gap-1`}
            >
              <span
                className={user.enabled ? "text-green-500" : "text-amber-500"}
              >
                ●
              </span>
              {user.enabled ? "Active" : "Inactive"}
            </span>
            {user.emailVerified && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium rounded-full flex items-center gap-1">
                <span className="text-blue-500">✓</span> Verified
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-500">Member since</p>
              <p className="font-medium text-gray-900">
                {formatDate(user.createdOn)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last activity</p>
              <p className="font-medium text-gray-900">{getLastLogin()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadData}
        className="w-full sm:w-auto mt-4 px-4 py-2 text-sm sm:text-base text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition active:scale-95"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        Download Data
      </button>
    </div>
  );
}
