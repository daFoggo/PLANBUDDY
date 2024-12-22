import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { features } from "./constant";

const Features = () => {
  return (
    <section className="container mx-auto p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Key Features</h2>
      <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 font-semibold mx-auto">
        Discover how 1MIN2MEET revolutionizes your meeting planning experience with these powerful features.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="transition-all duration-300 ease-in-out transform hover:shadow-md hover:-translate-y-2"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <feature.icon className="size-6 text-primary/70 group-hover:text-primary transition-colors duration-300" />
              </div>
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;

