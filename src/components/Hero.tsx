/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, BookOpen, Star, HelpCircle, Award, CheckCircle } from "lucide-react";
import { useSite } from "../context/SiteContext";
import { useCart } from "../context/CartContext";

interface HeroProps {
  onOrderClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onOrderClick, onExploreClick }: HeroProps) {
  const { addToCart } = useCart();
  const { bookDetails, siteImages } = useSite();

  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=220a21&auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?bg=220a21&auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?bg=220a21&auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?bg=220a21&auto=format&fit=crop&w=120&h=120&q=80"
  ];

  return (
    <section
      id="hero-section"
      className="relative min-h-[95vh] flex items-center pt-24 pb-16 bg-navy-950 text-white overflow-hidden"
    >
      {/* Background Graphic with Overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={siteImages.financialCharts}
          alt="Financial Charts Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-900" />
      </div>

      {/* Decorative Golden Ambient Lights */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-navy-500/10 rounded-full blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
          {/* Text Content Block */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tagline / Author Pre-title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gold-950/50 border border-gold-500/30 px-3.5 py-1.5 rounded-full w-fit hover:border-gold-400/50 transition-colors"
            >
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-mono tracking-widest text-gold-300 font-bold uppercase">
                Ouvrage Financier de Référence
              </span>
            </motion.div>

            {/* Main Premium Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight lg:leading-[1.12]"
            >
              Maîtrisez l'investissement et devenez acteur de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 underline decoration-gold-500/40 decoration-wavy">
                Bourse en Afrique
              </span>
            </motion.h1>

            {/* Subtitle / Pitch */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-navy-100 text-base sm:text-lg md:text-xl font-light text-justify leading-relaxed max-w-2xl"
            >
              {bookDetails.subtitle}. Le guide pratique rédigé par{" "}
              <strong className="text-gold-300 font-medium">Steeves SIEWE DE KALAMBAK</strong> de la zone CEMAC pour démystifier la BVMAC, fructifier votre épargne et générer des dividendes durables.
            </motion.p>

            {/* Micro-Features Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 pt-2 max-w-md border-y border-white/10 py-4"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-xl sm:text-2xl font-serif font-bold text-gold-400">
                  {bookDetails.pages}p.
                </span>
                <span className="text-[11px] text-navy-200 uppercase font-mono">
                  Pratique & Visuel
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-x border-white/10">
                <div className="flex items-center space-x-0.5">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                  <span className="text-lg font-bold text-white pl-1 font-serif">5/5</span>
                </div>
                <span className="text-[11px] text-navy-200 uppercase font-mono">
                  Évaluation Lecteurs
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-base sm:text-lg font-serif font-extrabold text-gold-400 uppercase">
                  BVMAC (CEMAC)
                </span>
                <span className="text-[11px] text-navy-200 uppercase font-mono">
                  Marché étudié
                </span>
              </div>
            </motion.div>

            {/* Actions Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                id="hero-cta-buy"
                onClick={() => addToCart("paper")}
                className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold rounded-lg shadow-lg shadow-gold-500/15 hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <span>Acheter le livre</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-cta-explore"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-gold-300 hover:text-gold-200 font-semibold border border-gold-500/30 rounded-lg transition-all cursor-pointer text-sm"
              >
                <BookOpen className="w-5 h-5 text-gold-400" />
                <span>Découvrir le sommaire</span>
              </button>
            </motion.div>

            {/* Satisfaction Trust Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-3 text-navy-200 text-xs sm:text-sm"
            >
              <div className="flex -space-x-1.5">
                {avatars.map((url, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-navy-950 bg-navy-800 flex items-center justify-center overflow-hidden shadow-md"
                  >
                    <img
                      src={url}
                      alt={`Investisseur ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <p className="font-sans">
                Recommandé par <strong className="text-white">+500 investisseurs</strong>, cadres et entrepreneurs d'Afrique.
              </p>
            </motion.div>
          </div>

          {/* Book Mockup Visual Block */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-[320px] sm:max-w-[360px] w-full"
            >
              {/* Gold Decorative Shadow Behind */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-gold-600 to-amber-700/50 rounded-2xl blur-xl opacity-30 animate-pulse" />

              {/* Real Book Frame wrapper */}
              <div
                id="book-frame-container"
                className="relative bg-navy-900 border border-gold-500/20 rounded-xl p-3 shadow-2xl transition-transform hover:scale-[1.02] duration-500 cursor-pointer group"
              >
                {/* Book Spine Simulation overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-navy-950 to-transparent z-10 rounded-l-md" />

                <img
                  src={siteImages.bookCover}
                  alt="La Bourse en Afrique - Livre par Steeves SIEWE DE KALAMBAK"
                  className="w-full h-auto rounded-lg shadow-inner object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Overlap Sticker Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-tr from-gold-500 to-amber-500 text-navy-950 font-black rounded-full flex flex-col justify-center items-center shadow-lg text-[10px] uppercase tracking-wider font-sans rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-navy-950">
                  <span className="leading-none text-[9px]">Livre</span>
                  <span className="text-xs font-bold leading-none select-none">BEST</span>
                  <span className="leading-none text-[9px]">SELLER</span>
                </div>

                {/* Overlap Price Sticker */}
                <div className="absolute bottom-6 -left-4 bg-navy-950/95 border border-gold-500/40 rounded-lg px-4 py-2.5 shadow-xl flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold">
                    Tarif Spécial Lancement
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-xl font-serif font-black text-white">
                      {bookDetails.pricePaper}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {bookDetails.originalPricePaper}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formats Tags */}
              <div className="flex justify-center items-center mt-5">
                <div className="flex items-center space-x-2 text-navy-100 text-xs">
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span>Version Papier Reliée Premium (Broché d'Art, Zone CEMAC)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
