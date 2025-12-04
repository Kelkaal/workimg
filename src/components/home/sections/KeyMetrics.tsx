"use client";

import React from "react";
import CountUp from "react-countup";

const metrics = [
  { value: 5000, suffix: "+", label: "Active Users" },
  { value: 1, suffix: "M+", label: "Products Tracked" },
  { value: 99.9, suffix: "%", label: "Uptime" },
  { value: 24, suffix: "/7", label: "Support" },
];

const KeyMetrics = () => {
  return (
    <section className="mt-20 bg-[#800020] py-16">
      <div className="grid grid-cols-2 gap-10 px-6 md:px-12 lg:px-20 lg:grid-cols-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 text-center"
          >
            <h2 className="text-4xl font-bold leading-tight text-white">
              <CountUp
                end={item.value}
                duration={2}
                separator=","
              />
              {item.suffix}
            </h2>

            <p className="text-base font-medium leading-6 text-[#F9D0D9]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyMetrics;
