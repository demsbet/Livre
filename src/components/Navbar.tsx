/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Menu, X, BookOpen, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";

interface NavbarProps {
  onOrderClick: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
  const { authorInfo } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "#" },
    { name: "Le Livre", href: "#le-livre" },
    { name: "Avantages", href: "#avantages" },
    { name: "L'Auteur", href: "#auteur" },
    { name: "Témoignages", href: "#temoignages" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-950/90 backdrop-blur-md border-b border-gold-500/20 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Brand */}
          <a href="#" id="brand-logo" className="flex items-center space-x-3 group animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-md shadow-gold-500/10 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="text-navy-950 w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-wide text-white group-hover:text-gold-300 transition-colors">
                {authorInfo.name}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase -mt-1 font-semibold">
                La Bourse en Afrique
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                id={`navlink-${link.name.toLowerCase()}`}
                className="px-4 py-2 text-sm font-medium text-navy-100 hover:text-gold-300 rounded-md transition-colors relative group font-sans"
              >
                {link.name}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Call To Action & Cart */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Shopping Cart Button */}
            <button
              id="header-cart-toggle"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-navy-100 hover:text-gold-400 hover:scale-105 transition-all cursor-pointer rounded-full bg-navy-900/50 border border-white/5 hover:border-gold-500/20 shadow-inner"
              title="Ouvrir le Panier"
            >
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="nav-cta-order"
              onClick={onOrderClick}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs sm:text-sm font-semibold rounded-full group bg-gradient-to-br from-gold-500 to-gold-700 group-hover:from-gold-500 group-hover:to-gold-700 text-white focus:ring-4 focus:outline-none focus:ring-gold-800 transition-all duration-300 cursor-pointer shadow-md shadow-gold-500/10 hover:shadow-gold-500/30"
            >
              <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-navy-950 rounded-full group-hover:bg-opacity-0 flex items-center space-x-2">
                <span className="text-gold-200 group-hover:text-navy-950 transition-colors">Passer à la Caisse</span>
              </span>
            </button>
          </div>

          {/* Mobile Actions (Mobile Cart & Menu Button) */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Mobile Shopping Cart Trigger */}
            <button
              id="header-cart-toggle-mobile"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-navy-100 hover:text-gold-400 transition-colors cursor-pointer"
              title="Ouvrir le Panier"
            >
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy-100 hover:text-gold-400 p-2 rounded-md transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div
          id="mobile-menu-overlay"
          className="lg:hidden absolute top-full left-0 right-0 bg-navy-950 border-b border-gold-500/20 px-4 py-6 shadow-2xl space-y-3 flex flex-col items-center text-center animate-fade-in-down"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              id={`moblink-${link.name.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-base font-medium text-navy-100 hover:text-gold-300 rounded-lg hover:bg-navy-900/50 transition-all"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-navy-900 w-full flex justify-center">
            <button
              id="mob-cta-order"
              onClick={() => {
                setIsOpen(false);
                onOrderClick();
              }}
              className="w-full max-w-xs flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 py-3 px-6 rounded-full font-bold shadow-lg hover:from-gold-400 hover:to-gold-500 transition-all cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              <span>Passer à la Caisse</span>
            </button>
          </div>
        </div>
      )}

    </nav>
  );
}
