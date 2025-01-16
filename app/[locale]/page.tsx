import Features from "@/components/Layout/LandingPage/feature";
import Hero from "@/components/Layout/LandingPage/hero";
import HowItWorks from "@/components/Layout/LandingPage/howitworks";
import Testimonials from "@/components/Layout/LandingPage/testimonials";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Metadata } from "next/types";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return {
    title: locale === "vi" ? "PLANBUDDY" : "PLANBUDDY",
    description:
      locale === "vi"
        ? "Tạo lịch hẹn nhanh chóng trong 1 phút"
        : "Fast meeting scheduler in 1 minute",
    keywords: [
      "plan",
      "buddy",
      "meetings",
      "quick meetings",
      "meeting scheduler",
      "meeting planer",
      "appointment scheduler",
    ],
    openGraph: {
      title: "PLANBUDDY - Fast meeting scheduler",
      description: "Schedule meeting in 1 minute",
      type: "website",
      locale: "en_US",
      url: "https://planbuddy.info/",
      images: "@/favicon.ico",
    },
  };
}

const Home = async () => {
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
