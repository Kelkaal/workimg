"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUsers, FiEye, FiEyeOff } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
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
import { login } from "@/services/authService";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { toast } from "sonner";

function clsx(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const PRIMARY_RED = "#800020";
  const TEXT_GRAY_MEDIUM = "#6B7280";
  const TEXT_GRAY_DARK = "#1F2937";
  const INPUT_BORDER_COLOR = "#D1D5DB";

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const features = [
    {
      icon: FaClipboardCheck,
      title: "Check In/Out",
      description: "Track who takes what and when",
    },
    {
      icon: FaCamera,
      title: "Item Snapshots",
      description: "Document item conditions quickly",
    },
    {
      icon: GoHistory,
      title: "Activity Logs",
      description: "Complete movement history",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await login({ email, password });

      // Extract token from different possible locations
      const token =
        res.data?.accessToken || res.data?.token || res.data?.access_token;

      // Check for success
      const isSuccess =
        (res.status_code === 200 || res.status === "success") && token;

      if (isSuccess) {
        // CORRECTED LOGIC: Store token based on rememberMe state
        // const storage = rememberMe ? localStorage : sessionStorage;
        localStorage.setItem("token", token as string);
        sessionStorage.setItem("token", token as string);

        // Also store user info if available
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Store user_id if available (fallback)
        if (res.data?.user_id) {
          localStorage.setItem("userId", res.data.user_id);
          sessionStorage.setItem("userId", res.data.user_id);
        }

        toast.success("Login successful!", {
          description: "Redirecting to dashboard...",
        });

        // Redirect to app/onboarding
        setTimeout(() => {
          router.push("/app");
        }, 500);
      } else {
        // Removed verification check - users can login without email verification
        if (res.status_code === 401 || res.status_code === 400) {
          toast.error("Invalid credentials", {
            description: "Please check your email and password.",
          });
        } else {
          toast.error(res.message || "Login failed", {
            description: "Please try again.",
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Login failed", {
          description: err.message,
        });
      } else {
        toast.error("Login failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
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

        toast.success("Google Sign-In successful!");
        router.push("/app");
      } else {
        toast.error(data.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.error("Failed to authenticate with Google");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE */}
        <div className={clsx("hidden lg:flex flex-col gap-8 px-10 py-10")}>
          <div className="relative w-[80%] aspect-4/3 rounded-lg overflow-hidden">
            <Image
              src="/assets/inventory-management.png"
              alt="Warehouse shelves with stock inventory"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6 ml-10">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Inventrix Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
              />
              <div>
                <p
                  className={clsx(
                    "font-semibold text-lg",
                    `text-[${TEXT_GRAY_DARK}]`
                  )}
                >
                  StoreKeeper
                </p>
                <p className={clsx("text-xs", `text-[${TEXT_GRAY_MEDIUM}]`)}>
                  Simple store management system for tracking items in and out
                  of your facility.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <feature.icon
                    className={clsx(
                      "mt-1 h-10 w-10 bg-[#FCE7EB] p-3 rounded-full",
                      `text-[${PRIMARY_RED}]`
                    )}
                  />
                  <div>
                    <h3
                      className={clsx(
                        "font-semibold text-sm",
                        `text-[${TEXT_GRAY_DARK}]`
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={clsx("text-xs", `text-[${TEXT_GRAY_MEDIUM}]`)}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  <FiUsers className="text-xl" />
                </div>
                <div className="space-y-1 text-center">
                  <CardTitle
                    className={clsx(
                      "text-2xl font-bold",
                      `text-[${TEXT_GRAY_DARK}]`
                    )}
                  >
                    Welcome Back
                  </CardTitle>
                  <CardDescription className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                    Sign in to manage your store inventory
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-0 bg-[#F9FAFB]">
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                      onChange={(e) => setEmail(e.target.value)}
                      className={clsx(
                        "pl-10",
                        `border-[${INPUT_BORDER_COLOR}]`,
                        `focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[${PRIMARY_RED}]`
                      )}
                    />
                  </div>
                </div>

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
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    {/* Updated checkbox to use native input and rely on state */}
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={clsx(
                        "mt-1 h-4 w-4 shrink-0 rounded hover:cursor-pointer",
                        `border-[${INPUT_BORDER_COLOR}]`,
                        `checked:bg-[${PRIMARY_RED}]`,
                        `checked:border-transparent`
                      )}
                    />

                    <Label
                      htmlFor="remember-me"
                      className={clsx(
                        "text-sm font-normal leading-none cursor-pointer",
                        `text-[${TEXT_GRAY_MEDIUM}]`
                      )}
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className={clsx(`text-xs font-medium hover:underline`)}
                    style={{ color: PRIMARY_RED }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={clsx(
                    "w-full text-white transition-colors duration-200 hover:cursor-pointer"
                  )}
                  style={{ backgroundColor: PRIMARY_RED }}
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="px-0 pt-4 flex flex-col items-center gap-4 text-xs text-muted-foreground bg-[#F9FAFB]">
              {/* Divider */}
              <div className="w-full flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google Sign In */}
              <GoogleAuthButton
                onSuccess={handleGoogleLogin}
                buttonText="signin_with"
              />

              <div className="flex items-center gap-1 text-sm">
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>
                  Dont have an account?
                </span>
                <Link
                  href="/signup"
                  className={clsx(
                    "font-medium hover:underline text-sm leading-relaxed"
                  )}
                  style={{ color: PRIMARY_RED }}
                >
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
