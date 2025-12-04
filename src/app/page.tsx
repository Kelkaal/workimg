import CTA from "@/components/home/sections/CTA";
import EverythingYouNeedToKnow from "@/components/home/sections/EverythingYouNeedToKnow";
import FAQ from "@/components/home/sections/FAQ";
import GetStarted from "@/components/home/sections/GetStarted";
import HomeHero from "@/components/home/sections/HomeHero";
import KeyMetrics from "@/components/home/sections/KeyMetrics";
import Testimonials from "@/components/home/sections/Testimonials";
import WhyInventrix from "@/components/home/sections/WhyInventrix";
import LayoutFooter from "./layout/LayoutFooter";
import LayoutHeader from "./layout/LayoutHeader";
import './globals.css';

const page = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto">
        <LayoutHeader />
        <HomeHero />
        <KeyMetrics />
        <EverythingYouNeedToKnow />
        <GetStarted />
        <WhyInventrix />
        <Testimonials />
        <FAQ />
        <CTA />
        <LayoutFooter />
      </div>
    </div>
  );
};

export default page;
