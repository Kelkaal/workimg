// app/waitlist/error/page.tsx
'use client';

import {
	AlertTriangle,
	RotateCcw, // "Try Again" single arrow loop icon
	Headphones, // Support headset icon
	Clock, // Timer icon for "Try Later"
	Mail, // Envelope icon for Contact Support button
	AlertCircle, // Tiny exclamation circle for "Common Issues"
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/waitlist/ui/Button';

const PRIMARY_COLOR = '#800020';

export default function WaitlistError() {
	return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="bg-red-100/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-red-100">
          {/* Main Error Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle className="w-14 h-14 text-red-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Oops! Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            We couldn&apos;t process your waitlist submission at this time.
          </p>

          {/* Common Issues — ALWAYS left-aligned on all devices */}
          <div className="bg-red-50/70 rounded-2xl p-6 mb-12 border border-red-200 text-left max-w-3xl mx-auto">
            <p className="font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-800" />
              Common Issues:
            </p>
            <ul className="space-y-3 text-sm text-red-700">
              {[
                "Email address may already be registered",
                "Network connection issue — please check your internet",
                "Invalid email format entered",
                "Server temporarily unavailable",
              ].map((issue, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 shrink-0"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Cards — Updated Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                Icon: RotateCcw,
                title: "Try Again",
                desc: "Double-check your email and submit again.",
              },
              {
                Icon: Headphones,
                title: "Contact Support",
                desc: "Our team is here to help you.",
              },
              {
                Icon: Clock,
                title: "Try Later",
                desc: "Come back in a few minutes.",
              },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 
                           flex flex-col items-center md:items-start 
                           text-center md:text-left 
                           transition-all hover:shadow-xl"
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

          {/* Action Buttons — Updated Icons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:cursor-pointer text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <RotateCcw className="w-6 h-6" />
                Try Again
              </Button>
            </Link>

            <Button className="w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-full border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white flex items-center justify-center gap-3 transition-all hover:cursor-pointer">
              <Mail className="w-6 h-6" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
