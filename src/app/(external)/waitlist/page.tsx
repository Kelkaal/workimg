"use client";

import React, { useState } from "react";
import Header from "@/components/waitlist/Header";
import Hero from "@/components/waitlist/sections/Hero";
import Preview from "@/components/waitlist/sections/Preview";
import Countdown from "@/components/waitlist/sections/Countdown";
import Benefits from "@/components/waitlist/sections/Benefits";
import Features from "@/components/waitlist/sections/Features";
import JoinWaitlistForm from "@/components/waitlist/JoinWaitlistForm";
import FAQ from "@/components/waitlist/FAQ";
import Footer from "@/components/waitlist/Footer";

export default function WaitlistPage() {
  const [launchDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 45);
    return date;
  });

  const handleScrollToJoin = () => {
    const joinSection = document.getElementById("join");
    joinSection?.scrollIntoView({ behavior: "smooth" });
  };

  // const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Waitlist form submitted!");

  //   const messageBox = document.getElementById("waitlist-message-box");
  //   if (messageBox) {
  //     messageBox.textContent = "✅ Success! You have joined the waitlist.";
  //     messageBox.classList.remove("hidden");
  //     messageBox.classList.add("block");
  //     setTimeout(() => messageBox.classList.remove("block"), 5000);
  //     setTimeout(() => messageBox.classList.add("hidden"), 5300);
  //   }
  // };

  return (
    <div className="min-h-screen bg-white font-inter">
      <div
        id="waitlist-message-box"
        className="hidden fixed top-20 left-1/2 -translate-x-1/2 z-100 p-3 rounded-lg bg-green-100 text-green-800 font-medium shadow-xl transition-all duration-300"
      >
        Success message placeholder
      </div>
      <Header handleScrollToJoin={handleScrollToJoin} />
      <Hero handleScrollToJoin={handleScrollToJoin} />
      <Preview />
      <Countdown launchDate={launchDate} />
      <Benefits />
      <Features />
      <JoinWaitlistForm />
      <FAQ />
      <Footer />
    </div>
  );
}
