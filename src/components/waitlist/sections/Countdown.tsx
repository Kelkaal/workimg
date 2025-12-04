"use client";

import React, { useState, useEffect } from "react";
import { PRIMARY_COLOR } from "@/lib/constants";

interface CountdownProps {
  targetDate: Date;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownState | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      let calculatedTime: CountdownState | null = null;

      if (difference > 0) {
        calculatedTime = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(calculatedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents: React.ReactElement[] = [];
  if (timeLeft) {
    Object.keys(timeLeft).forEach((intervalKey) => {
      const interval = intervalKey as keyof CountdownState;
      const value = timeLeft[interval];

      timerComponents.push(
        <div
          key={interval}
          className="flex flex-col items-center justify-between p-6  bg-white/10 bg-opacity-10 rounded-xl sm:px-12 lg:px-16 lg:py-6 sm:py-4 shadow-lg"
        >
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums">
            {value < 10 ? `0${value}` : value || "00"}
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wide mt-1 sm:mt-2 opacity-90">
            {interval}
          </span>
        </div>
      );
    });
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-8">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-white text-lg font-semibold">
          Launching Soon!
        </span>
      )}
    </div>
  );
};

interface CountdownSectionProps {
  launchDate: Date;
}

export default function Countdown({ launchDate }: CountdownSectionProps) {
  return (
    <section
      className="py-16 text-white"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Launching in</h2>
        <p className="text-base opacity-90 mb-8">
          Dont miss the exclusive early adopter benefits!
        </p>
        <CountdownTimer targetDate={launchDate} />
      </div>
    </section>
  );
}
