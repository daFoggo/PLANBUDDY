import Features from "@/components/Layout/LandingPage/feature";
import Hero from "@/components/Layout/LandingPage/hero";
import HowItWorks from "@/components/Layout/LandingPage/howitworks";
import Testimonials from "@/components/Layout/LandingPage/testimonials";
import { redirect } from "next/navigation";
import { auth } from "./auth";

const Home = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
  );
};

export default Home;
