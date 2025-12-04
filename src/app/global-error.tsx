"use client";

import Image from "next/image";

// The error component receives the error and a reset function
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
          <div className="max-w-md text-center">
            {/* 500 Container styled like your screenshot's central box */}
            <div className="p-12  border border-gray-100">
              {/* Alert Icon Area */}
              <Image
                src="/five-warning.png"
                alt="User icon"
                width={52}
                height={52}
                className="h-35 w-35 object-cover"
              />

              <h1 className="text-4xl font-bold mb-3">500</h1>
              <h2 className="text-xl font-semibold mb-6">
                Internal Server Error
              </h2>
              <p className="text-gray-600 mb-8">
                Oops! Something went wrong on our end. Were working on fixing
                the issue. Please try again later.
              </p>

              <button
                onClick={reset}
                className="px-6 py-3 bg-[#800020] text-white rounded-md hover:bg-[#6a001a] transition duration-150"
              >
                Try Again
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100 text-sm">
                <p className="font-semibold mb-1">Need Immediate Help?</p>
                <p className="text-gray-500">
                  If this problem persists, please contact our support team.
                </p>
                <p className="text-[#800020] font-medium mt-1">
                  ✉️ support@inventrix .com
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
