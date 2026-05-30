/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Award, Mail, BookOpen, Quote, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function AboutAuthor() {
  const { authorInfo, siteImages } = useSite();
  return (
    <section id="auteur" className="py-24 bg-[#FAF9F5] scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Author Portrait Column */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative max-w-[340px] sm:max-w-[385px] w-full">
              {/* Outer Golden Geometric Frame */}
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-gold-400 rounded-2xl z-0" />
              
              {/* Image Frame Container */}
              <div
                id="author-avatar-frame"
                className="relative bg-white border border-stone-200 p-3.5 rounded-2xl shadow-xl z-10 hover:scale-[1.01] transition-transform duration-300"
              >
                <img
                  src={siteImages.authorPortrait}
                  alt={`${authorInfo.name} - Analyste Financier et Auteur`}
                  className="w-full h-auto rounded-xl object-cover grayscale-1/10 hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded Role Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-navy-950/95 border border-gold-400/40 rounded-xl p-4 shadow-lg text-center backdrop-blur-sm">
                  <span className="text-gold-400 font-serif font-black text-sm block">
                    {authorInfo.name}
                  </span>
                  <span className="text-white/80 text-[10px] uppercase tracking-widest font-mono block mt-1">
                    Cabinet de Conseil & Finance de Marché
                  </span>
                </div>
              </div>

              {/* Success Badge */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-lg border-2 border-white z-20 font-bold text-xs">
                CONF
              </div>
            </div>
          </div>

          {/* Author Bio Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1 bg-gold-100 border border-gold-300/40 px-3 py-1 rounded-full text-gold-700 font-mono text-xs tracking-wider uppercase font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Rencontre avec l'auteur</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                Éclairer le Chemin de Votre Réussite Financière
              </h2>
              <p className="text-gold-600 font-sans font-semibold text-sm sm:text-base tracking-wide uppercase">
                {authorInfo.role}
              </p>
              <div className="w-16 h-1 bg-gold-500 rounded-full" />
            </div>

            {/* Main bio descriptions */}
            <div className="space-y-4 text-stone-600 text-base leading-relaxed text-justify font-sans">
              <p>{authorInfo.bio}</p>
              <p>{authorInfo.extendedBio}</p>
            </div>

            {/* Signature Blockquote */}
            <div className="bg-white border-l-4 border-gold-500 rounded-r-xl p-5 shadow-sm relative italic text-stone-700 text-sm">
              <Quote className="absolute top-1 right-2 w-10 h-10 text-gold-500/10" />
              <p className="font-serif">
                &ldquo;L'éducation financière n'est pas un luxe réservé aux banquiers d'affaires de New York ou de Londres. C'est l'armure indispensable de l'indépendance économique de chaque citoyen africain.&rdquo;
              </p>
              <p className="font-mono text-[10px] font-bold text-gold-600 uppercase mt-2 tracking-widest not-italic">
                — {authorInfo.name}
              </p>
            </div>

            {/* Quick Author Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-gold-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-950 font-sans">Transparence Totale</h4>
                  <p className="text-xs text-stone-500">Aucune promesse farfelue magique, de la vraie finance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-3 h-3 text-gold-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-950 font-sans">Accompagnement Élite</h4>
                  <p className="text-xs text-stone-500">Ateliers, coaching régulier de groupe à Abidjan/Cameroun.</p>
                </div>
              </div>
            </div>

            {/* Contact Action links under Author Bio */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                id="author-contact-mail"
                href={`mailto:${authorInfo.email}`}
                className="inline-flex items-center space-x-2 text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors bg-white px-5 py-3 rounded-lg border border-stone-200 shadow-sm"
              >
                <Mail className="w-4 h-4 text-gold-500" />
                <span>Lui écrire par e-mail</span>
              </a>
              <a
                id="author-contact-whatsapp"
                href={`https://wa.me/${authorInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(authorInfo.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-white px-5 py-3 rounded-lg border border-stone-200 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                <span>Échanger sur WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
