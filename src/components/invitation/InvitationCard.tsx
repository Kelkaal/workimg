"use client";

import { Building2, Mail, User, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface InvitationCardProps {
  organizationName: string;
  inviterName: string;
  role: string;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
  actionType: "accept" | "decline" | null;
  status: "idle" | "success" | "error";
  message: string;
}

export default function InvitationCard({
  organizationName,
  inviterName,
  role,
  onAccept,
  onDecline,
  isLoading,
  actionType,
  status,
  message,
}: InvitationCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-2">
      <CardHeader className="text-center pb-4 border-b">
        <div className="mx-auto mb-4 w-16 h-16 bg-linear-gradient-to-br from-[#800020] to-[#a00028] rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">
          Organization Invitation
        </CardTitle>
        <p className="text-muted-foreground text-base mt-2">
          You&apos;ve been invited to join an organization
        </p>
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        {status === "idle" && (
          <div className="space-y-6">
            {/* Organization Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-[#800020] rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Organization
                </p>
                <p className="text-xl font-bold text-gray-900">{organizationName}</p>
              </div>
            </div>

            {/* Inviter Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Invited by
                </p>
                <p className="text-xl font-bold text-gray-900">{inviterName}</p>
              </div>
            </div>

            {/* Role Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Your Role
                </p>
                <p className="text-xl font-bold text-gray-900 capitalize">{role}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                By accepting this invitation, you&apos;ll gain access to the organization&apos;s inventory
                management system and collaborate with team members.
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {actionType === "accept" ? "Invitation Accepted!" : "Invitation Declined"}
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {message}
            </p>
            {actionType === "accept" && (
              <div className="mt-6">
                <Button
                  onClick={() => (window.location.href = "/app")}
                  className="bg-[#800020] hover:bg-[#a00028]"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {actionType === "accept" ? "Failed to Accept" : "Failed to Decline"}
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {message}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {status === "idle" && (
        <CardFooter className="flex gap-4 pt-6 border-t">
          <Button
            onClick={onDecline}
            disabled={isLoading}
            variant="outline"
            className="flex-1 h-12 text-base font-semibold"
          >
            {isLoading && actionType === "decline" ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Declining...
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 mr-2" />
                Decline
              </>
            )}
          </Button>
          <Button
            onClick={onAccept}
            disabled={isLoading}
            className="flex-1 h-12 text-base font-semibold bg-[#800020] hover:bg-[#a00028]"
          >
            {isLoading && actionType === "accept" ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept Invitation
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}