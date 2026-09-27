import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import {
  Comparison,
  Faq,
  Features,
  FinalCta,
  HowItWorks,
  Languages,
  Personas,
  Problems,
} from "@/components/landing/sections";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { StickyCta } from "@/components/landing/sticky-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problems />
        <Languages />
        <HowItWorks />
        <Features />
        <Comparison />
        <Personas />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
