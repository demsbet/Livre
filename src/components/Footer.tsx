/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Globe, MessageSquare, Mail, Settings } from "lucide-react";
import { useSite } from "../context/SiteContext";

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { authorInfo } = useSite();

  return (
    <footer id="app-footer" className="bg-navy-950 text-white border-t border-gold-500/20 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5 items-start">
          {/* Brand Left Column */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center">
                <BookOpen className="text-navy-950 w-5.5 h-5.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-wide text-white group-hover:text-gold-300 transition-colors">
                  {authorInfo.name}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase -mt-1 font-semibold">
                  La Bourse en Afrique
                </span>
              </div>
            </a>
            <p className="text-navy-200 text-sm leading-relaxed text-justify max-w-sm">
              Siewe de Kalambak Steeves est dédié à la vulgarisation financière et à l'autonomie économique en Afrique à travers des publications et des cadres d'accompagnement pragmatiques.
            </p>
          </div>

          {/* Quick links Center Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-navy-200">
              <a href="#" className="hover:text-gold-300 transition-colors">Accueil</a>
              <a href="#le-livre" className="hover:text-gold-300 transition-colors">Le Livre</a>
              <a href="#avantages" className="hover:text-gold-300 transition-colors">Avantages</a>
              <a href="#auteur" className="hover:text-gold-300 transition-colors">L'Auteur</a>
              <a href="#temoignages" className="hover:text-gold-300 transition-colors">Lecteurs</a>
              <a href="#faq" className="hover:text-gold-300 transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-gold-300 transition-colors">Acheter</a>
            </div>
          </div>

          {/* Legal references Right Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">Contact d'Auteur</h4>
            <p className="text-sm text-navy-200 leading-normal">
              Pour des demandes de conférences, d'ateliers de formation dans les universités ou de partenariats corporatifs :
            </p>
            <div className="space-y-2 text-xs text-navy-200 pt-1">
              <a href={`mailto:${authorInfo.email}`} className="flex items-center space-x-2 hover:text-gold-300 transition-colors">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>{authorInfo.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer statement - extremely premium for finance sites */}
        <div className="py-6 border-b border-white/5">
          <p className="text-[10px] md:text-xs text-navy-300/80 leading-relaxed text-justify">
            <strong className="text-gold-400/80">Avis de Non-Responsabilité Légale & Risques :</strong> "La Bourse en Afrique" est une œuvre littéraire à but méthodologique, d'éducation financière et de culture d'investissement généraliste. Les opinions et analyses de l'auteur sont basées sur des données historiques et ne constituent en aucun cas une incitation à l'achat, un conseil individualisé, un démarchage boursier ou une promesse de gains boursiers garantis. L'investissement en bourse sur la BRVM, la BVMAC ou tout autre marché d'actions comporte des risques inhérents de perte en capital. Il appartient à chaque investisseur de mener ses propres recherches ou de consulter une SGI ou un conseiller financier agréé par les autorités compétentes (CREPMF, COSUMAF) avant de prendre des décisions d'investissement.
          </p>
        </div>

        {/* Bottom copyright statement */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-navy-300/70 gap-4">
          <p className="font-sans">
            &copy; {currentYear} {authorInfo.name}. Tous droits réservés.
          </p>
          <div className="flex space-x-6 items-center">
            <span className="hover:text-gold-300 transition-colors">Imprimé en Afrique</span>
            <span className="hover:text-gold-300 transition-colors font-mono tracking-wider font-semibold">T1-2026 EDITION DE LUXE</span>
            
            <button
              id="admin-cog-trigger"
              onClick={onAdminClick}
              className="p-1.5 opacity-60 hover:opacity-100 rounded-full hover:bg-white/5 transition-all cursor-pointer flex items-center space-x-1 border border-transparent hover:border-white/10"
              title="Espace Administrateur"
            >
              <Settings className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[9px] font-mono tracking-widest uppercase">Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
