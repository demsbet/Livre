/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Check, Award, Compass, Sparkles } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function BookOverview() {
  const { bookChapters, bookDetails } = useSite();
  const [selectedChapterId, setSelectedChapterId] = useState(() => bookChapters[0]?.id || "");

  const activeChapterId = bookChapters.some(c => c.id === selectedChapterId)
    ? selectedChapterId
    : (bookChapters[0]?.id || "");

  const selectedChapter = bookChapters.find((c) => c.id === activeChapterId) || bookChapters[0] || {
    id: "default-id",
    number: "00",
    title: "Aucun chapitre",
    description: "Aucun chapitre n'a été trouvé. Ajoutez-en un dans la console d'administration.",
    highlights: []
  };

  return (
    <section id="le-livre" className="py-24 bg-[#FAF9F5] scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-gold-100 border border-gold-300/40 px-3 py-1 rounded-full text-gold-700 font-mono text-xs tracking-wider uppercase font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structure de l'ouvrage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
            Au Cœur du Livre
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-gold-500 to-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 text-base sm:text-lg">
            Un programme structuré étape par étape, passant de la théorie fondamentale à des plans d'action immédiats pour acheter vos premières actions en Afrique.
          </p>
        </div>

        {/* Layout Grid: Chapter Selector vs Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* Chapter Selector (List) */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 pl-2">
              Cliquez pour explorer un chapitre :
            </span>
            {bookChapters.map((chap, idx) => {
              const isSelected = chap.id === selectedChapterId;
              return (
                <button
                  key={chap.id}
                  id={`chapter-tab-${chap.id}`}
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`w-full text-left p-4.5 rounded-xl border transition-all duration-300 flex items-center space-x-4 cursor-pointer relative group ${
                    isSelected
                      ? "bg-navy-950 border-gold-400 text-white shadow-xl shadow-navy-950/10 scale-[1.01]"
                      : "bg-white border-stone-200/60 hover:bg-white hover:border-gold-300 text-navy-900"
                  }`}
                >
                  {/* Chapter number block */}
                  <div
                    className={`text-lg font-mono font-extrabold w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-gold-500 text-navy-950"
                        : "bg-stone-100 text-stone-500 group-hover:bg-gold-50 group-hover:text-gold-600"
                    }`}
                  >
                    {chap.number}
                  </div>

                  {/* Chapter Title metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate group-hover:text-gold-400 font-sans transition-colors">
                      {chap.title}
                    </h3>
                    <p className={`text-xs truncate ${isSelected ? "text-navy-200" : "text-stone-400"}`}>
                      {chap.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapter Details Visualizer */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedChapter.id}
                id={`chapter-detail-card`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-shadow relative overflow-hidden"
              >
                {/* Embedded decorative watermark */}
                <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-navy-950">
                  <Compass className="w-64 h-64" />
                </div>

                <div className="space-y-6">
                  {/* Card Title Header */}
                  <div className="flex justify-between items-start border-b border-stone-100 pb-5">
                    <div className="space-y-1">
                      <span className="font-mono text-sm tracking-wider font-extrabold text-gold-600 uppercase">
                        Chapitre {selectedChapter.number}
                      </span>
                      <h3 className="font-serif text-2xl font-black text-navy-950">
                        {selectedChapter.title}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center text-gold-500 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Description Paragraph */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
                      Résumé du Chapitre
                    </h4>
                    <p className="text-stone-600 text-base leading-relaxed text-justify">
                      {selectedChapter.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
                      Ce que vous allez apprendre :
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-1 gap-2.5">
                      {selectedChapter.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm text-stone-700">
                          <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-gold-600 stroke-[3]" />
                          </div>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical book metrics bottom card */}
                <div className="mt-8 pt-5 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-100">
                    <span className="block text-xs font-mono text-stone-400 uppercase">Format</span>
                    <span className="text-xs font-bold text-navy-950 truncate block">{bookDetails.format}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-100">
                    <span className="block text-xs font-mono text-stone-400 uppercase">Accompagnement</span>
                    <span className="text-xs font-bold text-navy-950 block">Inclus</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-100">
                    <span className="block text-xs font-mono text-stone-400 uppercase">Année</span>
                    <span className="text-xs font-bold text-navy-950 block">{bookDetails.releaseYear}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-100">
                    <span className="block text-xs font-mono text-stone-400 uppercase">Écrit en</span>
                    <span className="text-xs font-bold text-navy-950 block">{bookDetails.language}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
