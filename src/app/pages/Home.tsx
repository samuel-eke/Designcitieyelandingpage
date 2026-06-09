import { Hero } from "../components/home/Hero";
import { Services } from "../components/home/Services";
import { Promise } from "../components/home/Promise";
import { LifeStages } from "../components/home/LifeStages";
import { WhyExists } from "../components/home/WhyExists";
import { StateMap } from "../components/home/StateMap";
import { FAQ } from "../components/home/FAQ";
import { CTABanner } from "../components/home/CTABanner";

export function Home() {
  return (
    <div className="flex flex-col w-full items-center">
      <Hero />
      <WhyExists />
      <Services />
      <Promise />
      <LifeStages />
      <StateMap />
      <FAQ />
      <CTABanner />
    </div>
  );
}
