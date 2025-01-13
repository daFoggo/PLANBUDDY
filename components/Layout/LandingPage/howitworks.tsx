import { Card, CardContent } from "@/components/ui/card";
import { getSteps } from "./constant";
import { getTranslations } from "next-intl/server";

const HowItWorks = async () => {
  const t = await getTranslations("Landing.HowItWorks");
  const steps = await getSteps();
  return (
    <section className="container mx-auto px-4 py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
        {t("title")}
      </h2>
      <p className="text-center text-muted-foreground text-sm sm:text-base font-semibold mb-12 max-w-2xl mx-auto">
        {t("description")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="border-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-1"
          >
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center text-2xl font-bold">
                {index + 1}
              </div>
              <div className="mb-4">
                {step.icon && <step.icon className="size-6 text-primary" />}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
