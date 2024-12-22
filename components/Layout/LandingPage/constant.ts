import {
  BellRing,
  Calendar,
  Combine,
  LayoutList,
  Link,
  LogIn,
  Share2,
  SquarePen,
  TableCellsMerge,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaGoogle } from "react-icons/fa";

export const getFeatures = async () => {
  const t = await getTranslations("Landing.Features.features");
  return [
    {
      icon: Calendar,
      title: t("feature1.title"),
      description: t("feature1.description"),
    },
    {
      icon: Share2,
      title: t("feature2.title"),
      description: t("feature2.description"),
    },
    {
      icon: TableCellsMerge,
      title: t("feature3.title"),
      description: t("feature3.description"),
    },
    {
      icon: LayoutList,
      title: t("feature4.title"),
      description: t("feature4.description"),
    },
    {
      icon: LogIn,
      title: t("feature5.title"),
      description: t("feature5.description"),
    },
    {
      icon: FaGoogle,
      title: t("feature6.title"),
      description: t("feature6.description"),
    },
  ];
};

export const getSteps = async () => {
  const t = await getTranslations("Landing.HowItWorks.steps");
  return [
    {
      icon: SquarePen,
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      icon: Link,
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      icon: Combine,
      title: t("step3.title"),
      description: t("step3.description"),
    },
    {
      icon: BellRing,
      title: t("step4.title"),
      description: t("step4.description"),
    },
  ];
};

export const getTestimonials = async () => {
  const t = await getTranslations("Landing.Testimonials.testimonials");
  return [
    {
      quote: t("quote1.quote"),
      author: t("quote1.author"),
      role: t("quote1.role"),
    },
    {
      quote: t("quote2.quote"),
      author: t("quote2.author"),
      role: t("quote2.role"),
    },
  ];
};
