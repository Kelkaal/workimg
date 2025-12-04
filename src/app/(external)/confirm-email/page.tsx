"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      // ✅ Handle null searchParams
      if (!searchParams) {
        setStatus("error");
        setMessage("Invalid verification link. No parameters found.");
        return;
      }

      const email = searchParams?.get("email");
      const token = searchParams?.get("token");

      if (!email || !token) {
        setStatus("error");
        setMessage("Invalid verification link. Email or token is missing.");
        return;
      }

      try {
        const response = await fetch(
  `${API_BASE_URL}/api/v1/auth/confirm-email?email=${email}&token=${token}`
);


        const result = await response.json();

        console.log("Verification response:", result); // Debug log

        if (
          response.ok &&
          (result.status === "success" || result.status_code === 200)
        ) {
          setStatus("success");
          setMessage(result.message || "Email verified successfully!");
          toast.success("Email verified! Redirecting to login...");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/signin");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            result.message || "Email verification failed. Please try again."
          );
          toast.error(result.message || "Verification failed");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(
          "An error occurred during verification. Please try again later."
        );
        toast.error("Verification failed");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Verifying Your Email
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Please wait while we confirm your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Email Verified Successfully! 🎉
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">{message}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 font-medium">
                  Redirecting you to the login page in a few seconds...
                </p>
              </div>
              <button
                onClick={() => router.push("/signin")}
                className="w-full px-6 py-3 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#600018] transition shadow-md"
              >
                Go to Login Now
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">{message}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  The verification link may be expired or invalid.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/signin")}
                  className="w-full px-6 py-3 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#600018] transition shadow-md"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Sign Up Again
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{" "}
            <a
              href="mailto:support@inventrix.com"
              className="text-[#800020] font-medium hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#800020] animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
