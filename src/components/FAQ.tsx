/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function FAQ() {
  const { faqItems, authorInfo } = useSite();
  const [activeId, setActiveId] = useState<string | null>(() => faqItems[0]?.id || "");

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#FAF9F5] scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-gold-100 border border-gold-300/40 px-3 py-1 rounded-full text-gold-700 font-mono text-xs tracking-wider uppercase font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Foire aux questions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Des Réponses à vos Questions
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-gold-500 to-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 text-sm sm:text-base">
            Vous avez des questions sur l'acquisition du livre ou son contenu ? Nous avons rassemblé ici les réponses les plus fréquentes.
          </p>
        </div>

        {/* FAQs Accordion Block */}
        <div className="space-y-4 pt-2">
          {faqItems.map((item) => {
            const isOpen = activeId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className="bg-white border border-stone-200/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-gold-300 shadow-sm"
              >
                {/* Trigger Header */}
                <button
                  id={`faq-trigger-${item.id}`}
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center space-x-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-navy-950 hover:text-gold-600 transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? "bg-gold-500 text-navy-950" : "bg-stone-50 text-stone-500"
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                </button>

                {/* Collapsible Answer area */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-stone-600 text-sm sm:text-base leading-relaxed text-justify border-t border-stone-50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Micro-Callout at bottom of FAQ */}
        <div className="mt-12 bg-white border border-stone-200/50 rounded-xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto shadow-sm">
          <div className="text-left">
            <h4 className="text-sm font-bold text-navy-950 font-sans">Vous avez une autre question spécifique ?</h4>
            <p className="text-xs text-stone-500 mt-0.5">Siewe et son équipe répondent directement sur WhatsApp sous 2 heures.</p>
          </div>
          <a
            id="faq-assistance-wa"
            href={`https://wa.me/${authorInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Bonjour, j'ai une question concernant le livre La Bourse en Afrique")}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Poser ma question</span>
          </a>
        </div>

      </div>
    </section>
  );
}
