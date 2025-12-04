"use client";

import React, { useState } from "react";
import {
  Camera,
  TrendingUp,
  ThumbsUp,
  CheckCircle,
  Plus,
  Edit,
  FileText,
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    checkOutNotifications: true,
    weeklySummary: false,
    systemUpdates: true,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
              <span className="text-gray-400">✕</span>
              Cancel
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 text-sm text-white bg-[#8B1538] rounded-lg hover:bg-[#731229] flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <div className="relative mx-auto sm:mx-0">
                <div className="w-24 h-24 rounded-xl bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8B1538] rounded-full flex items-center justify-center text-white hover:bg-[#731229]">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500 mb-3">
                  john.doe@company.com
                </p>

                <div className="flex gap-3 justify-center sm:justify-start mb-3">
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <span className="text-pink-500">♦</span>
                    Admin
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <span className="text-green-500">●</span>
                    Active
                  </span>
                </div>

                <div className="flex gap-8 text-sm justify-center sm:justify-start">
                  <div>
                    <p className="text-gray-500">Member since</p>
                    <p className="font-medium text-gray-900">January 2024</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last login</p>
                    <p className="font-medium text-gray-900">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Actions</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span>↑</span> 25% this month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Items Managed</p>
                <p className="text-3xl font-bold text-gray-900">342</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span>↑</span> 8% this month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-Outs</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <span>↓</span> 3% this week
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Personal Information
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Update your personal details and contact information
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

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
                  type="email"
                  defaultValue="john.doe@company.com"
                  autoComplete="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
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
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  autoComplete="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  defaultValue="Warehouse Manager"
                  autoComplete="organization-title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  defaultValue="Operations"
                  autoComplete="organization"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                id="text"
                rows={3}
                defaultValue="Experienced warehouse manager with 10+ years in inventory management and logistics operations."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent resize-none"
              />
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Security Settings
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Manage your password and security preferences
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Password Requirements
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>At least 8 characters long</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Contains uppercase letter</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Contains number</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Contains special character (optional)</span>
                </div>
              </div>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 text-sm text-[#8B1538] border border-[#8B1538] rounded-lg hover:bg-[#8B1538] hover:text-white transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Notification Preferences
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Choose what notifications you want to receive
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive email updates about your activity
                </p>
              </div>
              <button
                onClick={() => toggleNotification("emailNotifications")}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications.emailNotifications
                    ? "bg-[#8B1538]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.emailNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900">
                  Low Stock Alerts
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Get notified when items are running low
                </p>
              </div>
              <button
                onClick={() => toggleNotification("lowStockAlerts")}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications.lowStockAlerts ? "bg-[#8B1538]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.lowStockAlerts
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900">
                  Check-Out Notifications
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Alerts when items are checked out
                </p>
              </div>
              <button
                onClick={() => toggleNotification("checkOutNotifications")}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications.checkOutNotifications
                    ? "bg-[#8B1538]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.checkOutNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900">
                  Weekly Summary Report
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive weekly activity summary
                </p>
              </div>
              <button
                onClick={() => toggleNotification("weeklySummary")}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications.weeklySummary ? "bg-[#8B1538]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.weeklySummary
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900">
                  System Updates
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Important system announcements
                </p>
              </div>
              <button
                onClick={() => toggleNotification("systemUpdates")}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  notifications.systemUpdates ? "bg-[#8B1538]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.systemUpdates
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your latest activity in the system
              </p>
            </div>
            <button className="text-sm text-[#8B1538] font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Added new product
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Power Drill - Model KYZ-5003
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Updated product quantity
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Safety Goggles - A+ - 40 units
                </p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Checked out items
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Internal-Set (3 units) - Mike Johnson
                </p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Exported report
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Monthly Inventory Report (CSV)
                </p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Low stock alert triggered
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Welding Rods below threshold (5 units)
                </p>
                <p className="text-xs text-gray-400 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 md:p-6">
          <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Irreversible actions - proceed with caution
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Deactivate Account
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Temporarily disable your account
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Deactivate
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Account
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
