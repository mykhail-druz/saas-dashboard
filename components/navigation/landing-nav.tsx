"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import PillNav, { PillNavItem } from "@/components/PillNav";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function LandingNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Determine the actual theme (considering system)
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use favicon as logo
  const logoDataUrl = "/android-chrome-192x192.png";

  const navItems: PillNavItem[] = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  // Determine colors based on theme and scroll state
  const getPillNavColors = () => {
    if (!mounted) {
      // Default colors before mounting (light theme)
      return {
        baseColor: "rgba(255, 255, 255, 0.95)",
        pillColor: "#060010",
        pillTextColor: "#fff",
        hoveredPillTextColor: "#060010",
      };
    }

    if (isScrolled) {
      // Sticky navbar (fixed on scroll)
      if (isDark) {
        // Dark theme - sticky: dark navbar background, white pills with black text
        return {
          baseColor: "hsl(var(--background))", // Navbar background and hover circle color
          pillColor: "#ffffff", // Pill background in normal state (white)
          pillTextColor: "#000000", // Text in normal state (black)
          hoveredPillTextColor: "hsl(var(--foreground))", // Text on hover (light on dark background)
        };
      } else {
        // Light theme - sticky: light navbar background, dark pills, hover inversion
        return {
          baseColor: "hsl(var(--background))", // Navbar background and hover circle color
          pillColor: "hsl(var(--foreground))", // Pill background in normal state (dark)
          pillTextColor: "hsl(var(--background))", // Text in normal state (light)
          hoveredPillTextColor: "hsl(var(--foreground))", // Text on hover (dark on light background)
        };
      }
    } else {
      // Absolute navbar (not scrolled, over content)
      if (isDark) {
        // Dark theme - absolute: semi-transparent dark background, white pills with black text
        return {
          baseColor: "rgba(20, 20, 20, 0.85)", // Navbar background and hover circle color
          pillColor: "#ffffff", // Pill background in normal state (white)
          pillTextColor: "#000000", // Text in normal state (black)
          hoveredPillTextColor: "#ffffff", // Text on hover (white on dark circle)
        };
      } else {
        // Light theme - absolute: semi-transparent light background, dark pills
        return {
          baseColor: "rgba(255, 255, 255, 0.95)", // Navbar background and hover circle color
          pillColor: "#060010", // Pill background in normal state (dark)
          pillTextColor: "#fff", // Text in normal state (light)
          hoveredPillTextColor: "#060010", // Text on hover (dark on light circle)
        };
      }
    }
  };

  const pillNavColors = getPillNavColors();

  return (
    <nav
      className={`${
        isScrolled ? "fixed" : "absolute"
      } top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between relative">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <PillNav
              logo={logoDataUrl}
              logoAlt="Analytics Pro"
              items={navItems}
              activeHref={pathname || undefined}
              initialLoadAnimation={true}
              baseColor={pillNavColors.baseColor}
              pillColor={pillNavColors.pillColor}
              pillTextColor={pillNavColors.pillTextColor}
              hoveredPillTextColor={pillNavColors.hoveredPillTextColor}
              className=""
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop buttons */}
            {isAuthenticated ? (
              <Button
                size="sm"
                className={`hidden sm:inline-flex ${
                  !isScrolled
                    ? isDark
                      ? "text-white hover:text-black hover:bg-white/90 border-white/20 bg-white"
                      : "text-black hover:text-black hover:bg-white/10 border-white/20 bg-white/90"
                    : ""
                }`}
                variant={!isScrolled ? "outline" : "default"}
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden sm:inline-flex ${
                    !isScrolled
                      ? "text-white hover:text-white hover:bg-white/10"
                      : ""
                  }`}
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className={`hidden sm:inline-flex ${
                    !isScrolled
                      ? "text-white hover:text-white hover:bg-white/10 border-white/20 bg-white/10"
                      : ""
                  }`}
                  variant={!isScrolled ? "outline" : "default"}
                  asChild
                >
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}

            {/* Theme toggle - слева от меню на мобильных */}
            <div
              className={
                !isScrolled
                  ? "[&_button]:text-white [&_button_svg]:stroke-white [&_button:hover]:text-white [&_button:hover]:bg-white/10 [&_button:hover]:border-white/20"
                  : ""
              }
            >
              <ThemeToggle />
            </div>

            {/* Mobile menu hamburger - справа */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                width: "42px",
                height: "42px",
                background: pillNavColors.baseColor,
              }}
            >
              {isMobileMenuOpen ? (
                <X
                  className="h-5 w-5"
                  style={{
                    color: pillNavColors.pillColor,
                    stroke: pillNavColors.pillColor,
                  }}
                />
              ) : (
                <Menu
                  className="h-5 w-5"
                  style={{
                    color: pillNavColors.pillColor,
                    stroke: pillNavColors.pillColor,
                  }}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Отдельное мобильное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[999] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background shadow-2xl z-[1000] md:hidden overflow-y-auto"
              style={{
                background: pillNavColors.baseColor,
              }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: pillNavColors.pillColor + "20" }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ color: pillNavColors.pillTextColor }}
                  >
                    Menu
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: pillNavColors.pillColor,
                    }}
                  >
                    <X
                      className="h-5 w-5"
                      style={{
                        color: pillNavColors.pillTextColor,
                      }}
                    />
                  </Button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-4 space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        if (item.href.startsWith("#")) {
                          e.preventDefault();
                          setIsMobileMenuOpen(false);
                          setTimeout(() => {
                            const element = document.querySelector(item.href);
                            if (element) {
                              const navHeight = 64;
                              const elementPosition =
                                element.getBoundingClientRect().top +
                                window.pageYOffset;
                              const offsetPosition =
                                elementPosition - navHeight;
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                              });
                            }
                          }, 100);
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className="block py-5 px-6 rounded-[50px] text-lg font-medium transition-all duration-200 w-full"
                      style={{
                        background: pillNavColors.pillColor,
                        color: pillNavColors.pillTextColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          pillNavColors.baseColor;
                        e.currentTarget.style.color =
                          pillNavColors.hoveredPillTextColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          pillNavColors.pillColor;
                        e.currentTarget.style.color =
                          pillNavColors.pillTextColor;
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Footer with auth buttons */}
                <div
                  className="p-4 pt-0 space-y-3 border-t"
                  style={{ borderColor: pillNavColors.pillColor + "20" }}
                >
                  {isAuthenticated ? (
                    <Button
                      className="w-full py-5 text-lg font-medium rounded-[50px]"
                      style={{
                        background: pillNavColors.pillColor,
                        color: pillNavColors.pillTextColor,
                      }}
                      asChild
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full py-5 text-lg font-medium rounded-[50px]"
                        style={{
                          borderColor: pillNavColors.pillColor,
                          color: pillNavColors.pillTextColor,
                          background: "transparent",
                        }}
                        asChild
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                      </Button>
                      <Button
                        className="w-full py-5 text-lg font-medium rounded-[50px]"
                        style={{
                          background: pillNavColors.pillColor,
                          color: pillNavColors.pillTextColor,
                        }}
                        asChild
                      >
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
