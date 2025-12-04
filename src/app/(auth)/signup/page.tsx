"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiUser,
  FiGift,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { SlEarphonesAlt } from "react-icons/sl";
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

import GoogleAuthButton from "@/components/GoogleAuthButton";
import {
  signup,
  // resendVerification,
  ApiResponse,
  SignupData,
} from "@/services/authService";

function clsx(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}

export default function SignupPage() {
  const router = useRouter();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // RENAMED: Split Full Name into First and Last Name for API consistency
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Custom colors
  const PRIMARY_RED = "#800020";
  const SUCCESS_GREEN_BORDER = "#BBF7D0";
  const TEXT_GRAY_MEDIUM = "#6B7280";
  const TEXT_GRAY_DARK = "#1F2937";
  const INPUT_BORDER_COLOR = "#D1D5DB";

  // Updated form validation to check First Name and Last Name
  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim().length >= 8 &&
    agreedToTerms &&
    passwordErrors.length === 0;

  const validatePasswordRules = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("Must be at least 8 characters");
    if (!/[A-Z]/.test(pwd))
      errors.push("Must contain at least one capital letter");
    if (!/[0-9]/.test(pwd)) errors.push("Must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      errors.push("Must contain at least one special character");
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const pwdErrors = validatePasswordRules(newPassword);
    setPasswordErrors(pwdErrors);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };

  // const handleResendVerification = async (userEmail: string) => {
  //   try {
  //     const res = await resendVerification({ email: userEmail });

  //     if (res.status_code === 200 || res.status === "success") {
  //       toast.success("Verification email resent!", {
  //         description: "Check your inbox and spam folder.",
  //       });
  //     } else {
  //       toast.error(res.message || "Failed to resend email.");
  //     }
  //   } catch (err: unknown) {
  //     if (err instanceof Error) {
  //       toast.error(err.message);
  //     } else {
  //       toast.error("Could not reach server to resend email.");
  //     }
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pwdErrors = validatePasswordRules(password);
    if (pwdErrors.length > 0) {
      setPasswordErrors(pwdErrors);
      toast.error("Please fix password requirements");
      return;
    } else {
      setPasswordErrors([]);
    }

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Updated signup call to send firstName and lastName
      const res: ApiResponse<SignupData> = await signup({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });

      // Check for success - handle multiple status indicators
      const isSuccess =
        res.status_code === 200 ||
        res.status_code === 201 ||
        res.status === "success" ||
        (res.message && res.message.toLowerCase().includes("success"));

      if (isSuccess) {
        // Show success toast
        toast.success("Account created successfully!", {
          // description:
          //   res.message || "Please check your email to verify your account.",
          // action: {
          //   label: "Resend Email",
          //   onClick: () => handleResendVerification(email),
          // },
          duration: 8000,
        });

        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setAgreedToTerms(false);

        // Redirect after delay
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        // Handle error cases
        // Check if it's a duplicate email error
        if (
          res.status_code === 400 ||
          res.status_code === 409 ||
          (res.message &&
            (res.message.toLowerCase().includes("email") ||
              res.message.toLowerCase().includes("already") ||
              res.message.toLowerCase().includes("exist")))
        ) {
          toast.error("Email already registered", {
            description: "Please use a different email or try signing in.",
          });
          setErrors({ email: "This email is already registered" });
        } else {
          toast.error("Registration failed", {
            description: res.message || "Please try again.",
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Registration failed", {
          description: err.message,
        });
      } else {
        toast.error("Registration failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const handleGoogleSignup = async (idToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (res.ok && data.data?.accessToken) {
        localStorage.setItem("token", data.data.accessToken);
        sessionStorage.setItem("token", data.data.accessToken);

        if (data.data?.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          sessionStorage.setItem("user", JSON.stringify(data.data.user));
        }

        toast.success("Google Sign-Up successful!");
        router.push("/app");
      } else {
        toast.error(data.message || "Google Sign-Up failed");
      }
    } catch (error) {
      console.error("Google Sign-Up error:", error);
      toast.error("Failed to authenticate with Google");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE - PROMOTIONAL */}
        <div className={clsx("hidden lg:flex flex-col gap-8 px-10 py-10")}>
          <div className="relative w-[80%] aspect-4/3 rounded-lg mt-6 overflow-hidden">
            <Image
              src="/assets/inventory-management.png"
              alt="Warehouse shelves with stock inventory"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6 ml-10">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <Image
                src="/assets/logo.png"
                alt="Inventrix Logo"
                width={30}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-xl sm:text-[24px] font-bold text-[#111827]">
                Inventrix
              </span>
            </Link>

            <div className="space-y-2">
              <ul className="space-y-2 text-sm">
                {[
                  "Real-time inventory tracking across multiple locations",
                  "Automated low stock alerts and reorder points",
                  "Advanced analytics and inventory reports",
                  "Barcode scanning and mobile app access",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle
                      className={clsx("mt-1 h-4 w-4", `text-[${PRIMARY_RED}]`)}
                    />
                    <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 items-center text-xs">
              <div className="flex items-center gap-2">
                <FaShieldAlt
                  className={clsx("h-4 w-4", `text-[${PRIMARY_RED}]`)}
                />
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                  Bank-level security
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SlEarphonesAlt
                  className={clsx("h-4 w-4", `text-[${PRIMARY_RED}]`)}
                />
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                  24/7 support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="flex items-center justify-center bg-[#F9FAFB]">
          <Card className="w-full border-none shadow-none px-6 py-10 max-w-sm mx-auto bg-[#F9FAFB]">
            <CardHeader className="px-0 bg-[#F9FAFB]">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/assets/signup-user.png"
                  alt="User icon"
                  width={52}
                  height={52}
                  className="h-15 w-15 object-cover"
                />
                <div className="space-y-1 text-center">
                  <CardTitle
                    className={clsx(
                      "text-2xl font-bold",
                      `text-[${TEXT_GRAY_DARK}]`
                    )}
                  >
                    Create Your Account
                  </CardTitle>
                  <CardDescription className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                    Start your 14-day free trial today
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-0 bg-[#F9FAFB]">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* FIRST NAME & LAST NAME */}
                <div className="grid grid-cols-2 gap-4">
                  {/* FIRST NAME */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className={`text-[${TEXT_GRAY_DARK}]`}
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <FiUser
                        className={clsx(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                          `text-[${TEXT_GRAY_MEDIUM}]`
                        )}
                      />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={clsx(
                          "pl-10",
                          `border-[${INPUT_BORDER_COLOR}]`,
                          `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                        )}
                      />
                    </div>
                  </div>

                  {/* LAST NAME */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className={`text-[${TEXT_GRAY_DARK}]`}
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <FiUser
                        className={clsx(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                          `text-[${TEXT_GRAY_MEDIUM}]`
                        )}
                      />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={clsx(
                          "pl-10",
                          `border-[${INPUT_BORDER_COLOR}]`,
                          `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* EMAIL */}
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
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      className={clsx(
                        "pl-10",
                        `border-[${INPUT_BORDER_COLOR}]`,
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={`text-[${TEXT_GRAY_DARK}]`}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <FiLock
                      className={clsx(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                        `text-[${TEXT_GRAY_MEDIUM}]`
                      )}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      className={clsx(
                        "pl-10 pr-10",
                        `border-[${INPUT_BORDER_COLOR}]`,
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      {passwordErrors.map((err, index) => (
                        <li key={index} className="text-xs text-red-600">
                          {err}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={clsx("text-xs", `text-[${TEXT_GRAY_MEDIUM}]`)}
                    >
                      Must be at least 8 characters, with a capital letter,
                      number, and special character.
                    </p>
                  )}
                </div>

                {/* TERMS */}
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className={clsx(
                      "mt-1 h-4 w-4 shrink-0 rounded hover:cursor-pointer",
                      `border-[${INPUT_BORDER_COLOR}]`,
                      `checked:bg-[${PRIMARY_RED}]`,
                      `checked:border-transparent`
                    )}
                  />

                  <Label
                    htmlFor="terms"
                    className={clsx(
                      "text-[10px] md:text-[11px] lg:text-[12px] font-normal leading-tight"
                    )}
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className={clsx(
                        `text-[${PRIMARY_RED}]`,
                        "underline font-bold"
                      )}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className={clsx(
                        `text-[${PRIMARY_RED}]`,
                        "underline font-bold"
                      )}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={clsx(
                    "w-full text-white transition-colors duration-200 hover:cursor-pointer",
                    `bg-[${PRIMARY_RED}]`,
                    `hover:bg-[#6a001a]`,
                    loading && "opacity-75 cursor-not-allowed"
                  )}
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              {/* Divider */}
              <div className="w-full flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google Sign Up */}
              <GoogleAuthButton
                onSuccess={handleGoogleSignup}
                buttonText="signup_with"
              />
            </CardContent>

            <CardFooter className="px-0 pt-4 flex flex-col items-center gap-4 text-xs text-muted-foreground bg-[#F9FAFB]">
              <div className="flex items-center gap-1">
                <span>Already have an account?</span>
                <Link
                  href="/signin"
                  className={clsx(
                    `text-[${PRIMARY_RED}]`,
                    "font-medium hover:underline ml-1"
                  )}
                >
                  Sign in here
                </Link>
              </div>

              <div
                className={clsx(
                  "w-full rounded-lg py-3 md:px-4 px-1 flex items-center justify-center gap-2 md:text-sm text-[12px]",
                  `bg-[#F0FDF4]`,
                  `border-[${SUCCESS_GREEN_BORDER}]`,
                  `text-green-700`,
                  "border"
                )}
              >
                <FiGift className="text-lg" />
                <span>14-day free trial • No credit card required</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
