// app/home/page.tsx

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Hi there! Youve successfully logged out.
      </h1>
          <p className="text-lg text-gray-600 mb-8">
            Click the link below to log back in.
      </p>
      <Link
        href="/signin"
        className="px-6 py-3 bg-[#900022] text-white rounded-lg hover:bg-[#7a001d] transition shadow-md"
      >
        Go to Login
      </Link>
    </div>
  );
}
