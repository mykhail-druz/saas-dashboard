"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Demo", href: "#showcase" },
  ],
  company: [
    { name: "About us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "License", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API", href: "#" },
    { name: "Support", href: "#" },
    { name: "Status", href: "#" },
  ],
}

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Github", icon: Github, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Email", icon: Mail, href: "#" },
]

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">A</span>
              </div>
              <span className="font-bold text-base sm:text-lg md:text-xl">Analytics Pro</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Powerful platform for managing analytics and data
            </p>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Product</h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-4 sm:pt-5 md:pt-6 lg:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Analytics Pro. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
            Made with ❤️ for better analytics
          </p>
        </div>
      </div>
    </footer>
  )
}
