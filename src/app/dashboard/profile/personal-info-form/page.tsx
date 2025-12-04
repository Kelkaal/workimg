"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function PersonalInfoForm() {
  const { user, updateUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    bio: "",
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      const nameParts = (user.fullName || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        jobTitle: user.jobTitle || "",
        department: user.department || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // Update user context (this persists to localStorage)
      updateUser({
        fullName,
        phoneNumber: formData.phoneNumber,
        jobTitle: formData.jobTitle,
        department: formData.department,
        bio: formData.bio,
      });

      toast.success("Personal information saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save personal information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">
          Personal Information
        </h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#8B1538] rounded-lg hover:bg-[#731229] disabled:opacity-50 transition"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Update your personal details and contact information
      </p>

      <form
        title="personal-info-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="tel"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Job Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="job-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Title
            </label>
            <input
              id="job-title"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Warehouse Manager"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="dept"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Department
            </label>
            <input
              id="dept"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Operations"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#8B1538] focus:ring-2 focus:outline-none resize-none"
          />
        </div>
      </form>
    </div>
  );
}
