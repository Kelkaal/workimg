import AboutHero from '@/components/about/AboutHero';
import AboutHeroImage from '@/components/about/AboutHeroImage';
import StatsBar from '@/components/about/StatsBar';
import OurStory from '@/components/about/OurStory';
import MissionVision from '@/components/about/MissionVision';
import CoreValues from '@/components/about/CoreValues';
import FinalCTA from '@/components/about/FinalCTA';
import LayoutWrapper from "@/app/layout/LayoutWrapper";

export default function AboutPage() {
	return (
		<>  <LayoutWrapper >
			<AboutHero />
			<AboutHeroImage />
			<StatsBar />
			<OurStory />
			<MissionVision />
			<CoreValues />
			<FinalCTA />
			</LayoutWrapper>
		</>
	);
}
