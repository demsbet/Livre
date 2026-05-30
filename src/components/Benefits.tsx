/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Globe, BookOpen, TrendingUp, CheckCircle, ShieldCheck } from "lucide-react";
import { useSite } from "../context/SiteContext";

// Type-safe icon mapper
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Globe":
      return <Globe className="w-6 h-6 text-gold-500" />;
    case "BookOpen":
      return <BookOpen className="w-6 h-6 text-gold-500" />;
    case "TrendingUp":
      return <TrendingUp className="w-6 h-6 text-gold-500" />;
    case "CheckCircle":
      return <CheckCircle className="w-6 h-6 text-gold-500" />;
    default:
      return <ShieldCheck className="w-6 h-6 text-gold-500" />;
  }
};

export default function Benefits() {
  const { bookBenefits } = useSite();
  return (
    <section id="avantages" className="py-24 bg-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-navy-50 border border-navy-100 px-3 py-1 rounded-full text-navy-800 font-mono text-xs tracking-wider uppercase font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span>Pourquoi ce livre est unique</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
            Les Avantages de "La Bourse en Afrique"
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-gold-500 to-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 text-base sm:text-lg">
            Un manuel d'investissement moderne conçu spécifiquement pour vous faire gagner des années de recherche et éviter les pièges d'amorçage.
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bookBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              id={`benefit-card-${benefit.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-navy-50/40 border border-stone-200/50 hover:bg-navy-950 hover:text-white rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-navy-950/15 group flex flex-col justify-between h-full relative"
            >
              {/* Top Row: Icon Container and Card accent decoration */}
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-gold-500 flex items-center justify-center shadow-sm transition-colors duration-300">
                  {/* Map over the dynamic icons */}
                  <div className="group-hover:text-navy-950 transition-colors duration-300">
                    {getIconComponent(benefit.icon)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-navy-950 group-hover:text-gold-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-stone-600 group-hover:text-navy-100 text-sm sm:text-base leading-relaxed text-justify transition-colors">
                    {benefit.description}
                  </p>
                </div>
              </div>

              {/* Card visual anchor bottom arrow */}
              <div className="pt-6 flex justify-end">
                <span className="text-xs font-mono font-black text-gold-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  ACTIONABLE &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Highlight summary card at bottom */}
        <div className="mt-16 bg-gradient-to-r from-navy-900 to-navy-950 border border-gold-500/20 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono text-gold-400 font-bold uppercase tracking-wider">
                Culture Financière Inclusive
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Prenez part à la création de richesse sur le continent
              </h3>
              <p className="text-navy-200 text-sm sm:text-base text-justify leading-relaxed">
                Ce manuel n'est pas qu'un livre technique : c'est un manifeste pour l'indépendance économique africaine. Il encourage les cadres locaux et la diaspora à s'organiser et à investir au pays de façon structurée et durable.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-navy-900/60 backdrop-blur-sm border border-gold-400/20 rounded-xl p-5 text-center max-w-xs">
                <span className="block text-2xl font-serif font-black text-gold-400">
                  +15% à +25%
                </span>
                <span className="block text-xs uppercase tracking-wider text-stone-300 font-mono mt-1">
                  Rendements Historiques
                </span>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  de certaines pépites boursières locales analysées dans l'ouvrage.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
