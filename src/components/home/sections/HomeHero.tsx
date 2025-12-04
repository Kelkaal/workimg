"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { FaCircleCheck, FaGift, FaRocket, FaUsers } from "react-icons/fa6";
import { BsGraphUp } from "react-icons/bs";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";

const PRIMARY_COLOR = "#800020";

const HomeHero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToJoin = () => {
    console.log("Scrolling to join section...");
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
      })
        .from(".hero-heading", {
          y: 40,
          opacity: 0,
          duration: 0.7,
        })
        .from(".hero-text", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(".hero-buttons", {
          opacity: 0,
          y: 30,
          duration: 0.6,
        })
        .from(".hero-checks", {
          opacity: 0,
          stagger: 0.15,
          y: 15,
          duration: 0.5,
        })
        .from(".hero-image", {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
        })
        .from(".hero-overlay", {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.6,
        });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="pt-[74px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden">
          {/* TEXT CONTENT */}
          <div className="flex flex-col gap-6">
            <div
              onClick={handleScrollToJoin}
              className="bg-[#FCE7EB] font-bold text-xs inline-flex items-center gap-2 rounded-full py-2 px-4 cursor-pointer hero-badge self-start"
              style={{
                color: PRIMARY_COLOR,
                animation: "pulseScaleShadow 2s infinite",
              }}
            >
              <FaGift className="h-3 w-3" />
              Start Your 14-Day Free Trial Today
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

            <h1 className="hero-heading text-4xl font-bold leading-tight text-[#111827]">
              Manage Your Inventory with{" "}
              <span className="text-[#800020]">Confidence</span>
            </h1>

            <p className="hero-text text-base text-[#6B7280] leading-relaxed">
              Inventrix helps businesses track, manage, and optimize their
              inventory in real-time. Say goodbye to stockouts and overstocking
              with intelligent inventory management.
            </p>

            <div className="hero-buttons flex flex-col gap-3">
              <Link href="/signup" className="inline-block">
                <Button
                  className="flex items-center justify-center gap-2 font-semibold text-white hover:bg-[#6a001a] px-6 py-3 rounded-lg w-full"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <FaRocket className="w-4 h-4" />
                  Start Free Trial - No Credit Card
                </Button>
              </Link>

              {/* <button className="flex items-center justify-center gap-2 font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg w-full">
                <span className="w-4 h-4">▶</span>
                Watch Demo
              </button> */}
            </div>

            <div className="mt-2 flex flex-col gap-2 text-sm text-[#6B7280]">
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* MOBILE IMAGE */}
          <div className="relative w-full hero-image">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/assets/home-hero.png"
                alt="Inventory management dashboard"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />

              {/* USERS OVERLAY */}
              <div
                className="hero-overlay absolute top-4 right-4 text-white font-semibold flex items-center p-3 rounded-lg gap-2"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <div className="bg-white/20 p-2 rounded-full">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-lg">5,000+</p>
                  <p className="font-medium text-xs opacity-90">Happy Users</p>
                </div>
              </div>

              {/* ACCURACY OVERLAY */}
              <div className="hero-overlay absolute bottom-4 left-4 bg-white font-semibold flex items-center p-3 rounded-lg gap-2">
                <div className="bg-[#DCFCE7] p-2 rounded-full">
                  <BsGraphUp className="w-4 h-4 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-lg text-[#111827]">98%</p>
                  <p className="font-medium text-xs text-[#6B7280]">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden flex-col gap-8">
          {/* TEXT CONTENT */}
          <div className="flex flex-col gap-6">
            <div
              onClick={handleScrollToJoin}
              className="bg-[#FCE7EB] font-bold text-xs inline-flex items-center gap-2 rounded-full py-2 px-4 cursor-pointer hero-badge self-start"
              style={{
                color: PRIMARY_COLOR,
              }}
            >
              <FaGift className="h-3 w-3" />
              Start Your 14-Day Free Trial Today
            </div>

            <h1 className="hero-heading text-5xl font-bold leading-tight text-[#111827]">
              Manage Your Inventory with{" "}
              <span className="text-[#800020]">Confidence</span>
            </h1>

            <p className="hero-text text-lg text-[#6B7280] leading-relaxed">
              Inventrix helps businesses track, manage, and optimize their
              inventory in real-time. Say goodbye to stockouts and overstocking
              with intelligent inventory management.
            </p>

            <div className="hero-buttons flex gap-3">
              <Link href="/signup">
                <Button
                  className="flex items-center justify-center gap-2 font-semibold text-white hover:bg-[#6a001a] px-6 py-3 rounded-lg"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <FaRocket className="w-4 h-4" />
                  Start Free Trial - No Credit Card
                </Button>
              </Link>

              {/* <button className="flex items-center justify-center gap-2 font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg">
                <span className="w-4 h-4">▶</span>
                Watch Demo
              </button> */}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* TABLET IMAGE */}
          <div className="relative w-full hero-image">
            <div className="relative rounded-xl ">
              <Image
                src="/assets/hero-image-tablet.png"
                alt="Inventory management dashboard"
                width={1024}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />

              {/* USERS OVERLAY */}
              <div
                className="hero-overlay absolute top-6 right-6 text-white font-semibold flex items-center p-6 rounded-xl gap-3"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-2xl">5,000+</p>
                  <p className="font-medium text-sm opacity-90">Happy Users</p>
                </div>
              </div>

              {/* ACCURACY OVERLAY */}
              <div className="hero-overlay absolute bottom-6 left-6 bg-white font-semibold flex items-center p-6 rounded-xl gap-3">
                <div className="bg-[#DCFCE7] p-3 rounded-full">
                  <BsGraphUp className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#111827]">98%</p>
                  <p className="font-medium text-sm text-[#6B7280]">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex lg:items-center lg:gap-12">
          {/* TEXT CONTENT */}
          <div className="flex flex-col gap-6 lg:w-1/2">
            <div
              onClick={handleScrollToJoin}
              className="bg-[#FCE7EB] font-bold text-xs inline-flex items-center gap-2 rounded-full py-2 px-4 cursor-pointer hero-badge self-start"
              style={{
                color: PRIMARY_COLOR,
              }}
            >
              <FaGift className="h-3 w-3" />
              Start Your 14-Day Free Trial Today
            </div>

            <h1 className="hero-heading text-[60px] xl:text-6xl font-bold leading-[60px] text-[#111827]">
              Manage Your Inventory with{" "}
              <span className="text-[#800020]">Confidence</span>
            </h1>

            <p className="hero-text text-lg text-[#6B7280]">
              Inventrix helps businesses track, manage, and optimize their
              inventory in real-time. Say goodbye to stockouts and overstocking
              with intelligent inventory management.
            </p>

            <div className="hero-buttons flex gap-3">
              <Link href="/signup">
                <Button
                  className="flex items-center justify-center gap-2 font-semibold text-white hover:bg-[#6a001a] px-6 py-3 rounded-lg"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <FaRocket className="w-4 h-4" />
                  Start Free Trial - No Credit Card
                </Button>
              </Link>

              {/* <button className="flex items-center justify-center gap-2 font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg">
                <span className="w-4 h-4">▶</span>
                Watch Demo
              </button> */}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="hero-checks flex items-center gap-2">
                <FaCircleCheck className="text-[#22C55E] w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* DESKTOP IMAGE */}
          <div className="relative lg:w-1/2 hero-image mt-9">
            <div className="relative rounded-2xl ">
              <Image
                src="/assets/hero-image-tablet.png"
                alt="Inventory management dashboard"
                width={1600}
                height={1600}
                className="w-full h-auto object-cover"
                priority
              />

              {/* USERS OVERLAY */}
              <div
                className="hero-overlay absolute -top-2 right-2 text-white font-semibold flex items-center p-6 rounded-xl gap-3"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-2xl">5,000+</p>
                  <p className="font-medium text-sm opacity-90">Happy Users</p>
                </div>
              </div>

              {/* ACCURACY OVERLAY */}
              <div className="hero-overlay absolute bottom-6 left-2 bg-white font-semibold flex items-center p-6 rounded-xl gap-3">
                <div className="bg-[#DCFCE7] p-3 rounded-full">
                  <BsGraphUp className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#111827]">98%</p>
                  <p className="font-medium text-sm text-[#6B7280]">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
