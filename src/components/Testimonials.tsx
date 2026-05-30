/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Star, Quote, MessageSquare } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function Testimonials() {
  const { testimonials } = useSite();
  return (
    <section id="temoignages" className="py-24 bg-white scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-gold-50 border border-gold-200/50 px-3 py-1 rounded-full text-gold-700 font-mono text-xs tracking-wider uppercase font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Retours d'expérience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Ce que Disent les Lecteurs
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-gold-500 to-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 text-base sm:text-lg">
            Découvrez les témoignages réels d'investisseurs de l'Afrique et de la diaspora qui ont transformé leur gestion d'épargne grâce aux précieux conseils du livre.
          </p>
        </div>

        {/* Testimonials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.id}
              id={`testimonial-card-${test.id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-navy-50/30 border border-stone-200/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group hover:bg-white hover:border-gold-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Overlay Quote Icon in header corner */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold-500/10 group-hover:text-gold-500/20 transition-colors" />

              <div className="space-y-4">
                {/* 5-Star Rating Row */}
                <div className="flex items-center space-x-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>

                {/* Main Content Quote */}
                <p className="text-stone-700 italic text-sm sm:text-base leading-relaxed text-justify group-hover:text-stone-800 transition-colors">
                  &ldquo;{test.content}&rdquo;
                </p>
              </div>

              {/* Author Details Signature block */}
              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center space-x-3.5">
                {/* Custom Avatar with Initial Letter */}
                <div className="w-11 h-11 rounded-full bg-navy-800 text-gold-400 font-serif font-black flex items-center justify-center shrink-0 border border-gold-400/20 select-none overflow-hidden shadow-sm">
                  {test.avatarUrl ? (
                    <img
                      src={test.avatarUrl}
                      alt={test.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                        const parent = (e.target as any).parentNode;
                        if (parent) {
                          const fallbackSpan = document.createElement('span');
                          fallbackSpan.innerText = test.name.charAt(0);
                          parent.appendChild(fallbackSpan);
                        }
                      }}
                    />
                  ) : (
                    test.name.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-navy-950 font-sans truncate">
                    {test.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {test.role}
                  </p>
                  {test.company && (
                    <p className="text-[10px] text-gold-600 font-mono font-bold tracking-wide uppercase mt-0.5">
                      {test.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Financial Authority Banner Block */}
        <div className="mt-16 text-center max-w-xl mx-auto space-y-4">
          <p className="text-xs text-stone-400 font-mono uppercase tracking-widest">
            Achat 100% Serein & garanti
          </p>
          <div className="flex justify-center items-center space-x-6 text-stone-400">
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase">
              <span>Livraison express</span>
            </div>
            <div className="h-4 w-px bg-stone-300" />
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase">
              <span>Support Client 7J/7</span>
            </div>
            <div className="h-4 w-px bg-stone-300" />
            <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase">
              <span>Satisfaction 100%</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
