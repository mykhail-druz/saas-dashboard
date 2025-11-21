"use client";

import { RegisterForm } from "@/components/forms/register-form";
import Galaxy from "@/components/Galaxy";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0 w-screen h-screen">
        <Galaxy
          focal={[0.5, 0.5]}
          rotation={[1.0, 0.0]}
          starSpeed={0.5}
          density={0.8}
          hueShift={240}
          speed={0.8}
          mouseInteraction={true}
          glowIntensity={0.3}
          saturation={0.2}
          mouseRepulsion={true}
          repulsionStrength={1.5}
          twinkleIntensity={0.3}
          rotationSpeed={0.05}
          transparent={false}
        />
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        {/* Card with consistent styling */}
        <div className="relative rounded-2xl bg-card border border-border shadow-2xl p-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground text-base">
              Sign up to get started with Analytics Pro
            </p>
          </motion.div>
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
}
