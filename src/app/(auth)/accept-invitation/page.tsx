"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptInvitation } from "@/services/authService";
import { toast } from "sonner";
import Image from "next/image";

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAccept = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid invitation link. No token provided.");
        return;
      }

      try {
        const response = await acceptInvitation(token);

        if (response.status === "success" || response.status_code === 200) {
          setStatus("success");
          setMessage("Invitation accepted successfully! Redirecting...");
          toast.success("Welcome to the organization!");

          // Redirect to app page after 2 seconds
          setTimeout(() => {
            router.push("/app");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(response.message || "Failed to accept invitation");
        }
      } catch (error) {
        console.error("Accept invitation error:", error);
        setStatus("error");
        setMessage("An error occurred while accepting the invitation");
      }
    };

    handleAccept();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <Image
            src="/assets/logo.png"
            alt="Inventrix"
            width={64}
            height={64}
            className="mx-auto"
          />
        </div>

        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Accepting Invitation...
            </h2>
            <p className="text-gray-600">
              Please wait while we process your invitation.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invitation Accepted!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push("/app")}
              className="px-6 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a001a] transition"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invitation Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/signin")}
                className="w-full px-6 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#6a001a] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020]"></div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
