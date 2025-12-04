import {
  Plus,
  Building2,
  Mail,
  BarChart3,
  PackageCheck,
  FileText,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { MdStickyNote2 } from "react-icons/md"; 
import { PiHandWavingFill } from "react-icons/pi";
import { FaCommentDots } from "react-icons/fa6";
import { IoMdPlayCircle } from "react-icons/io";
import { FaCircleQuestion } from "react-icons/fa6";

const EmptyState: React.FC<{ onCreateOrg: () => void }> = ({ onCreateOrg }) => (
  <div className="max-w-5xl mx-auto">
    {/* Icon and Welcome Header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-6">
        <PiHandWavingFill size={40} className="text-[#800020]" />
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-3">
        Welcome to Inventrix !
      </h2>
      <p className="text-gray-600 text-base max-w-xl mx-auto">
        Were excited to have you here. Get started by creating your first
        organization to begin managing your inventory efficiently.
      </p>
    </div>

    {/* Create Organization Banner */}
    <div className="bg-linear-to-r from-[#800020] to-[#a00028] rounded-2xl p-8 mb-8 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold">
              Create Your First Organization
            </h3>
          </div>
          <p className="text-white/90 mb-6 max-w-lg text-sm">
            Set up your organization in minutes and start tracking your
            inventory today
          </p>
          <button
            onClick={onCreateOrg}
            className="bg-white text-[#800020] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg active:scale-95 hover:cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Create Organization
          </button>
        </div>
        <Image
          src="/assets/workspace.jpg"
          alt="Create Organization"
          width={300}
          height={300}
          className="hidden md:block ml-8 rounded-lg"
        />
      </div>
    </div>

    {/* Two Column Grid */}
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Your Organizations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Your Organizations
          </h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
            0 Active
          </span>
        </div>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-base font-bold text-gray-900 mb-2">
            No Organizations Yet
          </h4>
          <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto">
            Create your first organization to start managing your inventory and
            collaborate with your team.
          </p>
          <button
            onClick={onCreateOrg}
            className="bg-[#800020] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#600018] transition flex items-center gap-2 mx-auto shadow-sm active:scale-95 text-sm hover:cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Organization
          </button>
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Pending Invitations
          </h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
            0 New
          </span>
        </div>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-base font-bold text-gray-900 mb-2">
            No Invitations
          </h4>
          <p className="text-gray-600 text-sm mb-4 max-w-xs mx-auto">
            You dont have any pending invitations at the moment. Check back
            later or create your own organization.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span>Invitations will appear here when received</span>
          </div>
        </div>
      </div>
    </div>

    {/* Three Feature Cards */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
          <BarChart3 className="h-7 w-7 text-blue-600" />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Track Inventory</h4>
        <p className="text-sm text-gray-600">
          Monitor stock levels, categories, and product details in real-time
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4">
          <PackageCheck className="h-7 w-7 text-green-600" />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Collaborate</h4>
        <p className="text-sm text-gray-600">
          Invite team members and manage permissions effortlessly
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-4">
          <FileText className="h-7 w-7 text-purple-600" />
        </div>
        <h4 className="font-bold text-gray-900 mb-2">Generate Reports</h4>
        <p className="text-sm text-gray-600">
          Get insights with detailed analytics and reporting tools
        </p>
      </div>
    </div>

    {/* Help Section */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center shrink-0">
          <FaCircleQuestion className="h-6 w-6 text-[#2563EB]" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Need Help Getting Started?
          </h4>
          <p className="text-gray-700 text-sm mb-4">
            Learn how to set up your organization, invite team members, and
            start managing your inventory efficiently. Our comprehensive guides
            will help you set up and running in no time.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
            >
              <span>
                <MdStickyNote2 />
              </span>
              View Documentation
            </a>
            <a
              href="#"
              className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
            >
              <IoMdPlayCircle /> Watch Tutorial
            </a>
            <a
              href="#"
              className="text-sm text-[#800020] font-semibold hover:underline flex items-center gap-1"
            >
              <FaCommentDots />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;
