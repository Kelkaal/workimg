



"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { easeInOut } from 'framer-motion';

const stats = [
  { label: "App Downloads", value: "50K+" },
  { label: "Average Rating", value: "4.8★" },
  { label: "Access Anywhere", value: "24/7" },
  { label: "Cloud Synced", value: "100%" },
]

const features = [
  {
    title: "Barcode Scanner",
    description:
      "Scan products instantly with your phone camera. Add, update, or check stock levels in seconds.",
    icon: "/barcode.png",
  },
  {
    title: "Push Notifications",
    description:
      "Get instant alerts for low stock, expiring items, and important inventory updates.",
    icon: "/bell.png",
  },
  {
    title: "Photo Capture",
    description:
      "Take photos of products and attach them to inventory items for easy identification.",
    icon: "/cam.png",
  },
  {
    title: "Real-Time Sync",
    description:
      "All changes sync instantly across all devices. Your team always has the latest data.",
    icon: "/reload.png",
  },
]

const actionShots = [
  {
    title: "Dashboard Overview",
    description: "Quick access to all your inventory metrics and insights.",
    image: "/dashboard.png",
  },
  {
    title: "Barcode Scanning",
    description: "Scan products directly from your phone camera.",
    image: "/scan.png",
  },
  {
    title: "Product Details",
    description: "View and update product information on the go.",
    image: "/product.png",
  },
]

const testimonials = [
  {
    name: "James Wilson",
    role: "Store Manager",
    text: `"The mobile app is a game-changer! I can scan products and update inventory while walking through the store. So convenient!"`,
    avatar: "/image1.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Operations Lead",
    text: `"Push alerts keep me updated about low stock levels. I can reorder before we run out. Highly recommend!"`,
    avatar: "/image2.png",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    text: `"I love that everything syncs in real-time across our team. No more guessing what’s in stock."`,
    avatar: "/image3.png",
  },
]

const steps = [
  {
    title: "Download the App",
    description: "Get Inventrix  from the App Store or Google Play Store for free.",
    icon: "/download.png",
  },
  {
    title: "Create Account",
    description: "Sign up with your email or use your existing Inventrix  account.",
    icon: "/account.png",
  },
  {
    title: "Start Managing",
    description:
      "Begin tracking inventory, scanning products, and optimizing stock levels.",
    icon: "/start.png",
  },
]

// === ANIMATION VARIANTS ===
const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.5,
      ease: easeInOut,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: easeInOut,
    },
  },
}

