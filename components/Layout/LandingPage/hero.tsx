import { getTranslations } from "next-intl/server";
import GetStarted from "./get-started";

const Hero = async () => {
  const t = await getTranslations("Landing.Hero");
  return (
    <section className="container mx-auto px-4 py-24 text-center rounded-lg space-y-8 relative overflow-hidden">
      <div className="animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent pb-2">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text  text-transparent">
          {t("subtitle")}
        </p>
      </div>

      <p className="text-lg mx-auto text-muted-foreground max-w-2xl animate-fade-in-up">
        {t("description")}
      </p>

      <div className="animate-fade-in-up">
        <GetStarted />
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 dark:bg-primary/30 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 dark:bg-primary/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 dark:bg-primary/30 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
