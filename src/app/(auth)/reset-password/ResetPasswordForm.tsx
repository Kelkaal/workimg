// app/(auth)/reset-password/ResetPasswordForm.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiCircle,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function clsx(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}
const PRIMARY_RED_HEX = "#800020";
const HOVER_RED_HEX = "#6a001a";
const GREEN_CHECK_HEX = "#34D399";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // FIX: Access search params safely
  const email = searchParams?.get("email") ?? "";
  const token = searchParams?.get("token") ?? "";

  // Component States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setConfirmPasswordVisible] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const passwordValidation = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumberOrSpecial = /[0-9!@#$%^&*()]/.test(newPassword);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumberOrSpecial) score += 1;

    let strengthText = "";
    let strengthColorClass = "bg-gray-200";
    let strengthTextColorClass = "text-gray-500"; // FIX: Standard class

    if (score === 1) {
      strengthText = "Weak";
      strengthColorClass = "bg-red-500";
      strengthTextColorClass = "text-red-500";
    } else if (score === 2 || score === 3) {
      strengthText = "Medium";
      strengthColorClass = "bg-yellow-500";
      strengthTextColorClass = "text-yellow-500";
    } else if (score === 4) {
      strengthText = "Strong";
      strengthColorClass = "bg-green-500";
      strengthTextColorClass = "text-green-500";
    }

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumberOrSpecial,
      score,
      strengthText,
      strengthColorClass, // FIX: Use class name here
      strengthTextColorClass,
    };
  }, [newPassword]);

  const isFormValid =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword &&
    passwordValidation.score === 4;

  const isLoading = status === "sending";
  const shouldShowPasswordDetails = newPassword.length >= 4;

  const RequirementIcon = ({ isMet }: { isMet: boolean }) =>
    isMet ? (
      // FIX: Use arbitrary value safely for single component color
      <FiCheckCircle className={`h-4 w-4 text-[${GREEN_CHECK_HEX}]`} />
    ) : (
      <FiCircle className={`h-3 w-3 text-gray-400`} />
    );

  const passwordRequirements = [
    { text: "At least 8 characters", isMet: passwordValidation.hasMinLength },
    { text: "One uppercase letter", isMet: passwordValidation.hasUppercase },
    { text: "One lowercase letter", isMet: passwordValidation.hasLowercase },
    {
      text: "One number or special character",
      isMet: passwordValidation.hasNumberOrSpecial,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isLoading) return;

    // FIX: Check for email/token validity immediately on submission
    if (!email || !token) {
      setStatus("error");
      setMessage(
        "Error: Reset link is incomplete or invalid. Please request a new one."
      );
      return;
    }

    setStatus("sending");
    setMessage("Attempting to reset password...");

    try {
      const response = await resetPassword({ email, token, newPassword });
      setStatus("success");
      const successMessage = response.message || "Password successfully reset!";
      setMessage(successMessage);

      setTimeout(() => {
        router.push("/reset-success");
      }, 2000);
    } catch (error: unknown) {
      setStatus("error");
      const errorMessage =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unexpected error occurred.";

      setMessage(
        errorMessage ||
          "Password reset failed. The link may have expired or been used."
      );
    }
  };

  // FIX: Remove initial status check. It's safe to run here,
  // but it's cleaner to handle errors in the message display.
  // const isLinkInvalid = !email || !token;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE (Promotional/Branding) */}
        <div
          className={clsx(
            "hidden lg:flex flex-col p-10 items-center text-center mt-35"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-16">
            <div className="relative w-40 h-40 ">
              <Image
                src="/assets/reset-pass-lock.png"
                alt="User icon"
                width={52}
                height={52}
                className="h-35 w-35 object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Inventrix Logo"
                width={28}
                height={28}
                className="h-8 w-8 object-cover"
              />
              <p className={clsx("font-semibold text-xl text-gray-900")}>
                Inventrix
              </p>
            </div>
            <p className={clsx("text-sm text-gray-600")}>
              Create a strong password to secure your store management account.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div className="px-6 py-10 sm:px-8 flex items-center justify-center bg-gray-50 w-full">
          <Card className="w-full border-none shadow-none p-0 max-w-sm mx-auto bg-gray-50">
            <CardHeader className="px-0 bg-gray-50">
              <CardTitle
                className={clsx("text-2xl font-bold text-center text-gray-900")}
              >
                Reset Your Password
              </CardTitle>
              <p className={clsx("text-sm text-center mt-1 text-gray-600")}>
                Enter your new password below. Make sure its strong and secure.
              </p>
              <p
                className={clsx(
                  "text-xs text-center font-medium italic mt-2",
                  // FIX: Using arbitrary value safely
                  `text-[${PRIMARY_RED_HEX}]`
                )}
              >
                {email
                  ? `For account: ${email}`
                  : "Fetching account details..."}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-0 bg-gray-50">
              {message && (
                <div
                  className={clsx(
                    "rounded-lg p-3 text-sm font-semibold text-center border",
                    {
                      "bg-green-100 border-green-300 text-green-700":
                        status === "success",
                      "bg-red-100 border-red-300 text-red-700":
                        status === "error",
                    }
                  )}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className={`text-gray-900`}>
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={clsx(
                        "pr-10 border-gray-300",
                        // FIX: Using arbitrary value safely
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED_HEX}]`
                      )}
                      disabled={
                        isLoading || status === "success" || status === "error"
                      }
                      required
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                  </div>
                </div>
                {shouldShowPasswordDetails && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 mr-2">
                        <div
                          className={clsx(
                            "h-full transition-all duration-300",
                            passwordValidation.strengthColorClass // FIX: Use class name
                          )}
                          style={{
                            width: `${(passwordValidation.score / 4) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={clsx(
                          "font-medium",
                          passwordValidation.strengthTextColorClass
                        )}
                      >
                        {passwordValidation.strengthText}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm pt-2">
                      {passwordRequirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <RequirementIcon isMet={req.isMet} />
                          <span
                            className={clsx(
                              "text-xs",
                              req.isMet ? `text-gray-900` : `text-gray-600`
                            )}
                          >
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={`text-gray-900`}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={clsx(
                        "pr-10 border-gray-300",
                        // FIX: Using arbitrary value safely
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED_HEX}]`
                      )}
                      disabled={
                        isLoading || status === "success" || status === "error"
                      }
                      required
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setConfirmPasswordVisible(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={clsx(
                    "w-full text-white mt-8",
                    // FIX: Using arbitrary value safely
                    `bg-[${PRIMARY_RED_HEX}]`,
                    `hover:bg-[${HOVER_RED_HEX}]`
                  )}
                  disabled={!isFormValid || isLoading || status === "success"}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Resetting...
                    </span>
                  ) : (
                    <>
                      <FiLock className="mr-2 h-4 w-4" /> Reset Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="px-0 pt-4 flex flex-col items-center gap-4 text-xs text-muted-foreground bg-gray-50">
              <Link
                href="/auth/signin"
                className={clsx(
                  "font-medium text-sm flex items-center gap-1",
                  // FIX: Using arbitrary value safely
                  `text-[${PRIMARY_RED_HEX}]`,
                  "hover:underline"
                )}
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
              <div className="flex items-center gap-2 text-xs">
                <FaShieldAlt
                  className={clsx("h-3 w-3", `text-[${PRIMARY_RED_HEX}]`)}
                />
                <span className={`text-gray-600`}>
                  Your password is encrypted and secure
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
