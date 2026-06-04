/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Check, Award, Compass, Sparkles } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function BookOverview() {
  const { bookChapters, bookDetails, siteImages } = useSite();
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

        {/* Book Covers Showcase Zone */}
        <div className="mt-20 bg-white border border-stone-200/60 rounded-3xl p-8 sm:p-14 shadow-2xl max-w-6xl mx-auto animate-fade-in">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-navy-950 uppercase tracking-widest text-[#9C824A]">
              Avis d'Édition : Première & Dernière de Couverture
            </h3>
            <p className="text-stone-500 text-sm sm:text-base font-sans font-medium">
              Découvrez la superbe qualité de finition et de conception graphique de l'ouvrage sur ses deux faces principales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center justify-items-center">
            {/* Front Cover Card */}
            <div className="flex flex-col items-center space-y-6 group w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(10,25,47,0.4)] hover:shadow-[0_45px_75px_-10px_rgba(156,130,74,0.3)] transition-all duration-500 w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4] bg-navy-950 flex items-center justify-center border-2 border-gold-500/30 group-hover:scale-[1.03] group-hover:rotate-1">
                <img
                  src={(siteImages as any).bookCoverFront || siteImages.bookCover}
                  alt="Première de Couverture - Face Avant"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent pointer-events-none" />
              </div>
              <span className="font-sans text-sm sm:text-base font-extrabold text-navy-950 bg-gold-450 hover:bg-gold-500 hover:text-white px-6 py-2.5 rounded-full transition-all duration-300 border border-gold-300 shadow-md">
                📖 Première de Couverture (Face Avant)
              </span>
            </div>

            {/* Back Cover Card */}
            <div className="flex flex-col items-center space-y-6 group w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] hover:shadow-[0_45px_75px_-10px_rgba(156,130,74,0.25)] transition-all duration-500 w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4] bg-[#1a1616] flex items-center justify-center border-2 border-stone-800/40 group-hover:scale-[1.03] group-hover:-rotate-1">
                <img
                  src={(siteImages as any).bookCoverBack || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80"}
                  alt="Dernière de Couverture - Face Arrière"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
              <span className="font-sans text-sm sm:text-base font-extrabold text-navy-950 bg-gold-450 hover:bg-gold-500 hover:text-white px-6 py-2.5 rounded-full transition-all duration-300 border border-gold-300 shadow-md">
                📖 Dernière de Couverture (Face Arrière)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
