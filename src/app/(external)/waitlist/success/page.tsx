import { CheckCircle2, Mail, Bell, Gift, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import Button from "@/components/waitlist/ui/Button";

const PRIMARY_COLOR = "#800020";

type WaitlistSuccessProps = {
	searchParams?: Promise<{
		type?: string;
	}>;
};

export default async function WaitlistSuccess(props: WaitlistSuccessProps) {
	const searchParams = await props.searchParams;
	const isReturning = searchParams?.type === "returning";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="bg-pink-100/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-pink-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {isReturning ? "Welcome Back!" : "You're On The List!🎉"}
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            {isReturning
              ? "Great to see you again! You're already on the Inventrix  waitlist. We'll notify you at launch."
              : "Congratulations! You've successfully joined the Inventrix  waitlist."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                Icon: Mail,
                title: "Check Your Email",
                desc: "We've sent a confirmation with your waitlist details.",
              },
              {
                Icon: Bell,
                title: "Stay Updated",
                desc: "Get regular updates on our progress.",
              },
              {
                Icon: Gift,
                title: "Early Access",
                desc: "Priority access and 50% off at launch.",
              },
            ].map(({ Icon, title, desc }, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-[#800020] rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#features" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:cursor-pointer"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <ArrowLeft className="w-6 h-6" />
                Explore Features
              </Button>
            </Link>

            <Button className="px-8 py-4 text-lg font-bold border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white flex items-center justify-center hover:cursor-pointer">
              <Share2 className="w-5 h-5 mr-2" />
              Share with Friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
