"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Galaxy from "@/components/Galaxy";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 sm:py-16 md:py-24">
      {/* Galaxy Background - always black background regardless of theme */}
      <div className="absolute inset-0 z-0 w-full h-full bg-black dark:bg-black">
        <Galaxy
          focal={[0.5, 0.5]}
          rotation={[1.0, 0.0]}
          starSpeed={0.8}
          density={1.2}
          hueShift={240}
          speed={1.0}
          mouseInteraction={true}
          glowIntensity={0.5}
          saturation={0.3}
          mouseRepulsion={true}
          repulsionStrength={2}
          twinkleIntensity={0.4}
          rotationSpeed={0.1}
          transparent={false}
        />
      </div>

      {/* Content with fixed light colors for both themes */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-white/80">Available now</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-tight text-white px-2">
              <div className="flex flex-col items-center min-h-[2.4em] justify-center">
                <TypeAnimation
                  sequence={["Manage analytics", 1200]}
                  wrapper="span"
                  speed={30}
                  style={{
                    display: "block",
                    color: "white",
                    textAlign: "center",
                  }}
                  repeat={0}
                  cursor={false}
                />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    background:
                      "linear-gradient(to right, #5227FF, #a855f7, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <TypeAnimation
                    sequence={[
                      1200, // Delay after first line
                      "at a new level",
                    ]}
                    wrapper="span"
                    speed={30}
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                    }}
                    repeat={0}
                    cursor={false}
                  />
                </span>
              </div>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4 min-h-[3em] flex items-center justify-center">
              <TypeAnimation
                sequence={[
                  2200, // Delay after heading
                  "Powerful dashboard for data analysis, user management, and report creation all in one place. Simple. Fast. Efficient.",
                ]}
                wrapper="span"
                speed={40}
                style={{
                  display: "inline-block",
                }}
                repeat={0}
                cursor={false}
              />
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 px-4">
              <Button
                size="default"
                className="text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 h-auto w-full sm:w-auto shadow-lg bg-[#5227FF] hover:bg-[#5227FF]/90 text-white rounded-lg"
                asChild
              >
                <Link href="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                className="text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 h-auto w-full sm:w-auto bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:text-white rounded-lg"
                asChild
              >
                <Link
                  href="#showcase"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector("#showcase");
                    if (element) {
                      const navHeight = 64; // Navigation height (h-16 = 64px)
                      const elementPosition =
                        element.getBoundingClientRect().top +
                        window.pageYOffset;
                      const offsetPosition = elementPosition - navHeight;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch demo
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 pt-8 sm:pt-12 w-full max-w-4xl px-4"
          >
            {[
              { label: "Active users", value: "10K+" },
              { label: "Companies trust", value: "500+" },
              { label: "Reports created", value: "50K+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg sm:text-3xl md:text-4xl font-bold text-[#5227FF] mb-0.5 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-sm text-white/70 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
