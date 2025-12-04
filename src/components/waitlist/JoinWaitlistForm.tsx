"use client";

import React, { useState } from "react";
import { FaRocket as FaRocketAlt } from "react-icons/fa6";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Input from "@/components/waitlist/ui/Input";
import { PRIMARY_COLOR } from "@/lib/constants";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type FormData = z.infer<typeof schema>;

export default function JoinWaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/waitlist/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          fullName: data.fullName.trim(),
          companyName: data.companyName?.trim() || null,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (
        response.ok ||
        result.message?.toLowerCase().includes("already registered") ||
        result.message?.toLowerCase().includes("already exists")
      ) {
        const isDuplicate = !response.ok;
        toast.success(isDuplicate ? "Welcome back!" : "You're on the list!");
        reset();
        router.push(`/waitlist/success${isDuplicate ? "?type=returning" : ""}`);
        return;
      }

      throw new Error(result.message || "Something went wrong");
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast.error("Request timed out. Please check your connection.");
          router.push("/waitlist/error");
          return;
        }
        toast.error(error.message || "Unable to connect. Please try again.");
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white mb-10" id="join">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Your Spot Today
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Join 2,847 businesses already on the waitlist!
          </p>

          <div className="p-8 md:p-10 shadow-xl rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName")}
                    disabled={isSubmitting}
                    className="placeholder:text-gray-400"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    disabled={isSubmitting}
                    className="placeholder:text-gray-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                  Company Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Your Company"
                  {...register("companyName")}
                  disabled={isSubmitting}
                  className="placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-60 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.opacity = "0.9";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <FaRocketAlt size={22} />
                {isSubmitting ? "Joining..." : "Join the Waitlist Now"}
              </button>

              <p className="text-sm text-gray-500">
                We&apos;ll notify you as soon as we launch. No spam, ever.
              </p>

              <div className="pt-6 border-t border-gray-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "50% Off",
                    "Priority Access",
                    "Exclusive Features",
                    "Free Trial",
                  ].map((benefit) => (
                    <div key={benefit} className="flex flex-col items-center">
                      <span className="h-6 w-6 rounded-full bg-emerald-400 text-white flex items-center justify-center mb-2">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
