/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookOverview from "./components/BookOverview";
import Benefits from "./components/Benefits";
import AboutAuthor from "./components/AboutAuthor";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { SiteProvider } from "./context/SiteContext";
import CartDrawer from "./components/CartDrawer";
import AdminPanel from "./components/AdminPanel";
import { useState } from "react";

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Navigation scrolls helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SiteProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FAF9F5] text-navy-950 font-sans selection:bg-gold-500 selection:text-navy-950">
          {/* Structural sticky top-bar */}
          <Navbar onOrderClick={() => scrollToSection("contact")} />

          {/* Flagship Hero section */}
          <Hero
            onOrderClick={() => scrollToSection("contact")}
            onExploreClick={() => scrollToSection("le-livre")}
          />

          {/* Main Body structured sections */}
          <main id="main-content">
            {/* Section 1: Book Presentation Outline */}
            <BookOverview />

            {/* Section 2: Book Advantages Core grids */}
            <Benefits />

            {/* Section 3: Meet Siewe de Kalambak Steeves */}
            <AboutAuthor />

            {/* Section 4: Customer Testimonial carousels */}
            <Testimonials />

            {/* Section 5: Frequent Ask Questions Accordion */}
            <FAQ />

            {/* Section 6: Checkout Form submission */}
            <Contact />
          </main>

          {/* Footer credits and disclosures */}
          <Footer onAdminClick={() => setIsAdminOpen(true)} />

          {/* Floating Call CTA action trigger */}
          <FloatingWhatsApp />

          {/* E-commerce sliding sidebar drawer */}
          <CartDrawer />

          {/* Dynamic Admin panel */}
          <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </div>
      </CartProvider>
    </SiteProvider>
  );
}
