"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal";
import { useState } from "react";

const faqs = [
  {
    question: "How do I get started with the platform?",
    answer:
      "Simply sign up and create an account. You'll be able to start using basic features right away. For more advanced capabilities, choose the right pricing plan.",
  },
  {
    question: "Can I change my pricing plan later?",
    answer:
      "Yes, you can change your pricing plan at any time. When upgrading, new features will be available immediately, and when downgrading, changes will take effect in the next billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use modern encryption methods, Row Level Security (RLS) policies, and regular backups. All data is stored in accordance with international security standards.",
  },
  {
    question: "Are there user limits?",
    answer:
      "The free plan includes up to 3 users. The Professional plan includes up to 25 users, and the Enterprise plan has unlimited users.",
  },
  {
    question: "Can I integrate with other services?",
    answer:
      "Yes, we support integration with popular services via REST API and webhooks. Professional and Enterprise plans include unlimited integrations.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for enterprise clients. All payments are processed through secure payment systems.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Our platform is fully optimized for mobile devices and works through the browser. A mobile app is in development and will be available soon.",
  },
  {
    question: "Do you provide technical support?",
    answer:
      "Yes, we provide support on all plans. The free plan includes email support, Professional includes priority support, and Enterprise includes 24/7 support with a dedicated manager.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Find answers to the most common questions about our platform
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.1} className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ScrollRevealItem key={index} type="fadeUp" duration={0.5}>
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  openIndex === index
                    ? "border-primary shadow-lg"
                    : "hover:border-primary/50"
                }`}
                onClick={() => toggle(index)}
              >
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 pr-8">
                        {faq.question}
                      </h3>
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="shrink-0 mt-1">
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollRevealItem>
          ))}
        </ScrollRevealContainer>
      </div>
    </section>
  );
}
