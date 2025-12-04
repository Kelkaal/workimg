"use client";
import { forgotPassword } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiInfo, FiChevronLeft } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

function clsx(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  // Custom colors
  const PRIMARY_RED = "#800020";
  const TEXT_GRAY_MEDIUM = "#6B7280";
  const TEXT_GRAY_DARK = "#1F2937";
  const INPUT_BORDER_COLOR = "#D1D5DB";

  const isFormValid =
    email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLoading = status === "sending";

  const steps = [
    "Enter your registered email address",
    "Check your inbox for reset link",
    "Create a new secure password",
    "Sign in with your new password",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (isLoading) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await forgotPassword({ email });

      // Check for success - handle multiple status indicators
      // NOTE: The code review recommended standardizing the backend response,
      // but for now, we keep the complex check.
      const isSuccess =
        response.status_code === 200 ||
        response.status_code === 201 ||
        response.status === "success" ||
        (response.message && response.message.toLowerCase().includes("sent"));

      if (isSuccess) {
        setStatus("success");
        setMessage(
          response.message ||
            "Password reset link sent! Check your email inbox and spam folder."
        );

        toast.success("Reset link sent!", {
          description: "Check your email inbox and spam folder.",
          duration: 5000,
        });

        // Clear email after 3 seconds on success
        setTimeout(() => {
          setEmail("");
        }, 3000);
      } else {
        setStatus("error");

        // Handle specific error cases
        if (
          response.status_code === 404 ||
          response.message?.toLowerCase().includes("not found") ||
          response.message?.toLowerCase().includes("does not exist")
        ) {
          setMessage("No account found with this email address.");
          toast.error("Email not found", {
            description: "No account exists with this email address.",
          });
        } else if (response.status_code === 429) {
          setMessage("Too many requests. Please try again later.");
          toast.error("Rate limit exceeded", {
            description: "Please wait a few minutes before trying again.",
          });
        } else {
          setMessage(
            response.message || "Failed to send reset link. Please try again."
          );
          toast.error("Request failed", {
            description: response.message || "Please try again.",
          });
        }
      }
    } catch (error: unknown) {
      setStatus("error");

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      setMessage(
        errorMessage ||
          "Failed to send reset link. Please check your email and try again."
      );

      toast.error("Request failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className={clsx("hidden lg:flex flex-col gap-10 px-10 py-10")}>
          <div className="flex flex-col items-center justify-center pt-8">
            <Image
              src="/assets/forgot-pass-key.png"
              alt="Password reset illustration"
              width={120}
              height={120}
              className="w-auto h-auto object-cover"
            />
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Inventrix Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
              />
              <p
                className={clsx(
                  "font-semibold text-xl",
                  `text-[${TEXT_GRAY_DARK}]`
                )}
              >
                Inventrix
              </p>
            </div>
            <h2
              className={clsx(
                "text-2xl font-bold leading-snug",
                `text-[${TEXT_GRAY_DARK}]`
              )}
            >
              Reset Your Password
            </h2>
            <p className={clsx("text-sm", `text-[${TEXT_GRAY_MEDIUM}]`)}>
              Well help you regain access to your store management system
              quickly and securely.
            </p>
          </div>
          <div
            className={clsx(
              "rounded-lg p-6 space-y-4 border",
              "bg-[#FDF2F4]",
              "border-[#F9D0D9]"
            )}
          >
            <p
              className={clsx(
                "font-semibold text-lg",
                `text-[${TEXT_GRAY_DARK}]`
              )}
            >
              Password Reset Process:
            </p>
            <ul className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div
                    className={clsx(
                      "flex h-6 w-6 items-center justify-center rounded-full text-white font-bold text-xs shrink-0"
                    )}
                    style={{ backgroundColor: PRIMARY_RED }}
                  >
                    {index + 1}
                  </div>
                  <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-[#F9FAFB]">
          <Card className="w-full border-none shadow-none px-6 py-10 max-w-sm mx-auto bg-[#F9FAFB]">
            <CardHeader className="px-0 bg-[#F9FAFB]">
              <div className="flex flex-col items-center gap-4">
                <div
                  className={clsx(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                  )}
                  style={{ backgroundColor: PRIMARY_RED }}
                >
                  <MdEmail className="text-xl" />
                </div>
                <div className="space-y-1 text-center">
                  <CardTitle
                    className={clsx(
                      "text-2xl font-bold",
                      `text-[${TEXT_GRAY_DARK}]`
                    )}
                  >
                    Forgot Password?
                  </CardTitle>
                  <CardDescription className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                    No worries, well send you reset instructions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-0 bg-[#F9FAFB]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-[${TEXT_GRAY_DARK}]`}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <FiMail
                      className={clsx(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                        `text-[${TEXT_GRAY_MEDIUM}]`
                      )}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear error status when typing
                        if (status === "error") {
                          setStatus("idle");
                          setMessage("");
                        }
                      }}
                      className={clsx(
                        "pl-10",
                        `border-[${INPUT_BORDER_COLOR}]`,
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                      )}
                      disabled={isLoading || status === "success"}
                      required
                    />
                  </div>
                  <p className={clsx("text-xs", `text-[${TEXT_GRAY_MEDIUM}]`)}>
                    Enter the email address associated with your account
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={clsx(
                    "w-full text-white transition-colors duration-200 hover:cursor-pointer"
                  )}
                  style={{ backgroundColor: PRIMARY_RED }}
                  disabled={!isFormValid || isLoading || status === "success"}
                >
                  {isLoading
                    ? "Sending..."
                    : status === "success"
                    ? "Email Sent!"
                    : "Send Reset Link"}
                </Button>
              </form>

              {message && (
                <div
                  className={clsx("rounded-lg p-3 text-sm font-medium border", {
                    "bg-green-50 border-green-300 text-green-800":
                      status === "success",
                    "bg-red-50 border-red-300 text-red-800": status === "error",
                  })}
                >
                  {message}
                </div>
              )}

              <div
                className={clsx(
                  "rounded-lg p-3 flex gap-3 text-sm border",
                  "bg-[#EFF6FF]",
                  "border-[#BFDBFE]",
                  "text-[#1E40AF]"
                )}
              >
                <FiInfo className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">What happens next?</p>
                  <p className="font-normal text-xs mt-1">
                    Well send you an email with a secure link to reset your
                    password. The link expires in 1 hour for security purposes.
                  </p>
                </div>
              </div>

              <div
                className={clsx(
                  "rounded-lg p-3 flex gap-3 text-sm border",
                  "bg-[#F3F4F6]",
                  "border-[#E5E7EB]",
                  "text-[#374151]"
                )}
              >
                <FaShieldAlt className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">Security Notice</p>
                  <p className="font-normal text-xs mt-1">
                    If you dont receive an email within 5 minutes, check your
                    spam folder or contact support.
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <Link
                  href="/signin"
                  className={clsx(
                    "font-medium text-sm flex items-center gap-1 hover:underline"
                  )}
                  style={{ color: PRIMARY_RED }}
                >
                  <FiChevronLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>

            <CardFooter className="px-0  flex flex-col items-center gap-2 text-xs text-muted-foreground bg-[#F9FAFB]">
              <div className="flex items-center gap-1 text-sm">
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                  Dont have an account?
                </span>
                <Link
                  href="/signup"
                  className={clsx("font-medium hover:underline")}
                  style={{ color: PRIMARY_RED }}
                >
                  Sign up for free
                </Link>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>Need help?</span>
                <Link
                  href="/support"
                  className={clsx("font-medium hover:underline")}
                  style={{ color: PRIMARY_RED }}
                >
                  Contact Support
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
