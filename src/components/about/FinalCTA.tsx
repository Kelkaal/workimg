import React from 'react'
import { FaEnvelope, FaRocket } from 'react-icons/fa6';
import { Link } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="bg-[#800020] py-20">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join Us on Our Journey
        </h2>
        <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
          Whether you are looking to transform your inventory management or join our team, we&apos;d love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/signup"
            className="flex items-center bg-white text-[#800020] justify-center gap-2 py-6 px-16 font-semibold 
             rounded-md cursor-pointer border border-transparent
             transition-all duration-300 ease-out
             hover:bg-[#800020] hover:text-white hover:border-white hover:shadow-lg"
          >
            <FaRocket className="w-4 h-4" />
            Start Your Free Trial
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 py-6 px-16 font-semibold cursor-pointer 
             text-white border border-white rounded-md
             bg-transparent
             transition-all duration-300 ease-out
             hover:bg-white hover:text-[#800020] hover:shadow-lg"
          >
            <FaEnvelope className="w-2 h-2" />
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
