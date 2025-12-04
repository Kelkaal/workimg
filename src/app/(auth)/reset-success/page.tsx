"use client";

import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { FaSignInAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
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

const PRIMARY_RED = "#800020";
const TEXT_GRAY_MEDIUM = "#6B7280";

type StatusCardProps = {
  icon: React.ElementType; 
  title: string;
  description: string;
  color: string;
};

const StatusCard = ({
  icon: Icon,
  title,
  description,
  color,
}: StatusCardProps) => (
  <div
    className={clsx(
      "flex flex-col items-center p-3 rounded-lg border",
      "bg-white border-gray-200"
    )}
  >
    <Icon className={clsx("h-5 w-5 mb-1", `text-[${color}]`)} />
    <p className={clsx("text-sm font-semibold", `text-[${color}]`)}>{title}</p>
    <p className={clsx("text-xs text-center", `text-[${TEXT_GRAY_MEDIUM}]`)}>
      {description}
    </p>
  </div>
);

export default function PasswordResetSuccessPage() {
  const TEXT_GRAY_DARK = "#1F2937";
  // const SUCCESS_GREEN = "#34D399";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE */}
        <div
          className={clsx(
            "hidden lg:flex flex-col gap-10 p-10 items-center text-center justify-center"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-8">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden">
              <Image
                src="/assets/success-bag.png"
                alt="A dark blue backpack representing inventory"
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
          </div>

          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Inventrix  Logo"
                width={28}
                height={28}
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
            <p className={clsx("text-sm", `text-[${TEXT_GRAY_MEDIUM}]`)}>
              Your store management system is ready to use with your new
              password.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="px-6 py-10 sm:px-8 flex items-center justify-center bg-[#F9FAFB] w-full">
          <Card className="w-full border-none shadow-none p-0 max-w-sm mx-auto bg-[#F9FAFB]">
            <CardHeader className="px-0 text-center">
              <div className="flex justify-center mb-4">
                <FaCheck
                  className={clsx(
                    "h-12 w-12 bg-[#DCFCE7] p-2 rounded-full",
                    `text-[#16A34A]`
                  )}
                />
              </div>

              <CardTitle
                className={clsx(
                  "text-2xl font-bold",
                  `text-[${TEXT_GRAY_DARK}]`
                )}
              >
                Password Reset Successful!
              </CardTitle>
              <p className={clsx("text-sm mt-1", `text-[${TEXT_GRAY_MEDIUM}]`)}>
                Your password has been changed successfully. You can now sign in
                with your new credentials.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-0 bg-[#F9FAFB]">
              <div className="grid grid-cols-2 gap-4">
                <StatusCard
                  icon={FaShieldAlt}
                  title="Secure"
                  description="Password encrypted"
                  color={PRIMARY_RED}
                />
                <StatusCard
                  icon={FaClock}
                  title="Active"
                  description="Ready to use now"
                  color={PRIMARY_RED}
                />
              </div>

              <Link href="/signin" passHref>
                <Button
                  size="lg"
                  className={clsx(
                    "w-full text-white mt-4",
                    `bg-[${PRIMARY_RED}]`,
                    `hover:bg-white hover:border-[#800020] hover:cursor-pointer hover:text-[#800020] hover:border`
                  )}
                >
                  <FaSignInAlt className="mr-2 h-4 w-4" />
                  Continue to Sign In
                </Button>
              </Link>
              <div
                className={clsx(
                  "rounded-lg p-3 flex gap-3 text-sm border mt-4",
                  "bg-[#EFF6FF]",
                  "border-[#BFDBFE]",
                  "text-[#1E40AF]"
                )}
              >
                <FaLightbulb className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-medium">Security Tips</p>
                  <ul className="space-y-1 mt-1 text-xs">
                    <li className="flex items-center gap-1">
                      <FaCircleCheck className="h-3 w-3 text-[#16A34A]" />
                      Use a unique password for Inventrix
                    </li>
                    <li className="flex items-center gap-1">
                      <FaCircleCheck className="h-3 w-3 text-[#16A34A]" />
                      Enable two-factor authentication for extra security
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-0 pt-4 flex flex-col items-center text-xs text-muted-foreground bg-[#F9FAFB]">
              <div className="flex items-center gap-1 text-sm">
                <span className={`text-[${TEXT_GRAY_MEDIUM}]`}>Need help?</span>
                <Link
                  href="/support"
                  className={clsx(
                    `text-[${PRIMARY_RED}]`,
                    "font-medium hover:underline"
                  )}
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
