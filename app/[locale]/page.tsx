import { auth } from "@/auth";
import Features from "@/components/Layout/LandingPage/feature";
import Hero from "@/components/Layout/LandingPage/hero";
import HowItWorks from "@/components/Layout/LandingPage/howitworks";
import Testimonials from "@/components/Layout/LandingPage/testimonials";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === "vi" ? "1MIN2MEET - Lên Lịch Họp Nhanh" : "1MIN2MEET - Fast Meeting Scheduler",
    description:
    locale === "vi"
    ? "Lên lịch họp nhanh chóng trong 1 phút"
    : "Fast meeting scheduler in 1 minute",
    keywords: [
      "meetings",
      "quick meetings",
      "meeting scheduler",
      "meeting planer",
      "appointment scheduler",
    ],
    openGraph: {
      title: "1min2meet - Quick Online Meeting Platform",
      description:
        "Connect with people through quick 1-minute meetings. An efficient way to network, interview, or meet new people online.",
      type: "website",
      locale: "en_US",
      url: "https://1min2meet.vercel.app/",
      images: "@/favicon.ico",
    },
  };
}

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
