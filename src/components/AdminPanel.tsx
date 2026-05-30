/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Settings, 
  Lock, 
  Check, 
  RotateCcw, 
  Plus, 
  Trash2, 
  BookOpen, 
  User, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  AlertCircle,
  Save,
  Image as ImageIcon
} from "lucide-react";
import { useSite } from "../context/SiteContext";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "general" | "author" | "chapters" | "benefits" | "testimonials" | "faqs" | "images";

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const {
    authorInfo,
    bookDetails,
    bookChapters,
    bookBenefits,
    testimonials,
    faqItems,
    siteImages,
    updateAuthorInfo,
    updateBookDetails,
    updateSiteImages,
    updateChapter,
    addChapter,
    deleteChapter,
    updateBenefit,
    addBenefit,
    deleteBenefit,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    updateFaqItem,
    addFaqItem,
    deleteFaqItem,
    resetToDefaults
  } = useSite();

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [successToast, setSuccessToast] = useState("");

  // New item drafting states
  const [newHighlight, setNewHighlight] = useState("");
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuthenticated(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Mot de passe incorrect");
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tout le site web aux textes d'origine ? Cette action est irréversible.")) {
      resetToDefaults();
      showToast("Le site a été réinitialisé aux textes par défaut !");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/75 backdrop-blur-xs transition-opacity"
          />

          {/* Panel content wrapper */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col pointer-events-auto relative z-10"
          >
            {/* Header band */}
            <div className="px-6 py-4.5 bg-navy-950 text-white flex justify-between items-center border-b border-gold-500/10 shrink-0">
              <div className="flex items-center space-x-2.5">
                <Settings className="w-5.5 h-5.5 text-gold-400 animate-spin-slow" />
                <div>
                  <h3 className="text-base font-serif font-black tracking-wide text-white">
                    Console d'Administration Élite
                  </h3>
                  <p className="text-[10px] font-mono text-stone-400">
                    SÉCURISÉE PAR L'AUTEUR ET LA COSUMAF
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-navy-900 border border-white/10 text-stone-300 hover:text-white hover:border-gold-500/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Unauthorized login screen */}
            {!isAuthenticated ? (
              <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-stone-50/50">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200/60 shadow-xl space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-950 border border-navy-100 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5 text-gold-500" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-navy-950">
                      Accès Administrateur Limité
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto leading-normal">
                      Saisissez le mot de passe maître pour modifier dynamiquement les titres, prix, chapitres, avantages et témoignages.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="admin-pass" className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                        Mot de passe d'administration
                      </label>
                      <input
                        type="password"
                        id="admin-pass"
                        required
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500 text-center font-mono"
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-xs text-red-600 font-bold text-center flex items-center justify-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errorMessage}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-navy-950 hover:bg-navy-900 text-gold-400 hover:text-white py-3 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>S'authentifier</span>
                    </button>
                  </form>
                </motion.div>
              </div>
            ) : (
              /* Authenticated Live Editing Studio Panels */
              <div className="flex-1 flex overflow-hidden">
                {/* Visual Tab menu sidebar */}
                <div className="w-48 bg-stone-50 border-r border-stone-200/60 p-4 space-y-1.5 shrink-0 flex flex-col justify-between">
                  {/* Tab list */}
                  <div className="space-y-1">
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-3 px-2">Sections</span>
                    
                    {[
                      { id: "general", label: "Livre & Offres", icon: BookOpen },
                      { id: "author", label: "Auteur & Infos", icon: User },
                      { id: "chapters", label: "Sommaire", icon: FileText },
                      { id: "benefits", label: "Avantages", icon: Check },
                      { id: "testimonials", label: "Témoignages", icon: MessageSquare },
                      { id: "faqs", label: "Questions FAQ", icon: HelpCircle },
                      { id: "images", label: "Images & Visuels", icon: ImageIcon },
                    ].map((tab) => {
                      const IconObj = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as TabType)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-all cursor-pointer ${
                            activeTab === tab.id
                              ? "bg-navy-950 text-gold-400"
                              : "text-stone-600 hover:bg-stone-200/50 hover:text-navy-950"
                          }`}
                        >
                          <IconObj className="w-4 h-4 shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Operational utility actions at the bottom margin */}
                  <div className="space-y-2 border-t border-stone-200 pt-4">
                    <button
                      onClick={handleReset}
                      className="w-full flex items-center justify-center space-x-1.5 p-2 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-lg text-[10px] font-bold transition-all border border-stone-200/50 cursor-pointer"
                      title="Restaurer l'intégralité du site par défaut"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réinitialiser textes</span>
                    </button>
                    <p className="text-[9px] text-stone-400 text-center leading-normal">
                      Les modifications sont actives en direct et enregistrées pour vos prochaines visites.
                    </p>
                  </div>
                </div>

                {/* ACTIVE TAB FORMS CONTAINER */}
                <div className="flex-1 overflow-y-auto p-6 bg-white relative">
                  {/* Alert notification success toast banner */}
                  {successToast && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg border border-emerald-500/30 flex items-center space-x-1.5 z-20 animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{successToast}</span>
                    </div>
                  )}

                  {/* TAB 1: BOOK DETAILS */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-bold text-navy-950">Données Générales du Livre</h4>
                        <p className="text-xs text-stone-500">Modifiez le titre principal, les dimensions et les prix d'auteur.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Titre du livre</label>
                          <input
                            type="text"
                            value={bookDetails.title}
                            onChange={(e) => {
                              updateBookDetails({ title: e.target.value });
                              showToast("Titre mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Sous-titre accrocheur</label>
                          <input
                            type="text"
                            value={bookDetails.subtitle}
                            onChange={(e) => {
                              updateBookDetails({ subtitle: e.target.value });
                              showToast("Sous-titre mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Prix d'Auteur (€)</label>
                          <input
                            type="text"
                            value={bookDetails.pricePaper}
                            onChange={(e) => {
                              updateBookDetails({ pricePaper: e.target.value });
                              showToast("Prix mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Ancien prix barré (€)</label>
                          <input
                            type="text"
                            value={bookDetails.originalPricePaper}
                            onChange={(e) => {
                              updateBookDetails({ originalPricePaper: e.target.value });
                              showToast("Ancien prix mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Nombre de pages total</label>
                          <input
                            type="number"
                            value={bookDetails.pages}
                            onChange={(e) => {
                              updateBookDetails({ pages: parseInt(e.target.value, 10) || 0 });
                              showToast("Nombre de pages mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Langue officielle</label>
                          <input
                            type="text"
                            value={bookDetails.language}
                            onChange={(e) => {
                              updateBookDetails({ language: e.target.value });
                              showToast("Langue mise à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Format physique d'impression</label>
                          <input
                            type="text"
                            value={bookDetails.format}
                            onChange={(e) => {
                              updateBookDetails({ format: e.target.value });
                              showToast("Format d'impression mis à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Année de parution</label>
                          <input
                            type="text"
                            value={bookDetails.releaseYear}
                            onChange={(e) => {
                              updateBookDetails({ releaseYear: e.target.value });
                              showToast("Année mise à jour !");
                            }}
                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: AUTHOR INFO */}
                  {activeTab === "author" && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-bold text-navy-950">Données de l'Auteur</h4>
                        <p className="text-xs text-stone-500">Modifiez la biographie, le rôle professionnel et les contacts de l'auteur.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Nom complet de l'Auteur</label>
                            <input
                              type="text"
                              value={authorInfo.name}
                              onChange={(e) => {
                                updateAuthorInfo({ name: e.target.value });
                                showToast("Nom édité !");
                              }}
                              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Titre ou Rôle</label>
                            <input
                              type="text"
                              value={authorInfo.role}
                              onChange={(e) => {
                                updateAuthorInfo({ role: e.target.value });
                                showToast("Rôle mis à jour !");
                              }}
                              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Biographie courte (Page livre)</label>
                          <textarea
                            rows={3}
                            value={authorInfo.bio}
                            onChange={(e) => {
                              updateAuthorInfo({ bio: e.target.value });
                              showToast("Bio courte éditée !");
                            }}
                            className="w-full border border-stone-200 rounded-lg p-3 text-xs bg-stone-50"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Biographie complète étendue (À propos)</label>
                          <textarea
                            rows={5}
                            value={authorInfo.extendedBio}
                            onChange={(e) => {
                              updateAuthorInfo({ extendedBio: e.target.value });
                              showToast("Grande bio éditée !");
                            }}
                            className="w-full border border-stone-200 rounded-lg p-3 text-xs bg-stone-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Numéro WhatsApp</label>
                            <input
                              type="tel"
                              value={authorInfo.whatsappNumber}
                              onChange={(e) => {
                                updateAuthorInfo({ whatsappNumber: e.target.value });
                                showToast("Numéro WhatsApp mis à jour !");
                              }}
                              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">Adresse email active</label>
                            <input
                              type="email"
                              value={authorInfo.email}
                              onChange={(e) => {
                                updateAuthorInfo({ email: e.target.value });
                                showToast("Email d'auteur mis à jour !");
                              }}
                              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-stone-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CHAPTERS SOMMAIRE */}
                  {activeTab === "chapters" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-navy-950">Sommaire & Chapitres de l'Ouvrage</h4>
                          <p className="text-xs text-stone-500">Ajoutez, supprimez et éditez le plan de chaque chapitre officiel.</p>
                        </div>
                        <button
                          onClick={() => {
                            addChapter({
                              number: String(bookChapters.length + 1).padStart(2, "0"),
                              title: "Nouveau Chapitre",
                              description: "Saisissez les fondations de ce nouveau chapitre méthodologique.",
                              highlights: ["Point clé additionnel 1"]
                            });
                            showToast("Nouveau chapitre créé ! Vous pouvez l'éditer ci-dessous.");
                          }}
                          className="bg-navy-950 text-gold-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-white/5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter chapitre</span>
                        </button>
                      </div>

                      {/* Chapters listing list */}
                      <div className="space-y-4">
                        {bookChapters.map((chapter) => (
                          <div key={chapter.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3.5 relative">
                            {/* Actions wrapper */}
                            <div className="absolute top-4 right-4 flex items-center space-x-2">
                              <button
                                onClick={() => deleteChapter(chapter.id)}
                                className="p-1 px-1.5 bg-white text-stone-400 hover:text-red-600 transition-colors rounded border border-stone-200/50 hover:border-red-500/30 cursor-pointer"
                                title="Supprimer ce chapitre"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                              {/* Sequence and title fields */}
                              <div className="sm:col-span-2">
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Numéro</label>
                                <input
                                  type="text"
                                  value={chapter.number}
                                  onChange={(e) => updateChapter(chapter.id, { number: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs text-center font-mono font-bold"
                                />
                              </div>
                              <div className="sm:col-span-10">
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Titre de chapitre</label>
                                <input
                                  type="text"
                                  value={chapter.title}
                                  onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs font-serif font-bold text-navy-950"
                                />
                              </div>
                            </div>

                            {/* Description brief info */}
                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Résumé résumé pour la liste</label>
                              <textarea
                                rows={2}
                                value={chapter.description}
                                onChange={(e) => updateChapter(chapter.id, { description: e.target.value })}
                                className="w-full bg-white border border-stone-200 rounded p-2 text-xs"
                              />
                            </div>

                            {/* Points highlights editable tags list */}
                            <div className="space-y-1.5">
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Bullet points additionnels ({chapter.highlights.length})</label>
                              
                              <div className="space-y-1.5">
                                {chapter.highlights.map((highlight, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={highlight}
                                      onChange={(e) => {
                                        const nextH = [...chapter.highlights];
                                        nextH[idx] = e.target.value;
                                        updateChapter(chapter.id, { highlights: nextH });
                                      }}
                                      className="flex-1 bg-white border border-stone-150 rounded px-2 py-0.5 text-xs text-stone-700"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextH = chapter.highlights.filter((_, i) => i !== idx);
                                        updateChapter(chapter.id, { highlights: nextH });
                                        showToast("Point clé supprimé !");
                                      }}
                                      className="text-stone-400 hover:text-red-500 p-0.5 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Form to submit and append new highlighters */}
                              <div className="flex items-center space-x-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Ajouter un nouveau point stratégique..."
                                  value={editingChapterId === chapter.id ? newHighlight : ""}
                                  onFocus={() => {
                                    setEditingChapterId(chapter.id);
                                    setNewHighlight("");
                                  }}
                                  onChange={(e) => setNewHighlight(e.target.value)}
                                  className="flex-1 bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (newHighlight.trim()) {
                                      updateChapter(chapter.id, {
                                        highlights: [...chapter.highlights, newHighlight.trim()]
                                      });
                                      setNewHighlight("");
                                      showToast("Point ajouté !");
                                    }
                                  }}
                                  className="bg-navy-950 text-white p-1 rounded hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ADVANTAGES / BENEFITS */}
                  {activeTab === "benefits" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-navy-950">Avantages & Forces Clés</h4>
                          <p className="text-xs text-stone-500">Modifiez les points forts visibles sur l'accueil bento.</p>
                        </div>
                        <button
                          onClick={() => {
                            addBenefit({
                              title: "Nouvel Avantage d'Élite",
                              description: "Saisissez la description pédagogique de cet avantage boursier unique.",
                              icon: "BookOpen"
                            });
                            showToast("Avantage ajouté ! Défilez pour l'éditer.");
                          }}
                          className="bg-navy-950 text-gold-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-white/5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter un avantage</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {bookBenefits.map((benefit) => (
                          <div key={benefit.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3 relative">
                            <button
                              onClick={() => deleteBenefit(benefit.id)}
                              className="absolute top-4 right-4 text-stone-400 hover:text-red-600 transition-colors p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Titre de l'avantage</label>
                                <input
                                  type="text"
                                  value={benefit.title}
                                  onChange={(e) => updateBenefit(benefit.id, { title: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2.5 py-1 text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Icône Lucide (Référence)</label>
                                <select
                                  value={benefit.icon}
                                  onChange={(e) => updateBenefit(benefit.id, { icon: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                                >
                                  <option value="Globe">Globe de la zone CEMAC</option>
                                  <option value="BookOpen">Livre Papier Ouvert</option>
                                  <option value="TrendingUp">Analyse Bourse & Dividendes</option>
                                  <option value="CheckCircle">Validation & Succès</option>
                                  <option value="Award">Certification & Trophée</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Description pédagogique détaillée</label>
                              <textarea
                                rows={2.5}
                                value={benefit.description}
                                onChange={(e) => updateBenefit(benefit.id, { description: e.target.value })}
                                className="w-full bg-white border border-stone-200 rounded p-2 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: TESTIMONIALS */}
                  {activeTab === "testimonials" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-navy-950">Témoignages Lecteurs</h4>
                          <p className="text-xs text-stone-500">Modifiez ou supprimez les retours d'investisseurs de la zone CEMAC.</p>
                        </div>
                        <button
                          onClick={() => {
                            addTestimonial({
                              name: "Marie-Louise Engola",
                              role: "Cadre Financier d'Afrique Centrale",
                              company: "Douala, Cameroun",
                              content: "Le contenu est incroyable ! On comprend enfin les rouages cachés de la BVMAC et comment investir simplement sur mobile.",
                              rating: 5
                            });
                            showToast("Témoignage ajouté ! Vous pouvez l'écrire ci-dessous.");
                          }}
                          className="bg-navy-950 text-gold-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-white/5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter un témoignage</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {testimonials.map((test) => (
                          <div key={test.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3 relative">
                            <button
                              onClick={() => deleteTestimonial(test.id)}
                              className="absolute top-4 right-4 text-stone-400 hover:text-red-600 transition-colors p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Nom complet</label>
                                <input
                                  type="text"
                                  value={test.name}
                                  onChange={(e) => updateTestimonial(test.id, { name: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Profession</label>
                                <input
                                  type="text"
                                  value={test.role}
                                  onChange={(e) => updateTestimonial(test.id, { role: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Ville, Pays de l'investisseur</label>
                                <input
                                  type="text"
                                  value={test.company || ""}
                                  onChange={(e) => updateTestimonial(test.id, { company: e.target.value })}
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div className="sm:col-span-3">
                                <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Lien de la photo de profil (Optionnel)</label>
                                <input
                                  type="text"
                                  value={test.avatarUrl || ""}
                                  onChange={(e) => updateTestimonial(test.id, { avatarUrl: e.target.value })}
                                  placeholder="URL vers l'image du profil..."
                                  className="w-full bg-white border border-stone-200 rounded px-2 py-1.5 text-xs"
                                />
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Aperçu</span>
                                <div className="w-8 h-8 rounded-full bg-navy-800 text-gold-400 font-serif font-black flex items-center justify-center border border-gold-400/20 overflow-hidden shadow-sm">
                                  {test.avatarUrl ? (
                                    <img src={test.avatarUrl} alt={test.name} className="w-full h-full object-cover" />
                                  ) : (
                                    test.name.charAt(0)
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">Commentaire élogieux</label>
                              <textarea
                                rows={3}
                                value={test.content}
                                onChange={(e) => updateTestimonial(test.id, { content: e.target.value })}
                                className="w-full bg-white border border-stone-200 rounded p-2 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: FAQS */}
                  {activeTab === "faqs" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-navy-950">Questions Fréquentes (FAQ)</h4>
                          <p className="text-xs text-stone-500">Modifiez les questions boursières ou de livraison du site.</p>
                        </div>
                        <button
                          onClick={() => {
                            addFaqItem({
                              question: "Puis-je commander plusieurs volumes d'un coup ?",
                              answer: "Oui, vous pouvez ajouter autant d'exemplaires que vous le souhaitez à votre panier d'achat. La logistique point-relais groupera vos colis !"
                            });
                            showToast("FAQ ajoutée ! Défilez pour rédiger.");
                          }}
                          className="bg-navy-950 text-gold-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-white/5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une question</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {faqItems.map((faq) => (
                          <div key={faq.id} className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3 relative">
                            <button
                              onClick={() => deleteFaqItem(faq.id)}
                              className="absolute top-4 right-4 text-stone-400 hover:text-red-600 transition-colors p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="pt-1">
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">L'interrogation posée (Question)</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaqItem(faq.id, { question: e.target.value })}
                                className="w-full bg-white border border-stone-200 rounded p-2 text-xs font-semibold text-navy-950"
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">La réponse d'auteur rédigée (Answer)</label>
                              <textarea
                                rows={3}
                                value={faq.answer}
                                onChange={(e) => updateFaqItem(faq.id, { answer: e.target.value })}
                                className="w-full bg-white border border-stone-200 rounded p-2 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 7: SITE IMAGES */}
                  {activeTab === "images" && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-bold text-navy-950">Gestion des Images du Site</h4>
                        <p className="text-xs text-stone-500">
                          Personnalisez les visuels clés du site en modifiant leurs liens ou chemins d'accès. Vous pouvez utiliser de nouveaux chemins d'images, des liens générés ou des URLs de visuels en ligne pour adapter l'esthétique à votre gré.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* 1. Book Cover Image */}
                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="w-20 h-28 shrink-0 bg-navy-950 rounded-lg border border-gold-500/20 overflow-hidden flex items-center justify-center relative shadow-md">
                              <img
                                src={siteImages.bookCover}
                                alt="Aperçu couverture"
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  // Fallback indicator if image fails to load
                                  (e.target as any).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=120&q=50";
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                              <div>
                                <h5 className="text-sm font-bold text-navy-950 font-serif">Image de Couverture du Livre (3D Mockup)</h5>
                                <p className="text-[11px] text-stone-500">S'affiche en taille imposante sur le mockup du bloc d'introduction (Hero).</p>
                              </div>
                              <input
                                type="text"
                                value={siteImages.bookCover}
                                onChange={(e) => {
                                  updateSiteImages({ bookCover: e.target.value });
                                  showToast("Image de couverture mise à jour !");
                                }}
                                placeholder="/src/assets/images/book_cover..."
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-gold-500 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Author Portrait */}
                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="w-20 h-20 shrink-0 bg-stone-200 rounded-lg border border-stone-200 overflow-hidden shadow-md flex items-center justify-center">
                              <img
                                src={siteImages.authorPortrait}
                                alt="Aperçu portrait de l'auteur"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=50";
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                              <div>
                                <h5 className="text-sm font-bold text-navy-950 font-serif">Portrait de l'Auteur</h5>
                                <p className="text-[11px] text-stone-500">S'affiche dans la section détaillée "À propos de l'Auteur".</p>
                              </div>
                              <input
                                type="text"
                                value={siteImages.authorPortrait}
                                onChange={(e) => {
                                  updateSiteImages({ authorPortrait: e.target.value });
                                  showToast("Portrait d'auteur mis à jour !");
                                }}
                                placeholder="/src/assets/images/author_portrait..."
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-gold-500 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Hero Financial Charts / Background */}
                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="w-20 h-14 shrink-0 bg-navy-950 rounded-lg border border-navy-800 overflow-hidden shadow-md flex items-center justify-center">
                              <img
                                src={siteImages.financialCharts}
                                alt="Aperçu arrière-plan"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=50";
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                              <div>
                                <h5 className="text-sm font-bold text-navy-950 font-serif">Arrière-plan Graphique Boursier</h5>
                                <p className="text-[11px] text-stone-500">S'affiche en opacité tamisée comme arrière-plan sombre du Hero (Bannière principal).</p>
                              </div>
                              <input
                                type="text"
                                value={siteImages.financialCharts}
                                onChange={(e) => {
                                  updateSiteImages({ financialCharts: e.target.value });
                                  showToast("Arrière-plan boursier mis à jour !");
                                }}
                                placeholder="/src/assets/images/financial_charts..."
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-gold-500 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
