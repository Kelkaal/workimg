"use client";

import React from "react";
import { FaRocket as FaRocketAlt } from "react-icons/fa6";
import { MdNotifications } from "react-icons/md";
import Button from "@/components/waitlist/ui/Button";
import { PRIMARY_COLOR } from "@/lib/constants";

interface HeroProps {
  handleScrollToJoin: () => void;
}

export default function Hero({ handleScrollToJoin }: HeroProps) {
  return (
    <>
      <section className="lg:py-6 py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div
            onClick={handleScrollToJoin}
            className="inline-flex items-center gap-2 bg-[#FCE7EB] rounded-full cursor-pointer mb-6 text-[10px]  lg:text-[14px] font-bold"
            style={{
              color: PRIMARY_COLOR,
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <FaRocketAlt className="lg:mr-2 lg:h-4 lg:w-4  h-3 w-3 mr-1" />
            Launching Soon - Reserve Your Spot Now
            <style jsx>{`
              @keyframes pulseScaleShadow {
                0%,
                100% {
                  transform: scale(1);
                  box-shadow: 0 0 0 0 rgba(252, 231, 235, 0.5);
                }
                50% {
                  transform: scale(1.05);
                  box-shadow: 0 0 20px 10px rgba(252, 231, 235, 0.5);
                }
              }
            `}</style>
          </div>
          <h1 className="text-4xl md:text-[48px] font-extrabold mb-6 leading-tight">
            Smart Inventory Management
            <br />
            <span className="" style={{ color: PRIMARY_COLOR }}>
              Made Simple
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join <b>2,847</b> businesses waiting for the revolutionary platform
            that will transform how they handle stock, shipments, and supply
            chain logistics.
          </p>
          <Button
            variant="primary"
            className={`
              text-base sm:text-lg flex items-center mx-auto justify-center gap-2 
              border border-transparent hover:cursor-pointer
              hover:bg-white 
              hover:text-[${PRIMARY_COLOR}] 
              hover:border-[${PRIMARY_COLOR}]
            `}
            onClick={handleScrollToJoin}
          >
            <MdNotifications />
            Join the Waitlist
          </Button>
        </div>
        <div className="text-[#6B7280] mt-3 text-sm">
          Get 50% off when we launch • No credit card required
        </div>
      </section>
    </>
  );
}