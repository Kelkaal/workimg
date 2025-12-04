"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

// 👉 now points to staging backend
const CONTACT_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contact`;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to send message. Please try again.";

        try {
          const errorBody = await response.json();
          console.log("Contact API error body:", errorBody);
          if (errorBody?.message) {
            errorMessage = errorBody.message;
          }
        } catch {
          // ignore JSON parse error
        }

        throw new Error(errorMessage);
      }

      toast.success("Thank you! We'll get back to you soon.");
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Card
      className="
        bg-white border border-slate-100
        shadow-[0_15px_40px_rgba(15,23,42,0.08)]
        rounded-md overflow-hidden
        w-full max-w-[600px]   /* 🔹 responsive width */
        transform transition-all duration-300  /* 🔹 smooth animation */
        hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]
        hover:-translate-y-1
      "
    >
      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name + Email */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="name"
                className="text-[14px] font-semibold text-slate-700 mb-2 block"
              >
                Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                {...register("name")}
                className="
                  h-11 rounded-sm text-[14px]
                  border-[#D1D5DB] bg-[#FFFFFF]
                  focus:border-[#800020] focus:ring-[#800020]
                  transition-colors duration-200
                "
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-[14px] font-semibold text-slate-700 mb-2 block"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="
                  h-11 rounded-sm text-[14px]
                  border-[#D1D5DB] bg-[#FFFFFF]
                  focus:border-[#800020] focus:ring-[#800020]
                  transition-colors duration-200
                "
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label
              htmlFor="subject"
              className="text-[14px] font-semibold text-slate-700 mb-2 block"
            >
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="How can we help?"
              {...register("subject")}
              className="
                h-11 rounded-sm text-sm
                border-[#D1D5DB] bg-[#FFFFFF]
                focus:border-[#800020] focus:ring-[#800020]
                transition-colors duration-200
              "
            />
            {errors.subject && (
              <p className="text-red-500 text-[14px] mt-2">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label
              htmlFor="message"
              className="text-[14px] font-semibold text-slate-700 mb-2 block"
            >
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              rows={6}
              {...register("message")}
              className="
                rounded-sm text-[14px]
                border-[#D1D5DB] bg-[#FFFFFF]
                resize-none
                focus:border-[#800020] focus:ring-[#800020]
                transition-colors duration-200
              "
            />
            {errors.message && (
              <p className="text-red-500 text-[14px] mt-2">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full h-11
              bg-[#800020] hover:bg-[#600018]
              text-white text-[14px] font-semibold
              rounded-sm shadow-md hover:shadow-lg
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            {/* <Send className="w-4 h-4" /> */}
          </Button>
        </form>
      </div>
    </Card>
  );
}