export default function MobileAppPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ================= HERO ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative border-b border-slate-100 bg-white"
      >
        {/* CONTAINER */}
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-10 md:px-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* Left: Text */}
          <motion.div
            variants={staggerContainer}
            className="relative z-20 space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 rounded-full border border-[#800020] bg-[#FCE7EB] px-3 py-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#800020]">
                <Image
                  src="/phoneicon.png"
                  alt="phoneicon"
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#800020]">
                Available on iOS & Android
              </p>
            </motion.div>

            {/* Heading */}
            <motion.div variants={staggerItem} className="space-y-4">
              <h1 className="text-[36px] md:text-[40px] font-bold leading-tight text-slate-900">
                Inventrix Mobile App
              </h1>
              <p className="max-w-md text-[15px] font-medium leading-relaxed text-slate-600">
                Download the Inventrix mobile app and take control of your
                inventory on the go. Scan barcodes, update stock levels, and get
                real-time alerts right from your phone.
              </p>
            </motion.div>

            {/* Rating row */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap items-center gap-5 text-[11px] text-slate-600"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-[3px] bg-yellow-400" />
                <span className="font-semibold text-slate-900">4.8/5</span>
                <span>Rating</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-[3px] bg-[#ff4f8b]" />
                <span className="font-semibold text-slate-900">50K+</span>
                <span>Downloads</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-[3px] bg-emerald-400" />
                <span>100% Secure</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md"
            >
              <div className="relative overflow-hidden rounded-4xl bg-white shadow-xl ring-1 ring-slate-200">
                <div className="relative w-full aspect-3/4">
                  <Image
                    src="/screen.png"
                    alt="Mobile app on phone"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Free Badge */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute bottom-[-26px] left-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg border border-slate-200"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-50">
                  <span className="h-3 w-3 rounded-lg bg-emerald-400" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-slate-900">
                    Free
                  </span>
                  <span className="text-xs text-slate-500">To Download</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ⬇️ your other sections (stats, features, etc.) stay exactly the same here */}
      {/* ================= STATS BAR ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="bg-[#7b001f] px-6 py-6 text-white md:px-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="space-y-1 text-[16px]"
            >
              <p className="text-[30px] font-bold">{stat.value}</p>
              <p className="text-xs text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="px-6 py-10 md:px-10 md:py-14 bg-white"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[30px] md:text-[32px] font-bold text-[#111827] leading-snug">
            Powerful Features in Your Pocket
          </h2>
          <p className="mt-2 text-[15px] text-[#4B5563] leading-relaxed">
            Everything you need to manage inventory from your mobile device.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fae9ec]">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= SEE IT IN ACTION ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="border-t border-slate-100 px-6 py-10 md:px-10 md:py-14 bg-white"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[30px] font-bold text-[#111827] leading-snug">
            See It In Action
          </h2>
          <p className="mt-2 text-[15px] text-[#4B5563]">
            A glimpse of the Inventrix mobile experience.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {actionShots.map((shot) => (
            <motion.div
              key={shot.title}
              variants={staggerItem}
              className="flex flex-col items-center text-center"
            >
              {/* hover ONLY on the image */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 28px rgba(15,23,42,0.15)", // softer shadow
                }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="relative w-full max-w-xs aspect-3/5 overflow-hidden rounded-3xl bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
              >
                <Image
                  src={shot.image}
                  alt={shot.title}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                {shot.title}
              </p>
              <p className="mt-1 max-w-80 text-[12px] leading-6 text-[#4B5563]">
                {shot.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= TESTIMONIALS ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="border-t border-slate-100 px-6 py-10 md:px-10 md:py-14 bg-white"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[30px] font-bold text-[#111827] leading-snug">
            What Users Are Saying
          </h2>
          <p className="mt-1 text-[15px] text-[#4B5563]">
            Real reviews from real users.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{
                scale: 1.03,
                y: -4,
                boxShadow: "0 22px 50px rgba(15,23,42,0.16)",
              }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm"
            >
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                {t.text}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111827] leading-5">
                    {t.name}
                  </p>
                  <p className="text-[12px] text-[#4B5563] leading-4">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= STEPS ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="border-t border-slate-100 px-6 py-10 md:px-10 md:py-14 bg-white"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[30px] font-bold text-[#111827] leading-snug">
            Get Started in 3 Easy Steps
          </h2>
          <p className="mt-1 text-[15px] text-[#4B5563]">
            Download and start managing inventory in minutes.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-10 grid max-w-2xl gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              whileHover={{
                scale: 1.05,
                y: -6,
                boxShadow: "0 24px 60px rgba(15,23,42,0.2)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 19 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-md"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#800020] text-[14px] font-semibold text-[white] shadow-[0_0_16px_rgba(128,0,32,0.7)]">
                {index + 1}
              </div>

              <div className="relative h-10 w-10">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-[16px] font-bold text-[#111827] leading-5">
                {step.title}
              </h3>

              <p className="text-[12px] leading-5 text-[#4B5563] font-medium max-w-[220px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="bg-[#7b001f] px-6 py-10 text-white md:px-10 md:py-14"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-6">
          <div className="space-y-3">
            <p className="text-[28px] md:text-[30px] font-bold leading-snug tracking-wide text-white">
              Ready to Take Control of Your <br /> Inventory?
            </p>
            <h2 className="text-[15px] font-semibold leading-5 text-white/90">
              Download the Inventrix app today and experience the future of
              inventory management.
            </h2>
          </div>

          {/* Store buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* App Store Button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group flex h-16 w-44 items-center gap-3 rounded-2xl bg-white px-3 shadow-lg"
            >
              <Image
                src="/apple.png"
                alt="App Store"
                width={30}
                height={30}
                className="object-contain"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[12px] leading-5 text-black/80">
                  Download on the
                </span>
                <span className="text-[18px] font-bold leading-5 text-black">
                  App Store
                </span>
              </div>
            </motion.button>

            {/* Google Play Button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group flex h-16 w-44 items-center gap-3 rounded-2xl bg-white px-3 shadow-lg"
            >
              <Image
                src="/gets.png"
                alt="Google Play"
                width={30}
                height={30}
                className="object-contain"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[12px] leading-5 text-black/80">
                  GET IT ON
                </span>
                <span className="text-[18px] font-bold leading-5 text-black">
                  Google Play
                </span>
              </div>
            </motion.button>
          </div>

          {/* Bottom features */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/good.png"
                alt="free icon"
                width={14}
                height={14}
                className="object-contain"
              />
              <span className="text-[14px] text-white">Free to download</span>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/good.png"
                alt="sync icon"
                width={14}
                height={14}
                className="object-contain"
              />
              <span className="text-[14px] text-white">Real-time sync</span>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/good.png"
                alt="no card icon"
                width={14}
                height={14}
                className="object-contain"
              />
              <span className="text-[14px] text-white">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ⬇️ your other sections (stats, features, etc.) stay exactly the same here */}
    </main>
  );
}
