import { Bell, Mail, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Invitation } from "./constants";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

interface HeaderProps {
  pendingInvitationsCount: number;
  invitations: Invitation[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  pendingInvitationsCount,
  invitations,
  onAccept,
  onDecline,
}) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useUser();

  // const profileImage = user?.photoUrl || null;
  // const userName = user?.fullName || "User";

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const unhandledInvitations = invitations.filter(
    (inv) => !inv.accepted && !inv.declined
  );

  // const getUserInitials = () => {
  //   return userName
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Inventrix Logo"
            width={30}
            height={30}
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Inventrix </h1>
            <p className="text-xs text-gray-500">Inventory Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95 relative hover:cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {pendingInvitationsCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white hover:cursor-pointer">
                {pendingInvitationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-20">
                <h4 className="font-bold text-lg text-gray-900 mb-3">
                  Notifications ({unhandledInvitations.length})
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {unhandledInvitations.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      No new invitations or notifications.
                    </p>
                  ) : (
                    unhandledInvitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="border-b border-gray-100 pb-3 last:border-b-0"
                      >
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-orange-500 mt-1 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Invitation to <strong>{invitation.name}</strong>
                            </p>
                            <p className="text-xs text-gray-600 mb-2">
                              From: {invitation.invitedBy} ({invitation.daysAgo}{" "}
                              days ago)
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  onAccept(invitation.id);
                                }}
                                className="text-xs text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  onDecline(invitation.id);
                                }}
                                className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Profile Image Display (Updated) */}
          {/* <div className="h-10 w-10 rounded-full bg-linear-gradient-to-br from-[#900022] to-[#600015] overflow-hidden relative flex items-center justify-center shadow-inner">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
            )}
          </div> */}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600 hover:cursor-pointer"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
