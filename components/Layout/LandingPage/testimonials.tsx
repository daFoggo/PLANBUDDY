import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { testimonials } from "./constant";
import { QuoteIcon } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-muted/50 to-muted/30 py-24 rounded-lg mb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          What our users say
        </h2>
        <p className="text-center text-muted-foreground text-sm sm:text-base font-semibold mb-12 max-w-2xl mx-auto">
          Discover how 1MIN2MEET has transformed meeting planning for
          professionals across industries
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="pt-6 relative">
                <QuoteIcon className="absolute top-4 left-4 text-primary/20 size-6" />
                <p className="text-lg italic font-medium ml-8 mb-4">
                  {testimonial.quote}
                </p>
              </CardContent>
              <CardFooter className="flex items-center space-x-4 bg-muted/10 rounded-b-lg p-4">
                <Avatar className="border-2 border-primary">
                  <AvatarFallback className="font-semibold text-primary bg-primary/10">
                    {testimonial.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
