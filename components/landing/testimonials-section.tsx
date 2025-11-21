"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal";

const testimonials = [
  {
    name: "Michael Johnson",
    role: "CEO, TechCorp",
    avatar: "michael-johnson",
    rating: 5,
    text: "Analytics Pro has completely transformed our approach to working with data. Now we make decisions based on real data, not guesses.",
  },
  {
    name: "Sarah Williams",
    role: "Analyst, DataFlow",
    avatar: "sarah-williams",
    rating: 5,
    text: "Amazing tool! Intuitive interface, powerful visualization capabilities. Saves us dozens of hours every week.",
  },
  {
    name: "David Anderson",
    role: "Director, BusinessMetrics",
    avatar: "david-anderson",
    rating: 5,
    text: "The best investment we made this year. ROI exceeded all expectations. The team is thrilled with the capabilities.",
  },
  {
    name: "Emily Martinez",
    role: "CFO, FinancePro",
    avatar: "emily-martinez",
    rating: 5,
    text: "Excellent platform for managing financial analytics. Reliable, fast, and very functional. Highly recommend!",
  },
  {
    name: "James Thompson",
    role: "CTO, StartupHub",
    avatar: "james-thompson",
    rating: 5,
    text: "The API works great, integration was simple. Now all our data is in one place. Very satisfied with the choice.",
  },
  {
    name: "Jessica Brown",
    role: "Product Manager, InnovateLab",
    avatar: "jessica-brown",
    rating: 5,
    text: "User experience is top-notch. The team got full access to needed metrics in just minutes.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What our clients say
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Join thousands of satisfied users around the world
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollRevealItem key={index} type="fadeUp" duration={0.6}>
              <SpotlightCard className="h-full">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        &quot;{testimonial.text}&quot;
                      </p>

                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Avatar>
                          <AvatarImage
                            src={`/avatars/${testimonial.avatar}.webp`}
                            alt={testimonial.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </ScrollRevealItem>
          ))}
        </ScrollRevealContainer>
      </div>
    </section>
  );
}
