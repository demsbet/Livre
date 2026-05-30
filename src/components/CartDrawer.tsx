/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    convertPackToPaper,
    convertPaperToPack,
    cartTotal,
    cartCount,
  } = useCart();

  const toFcfa = (euro: number) => {
    return (euro * 656).toLocaleString("fr-FR");
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    const checkoutSection = document.getElementById("contact");
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              {/* Drawer Content */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-md pointer-events-auto bg-white shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-5 bg-navy-950 text-white flex justify-between items-center border-b border-gold-500/10">
                  <div className="flex items-center space-x-2.5">
                    <ShoppingBag className="w-5.5 h-5.5 text-gold-400" />
                    <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                      Votre Panier ({cartCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full bg-navy-900 border border-white/10 text-stone-300 hover:text-white hover:border-gold-500/30 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items Body */}
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-stone-100 flex items-center justify-center text-stone-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div className="max-w-xs space-y-1">
                        <p className="font-serif text-base font-bold text-navy-950">
                          Votre panier est vide
                        </p>
                        <p className="text-xs text-stone-500 leading-normal">
                          Découvrez les secrets de l'analyse boursière africaine et bâtissez votre liberté financière.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const overview = document.getElementById("le-livre");
                          if (overview) overview.scrollIntoView({ behavior: "smooth" });
                          setIsCartOpen(false);
                        }}
                        className="inline-flex items-center space-x-1.5 bg-navy-950 text-gold-300 hover:text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <span>Parcourir l'ouvrage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-stretch bg-[#FAF9F5] rounded-xl p-4 border border-stone-200/50 relative overflow-hidden"
                        >
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="font-serif text-sm font-bold text-navy-950">
                                  {item.name}
                                </span>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-[11px] text-stone-500 mt-1 mr-4 leading-normal">
                                {item.subtitle}
                              </p>
                              {item.id === "pack" && (
                                <button
                                  type="button"
                                  onClick={() => convertPackToPaper()}
                                  className="mt-2.5 w-full flex items-center justify-between text-left text-[10px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-200/50 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                                  title="Retirer les 30 min d'entretien avec l'auteur (-15 €)"
                                >
                                  <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Sans entretien de 30 min ?</span>
                                  </span>
                                  <span className="font-bold underline text-emerald-700">
                                    Retirer (-15 €)
                                  </span>
                                </button>
                              )}
                              {item.id === "paper" && (
                                <button
                                  type="button"
                                  onClick={() => convertPaperToPack()}
                                  className="mt-2.5 w-full flex items-center justify-between text-left text-[10px] bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-950 border border-amber-200/50 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                                  title="Ajouter 30 min d'entretien avec l'auteur (+15 €)"
                                >
                                  <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span>Ajouter l'entretien de 30 min ?</span>
                                  </span>
                                  <span className="font-bold underline text-amber-700">
                                    Ajouter (+15 €)
                                  </span>
                                </button>
                              )}
                            </div>

                            <div className="flex justify-between items-end mt-4">
                              {/* Quantity selectors */}
                              <div className="flex items-center border border-stone-200 bg-white rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 rounded transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-navy-950">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-50 rounded transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price label */}
                              <div className="text-right">
                                <span className="block font-serif font-black text-sm text-gold-600">
                                  {item.price * item.quantity} €
                                </span>
                                <span className="block font-mono text-[10px] text-stone-400 mt-0.5">
                                  env. {toFcfa(item.price * item.quantity)} FCFA
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Subtotal and checkout trigger */}
                {cartItems.length > 0 && (
                  <div className="border-t border-stone-100 bg-stone-50/50 p-6 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-stone-500">
                        <span className="text-xs font-mono uppercase tracking-wider">Sous-total</span>
                        <span className="font-serif font-bold text-navy-950 text-base">{cartTotal} €</span>
                      </div>
                      <div className="flex justify-between items-baseline text-navy-950">
                        <span className="text-sm font-bold font-sans">Montant en monnaie locale</span>
                        <span className="font-mono text-sm font-black text-gold-600">{toFcfa(cartTotal)} FCFA</span>
                      </div>
                      <p className="text-[10px] text-stone-400 text-center leading-normal pt-1">
                        * Taux forfaitaire d'unification officiel : 1 € = 656 FCFA
                      </p>
                    </div>

                    <button
                      onClick={handleCheckoutClick}
                      className="w-full flex items-center justify-center space-x-2 bg-navy-950 hover:bg-navy-900 border border-gold-500/20 text-gold-400 hover:text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-navy-950/10 cursor-pointer transition-all"
                    >
                      <CreditCard className="w-4.5 h-4.5" />
                      <span>Procéder au paiement par carte</span>
                    </button>

                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full text-center text-xs text-stone-500 hover:text-navy-950 hover:underline transition-colors block font-semibold cursor-pointer"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
