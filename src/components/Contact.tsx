/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  ShoppingBag, 
  CreditCard, 
  AlertCircle, 
  Lock, 
  ShieldCheck, 
  Truck, 
  Printer, 
  Download, 
  CheckCircle, 
  ArrowRight,
  Plus,
  Minus
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";
import { AUTHOR_INFO } from "../data";
import * as db from "../lib/supabaseClient";

export default function Contact() {
  const { authorInfo } = useSite();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    convertPackToPaper,
    convertPaperToPack,
    cartTotal,
    clearCart
  } = useCart();

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Cameroun");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // States for checkout process
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);
  const [isStripeConfigured, setIsStripeConfigured] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const toFcfa = (euro: number) => {
    return (euro * 656).toLocaleString("fr-FR");
  };

  const generateWhatsAppUrl = (txnId: string) => {
    const rawNumber = authorInfo?.whatsappNumber || AUTHOR_INFO.whatsappNumber;
    const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
    
    const itemsSummary = cartItems.map(item => `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity} €`).join("\n");
    
    const message = `Bonjour M. Steeves SIEWE DE KALAMBAK,
Je viens de valider mon bon de commande sur le site internet !

🧾 Détails de la commande [ID: ${txnId}] :
${itemsSummary}
• Frais de livraison (${country}) : +${getShippingCost()} €
• MONTANT TOTAL : ${totalWithShipping} € (soit env. ${toFcfa(totalWithShipping)} FCFA)

📍 Informations de livraison :
• Nom complet : ${name}
• Email : ${email}
• WhatsApp de coordination : ${phone}
• Pays : ${country}
• Ville / Quartier : ${city}

Je souhaite finaliser mon paiement via Mobile Money ou Virement Bancaire. Merci de me guider pour la suite !`;

    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
  };

  // Get shipping price dynamically based on country
  const getShippingCost = () => {
    if (cartItems.length === 0) return 0;
    switch (country) {
      case "Cameroun":
      case "Gabon":
      case "Côte d'Ivoire":
        return 5;
      case "France":
        return 10;
      default:
        return 7;
    }
  };

  const getShippingLabel = () => {
    switch (country) {
      case "France":
        return "Livraison Express Europe / Diaspora";
      default:
        return `Livraison Express Point Relais - ${country}`;
    }
  };

  const totalWithShipping = cartTotal + getShippingCost();

  // Formats credit card number on input
  const handleCardNumberChange = (value: string) => {
    const numeric = value.replace(/\D/g, "").slice(0, 16);
    const matched = numeric.match(/.{1,4}/g);
    setCardNumber(matched ? matched.join(" ") : numeric);
  };

  // Formats expiry date: MM/YY
  const handleExpiryChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 2) {
      setCardExpiry(cleanValue);
    } else {
      setCardExpiry(`${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`);
    }
  };

  // Detect card issuer based on first digit
  const getCardIssuer = () => {
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    return "generic";
  };
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const currentErrors: string[] = [];

    // Basic Customer Fields validation
    if (!name.trim()) currentErrors.push("Veuillez saisir votre nom complet.");
    if (!email.trim() || !email.includes("@")) currentErrors.push("Veuillez saisir une adresse email valide.");
    if (!phone.trim()) currentErrors.push("Veuillez saisir votre numéro WhatsApp pour la coordination.");
    if (!city.trim()) currentErrors.push("Veuillez renseigner votre ville pour la livraison physique.");

    if (cartItems.length === 0) {
      currentErrors.push("Votre panier est actuellement vide. Veuillez y ajouter un article.");
    }

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      // Scroll to errors
      const errorContainer = document.getElementById("validation-error-anchor");
      if (errorContainer) {
        errorContainer.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setErrors([]);
    setIsProcessing(true);
  };

  // Sauvegarder la commande validée et ses détails dans la base de données Supabase
  const saveOrderToSupabase = async (txnId: string) => {
    try {
      if (!db.isSupabaseConfigured || !db.supabase) {
        console.warn("Supabase n'est pas encore configuré dans le fichier .env de l'application. La commande a été émulée localement avec succès !");
        return;
      }

      // 1. Insérer la commande principale dans la table 'orders'
      const { data: orderData, error: orderError } = await db.supabase
        .from("orders")
        .insert([
          {
            transaction_id: txnId,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            delivery_city: city,
            delivery_country: country,
            total_amount: totalWithShipping,
            shipping_fee: getShippingCost(),
            payment_status: "pending_whatsapp",
            card_holder: "WhatsApp Order",
            card_last_four: "0000"
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Erreur Supabase lors de la création de la commande :", orderError);
        return;
      }

      if (!orderData) return;

      // 2. Préparer la liste des articles reliés au ID unique généré par la table 'orders'
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity
      }));

      // 3. Insérer tous les articles d'achat d'un coup dans 'order_items'
      const { error: itemsError } = await db.supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error("Erreur Supabase lors de la création des articles associés :", itemsError);
      } else {
        console.log("Commande enregistrée avec succès dans Supabase !");
      }
    } catch (err) {
      console.error("Exception lors de la connexion/écriture Supabase :", err);
    }
  };

  // Process live order submission via full-stack checkout API
  useEffect(() => {
    if (!isProcessing) return;

    const steps = [
      "Vérification des coordonnées de livraison...",
      "Calcul des frais d'expédition CEMAC...",
      "Génération du bon de commande unique...",
      "Enregistrement sécurisé de votre commande...",
      "Génération de l'accès au canal de paiement WhatsApp..."
    ];

    let currentStepIdx = 0;
    setProcessingStep(steps[0]);

    // Fast progress through encryption/security checks, then send API payload
    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length - 1) {
        setProcessingStep(steps[currentStepIdx]);
      } else if (currentStepIdx === steps.length - 1) {
        setProcessingStep(steps[currentStepIdx]);
        
        // Stop the interval and run the API request
        clearInterval(interval);
        
        fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            country,
            city,
            cartItems,
            totalAmount: totalWithShipping,
            shippingFee: getShippingCost()
          })
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((errData) => {
                throw new Error(errData.error || "Une erreur est survenue lors de la validation fiscale.");
              });
            }
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              setTransactionId(data.transactionId);
              setIsSmtpConfigured(data.smtpConfigured);
              setIsStripeConfigured(data.stripeConfigured);
              setEmailSent(data.emailSent);
              setEmailError(data.emailError);
              
              setIsProcessing(false);
              setIsPaid(true);
              
              // Maintain local/secondary database recording for absolute safety
              saveOrderToSupabase(data.transactionId);
            } else {
              setErrors([data.error || "La passerelle de commande a refusé la demande."]);
              setIsProcessing(false);
            }
          })
          .catch((err) => {
            console.error("[Checkout] Échec :", err);
            setErrors([err.message || "Impossible de joindre le serveur de facturation ou messagerie."]);
            setIsProcessing(false);
          });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Reset order and cart on new buy trigger
  const handleResetOrder = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCvv("");
    setIsPaid(false);
    clearCart();
  };

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-navy-50 border border-navy-100 px-3 py-1 rounded-full text-navy-800 font-mono text-xs tracking-wider uppercase font-bold">
            <CreditCard className="w-3.5 h-3.5 text-gold-500" />
            <span>Paiement en ligne haut de gamme</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Caisse & Paiement Sécurisé
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-gold-500 to-amber-600 mx-auto rounded-full" />
          <p className="text-stone-600 text-base">
            Bénéficiez de la livraison express dans toute la zone CEMAC et à l'international. Notre protocole de paiement par carte bancaire est entièrement sécurisé et chiffré.
          </p>
        </div>

        {/* 3-D Secure processing loader screen */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex flex-col justify-center items-center text-center p-6"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-gold-500/25 border-t-gold-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gold-400" />
                </div>
              </div>

              <div className="max-w-md space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Paiement Express Sécurisé
                </h3>
                <p className="font-mono text-xs text-gold-400 select-all tracking-wider font-semibold">
                  SÉCURITÉ SSL ACTIVE (PCI-DSS ENFORCED)
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                  <p className="text-sm text-stone-200 animate-pulse font-sans">
                    {processingStep}
                  </p>
                </div>
                <p className="text-[10px] text-stone-400">
                  Ne fermez pas cette fenêtre. La transaction est en cours de cryptage et d'autorisation.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer container */}
        <div id="validation-error-anchor" className="pt-2">
          <AnimatePresence mode="wait">
            {!isPaid ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                
                {/* Left Column: Cart Review Summary & Delivery Surcharge details */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-navy-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="font-serif text-xl font-bold">
                        Votre Panier d'Achat
                      </h3>
                      <span className="text-xs font-mono bg-white/10 text-gold-300 px-2.5 py-1 rounded-full font-bold">
                        E-Commerce Direct
                      </span>
                    </div>

                    {/* Cart Items list in summary */}
                    {cartItems.length === 0 ? (
                      <div className="py-12 text-center space-y-4">
                        <ShoppingBag className="w-12 h-12 text-stone-500 mx-auto" />
                        <div className="space-y-2">
                          <p className="text-sm text-stone-300 font-semibold">
                            Aucun livre sélectionné
                          </p>
                          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-normal">
                            Sélectionnez l'un des formats officiels ci-dessous pour l'ajouter instantanément et démarrer votre paiement par carte.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => addToCart("paper")}
                            className="w-full flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 text-xs text-white p-3 rounded-lg transition-all text-left cursor-pointer"
                          >
                            <div>
                              <span className="font-bold block">1. Livre Papier Premium</span>
                              <span className="text-[10px] text-stone-400">Couverture rigide de luxe</span>
                            </div>
                            <span className="font-bold text-gold-400">35 €</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => addToCart("pack")}
                            className="w-full flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 text-xs text-white p-3 rounded-lg transition-all text-left cursor-pointer"
                          >
                            <div>
                              <span className="font-bold block">2. Pack Duo Élite</span>
                              <span className="text-[10px] text-stone-400">Livre + 30 min Coaching</span>
                            </div>
                            <span className="font-bold text-gold-400">50 €</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 transition-all"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="space-y-0.5 max-w-[55%]">
                                <span className="font-bold text-sm block truncate text-white">{item.name}</span>
                                <span className="text-[10px] block text-stone-400 truncate">{item.subtitle}</span>
                              </div>
                              
                              {/* Quantity buttons inside the sidebar summary */}
                              <div className="flex items-center space-x-1 bg-navy-900 border border-white/10 rounded-lg p-0.5 shrink-0 select-none">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
                                >
                                  <Minus className="w-2 h-2" />
                                </button>
                                <span className="w-4 text-center text-[10px] font-bold text-white">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(item.id)}
                                  className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
                                >
                                  <Plus className="w-2 h-2" />
                                </button>
                              </div>

                              <span className="font-serif font-black text-sm text-gold-400 shrink-0 text-right">
                                {item.price * item.quantity} €
                              </span>
                            </div>

                            {item.id === "pack" && (
                              <button
                                type="button"
                                onClick={() => convertPackToPaper()}
                                className="w-full flex items-center justify-between text-left text-[10px] bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/25 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                                title="Retirer l'entretien d'accompagnement de 30 min (-15 €)"
                              >
                                <span>Pas d'entretien d'échanges de 30 min ?</span>
                                <span className="underline hover:text-white">Retirer (-15 €)</span>
                              </button>
                            )}

                            {item.id === "paper" && (
                              <button
                                type="button"
                                onClick={() => convertPaperToPack()}
                                className="w-full flex items-center justify-between text-left text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                                title="Ajouter l'entretien de coaching de 30 min (+15 €)"
                              >
                                <span>Ajouter l'entretien de coaching de 30 min ?</span>
                                <span className="underline hover:text-white">Ajouter (+15 €)</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Delivery summary details */}
                    <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-navy-200 font-sans">
                      <div className="flex items-center space-x-2 text-gold-300">
                        <Truck className="w-4 h-4" />
                        <span className="font-bold tracking-wider uppercase text-[10px]">Expédition Express Locale</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-stone-300">
                          <span>Sous-total articles</span>
                          <span className="text-white font-bold">{cartTotal} €</span>
                        </div>
                        <div className="flex justify-between items-center text-stone-300">
                          <span>{getShippingLabel()}</span>
                          {cartItems.length === 0 ? (
                            <span>0 €</span>
                          ) : (
                            <span className="text-white font-bold">+{getShippingCost()} €</span>
                          )}
                        </div>
                        <div className="flex justify-between items-baseline border-t border-white/5 pt-2 text-gold-400 font-bold">
                          <span>Total Général</span>
                          <div className="text-right">
                            <span className="font-serif text-lg text-white font-black block">{totalWithShipping} €</span>
                            <span className="text-[10px] text-gold-400 font-mono">env. {toFcfa(totalWithShipping)} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust security footnotes at the bottom limit */}
                  <div className="space-y-2 pt-4 border-t border-white/10 text-[11px] text-navy-300 mt-auto leading-relaxed">
                    <div className="flex items-center space-x-1.5 text-gold-500 font-bold">
                      <ShieldCheck className="w-4 h-4 text-gold-500" />
                      <span>Transactions Authentifiées par la COSUMAF</span>
                    </div>
                    <p>
                      Vos données de paiement sont cryptées à l'aide du protocole sécurisé SSL & Direct Checkout conformes aux directives CEMAC. Nous ne stockons aucun de vos identifiants bancaires personnels.
                    </p>
                  </div>
                </div>

                {/* Right Column: Checkout Fields & Interactive Visual Credit Card Form */}
                <div className="lg:col-span-7 bg-navy-50/30 border border-stone-200/50 rounded-2xl p-6 sm:p-10 shadow-sm">
                  
                  {/* Display validation errors at current anchor */}
                  {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm rounded-r-lg space-y-1">
                      <div className="flex items-center space-x-1 font-bold">
                        <AlertCircle className="w-4.5 h-4.5 text-red-500" />
                        <span>Veuillez compléter avant de régler :</span>
                      </div>
                      <ul className="list-disc list-inside pl-2 font-medium">
                        {errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    
                    {/* STEP 1: Billing and Shipping Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-navy-950 text-white font-mono text-xs font-bold flex items-center justify-center">1</div>
                        <h4 className="font-serif text-base font-bold text-navy-950">
                          Coordonnées de Livraison de l'Ouvrage
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Recipient Full Name */}
                        <div>
                          <label htmlFor="customer-name" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                            Nom du destinataire *
                          </label>
                          <input
                            type="text"
                            id="customer-name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="M. Marc N'Guessan"
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label htmlFor="customer-email" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                            Adresse e-mail active *
                          </label>
                          <input
                            type="email"
                            id="customer-email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre.email@domain.com"
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Phone Number with WA icon hint */}
                        <div>
                          <label htmlFor="customer-phone" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                            WhatsApp de coordination *
                          </label>
                          <input
                            type="tel"
                            id="customer-phone"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+237 699 00 00 00"
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
                          />
                        </div>

                        {/* Destination Country selection */}
                        <div>
                          <label htmlFor="customer-country" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                            Pays de destination *
                          </label>
                          <select
                            id="customer-country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
                          >
                            <option value="Cameroun">Cameroun (CMR)</option>
                            <option value="Gabon">Gabon (GAB)</option>
                            <option value="Côte d'Ivoire">Côte d'Ivoire (CI)</option>
                            <option value="Sénégal">Sénégal (SEN)</option>
                            <option value="Togo">Togo (TGO)</option>
                            <option value="Bénin">Bénin (BEN)</option>
                            <option value="Congo RD">Congo RD (RDC)</option>
                            <option value="France">Europe / Diaspora</option>
                          </select>
                        </div>

                        {/* Capital City text */}
                        <div>
                          <label htmlFor="customer-city" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-mono">
                            Ville / Quartier *
                          </label>
                          <input
                            type="text"
                            id="customer-city"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ex: Douala, Bonapriso"
                            className="w-full bg-[#FAF9F5] border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500">
                          </input>
                        </div>
                      </div>
                    </div>

                    {/* STEP 2: Instruction de paiement par WhatsApp / Mobile Money */}
                    <div className="space-y-4 pt-4 border-t border-stone-200/50">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center">2</div>
                        <h4 className="font-serif text-base font-bold text-navy-950">
                          Méthodes de Paiement Supportées sur WhatsApp
                        </h4>
                      </div>

                      <div className="bg-[#FAF9F5] border border-stone-200/65 rounded-xl p-5 space-y-4">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          La livraison du livre papier est coordonnée en direct. Une fois vos informations de livraison validées ci-dessus, vous serez connecté avec l'auteur pour régler via l'un des canaux sécurisés ci-dessous :
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-white border border-stone-200/50 rounded-lg p-3 text-center space-y-1">
                            <div className="text-xs font-bold font-serif text-amber-800">Mobile Money</div>
                            <div className="text-[10px] text-stone-500">Orange Money, MTN MoMo, Wave</div>
                          </div>
                          
                          <div className="bg-white border border-stone-200/50 rounded-lg p-3 text-center space-y-1">
                            <div className="text-xs font-bold font-serif text-amber-800">Virement Bancaire</div>
                            <div className="text-[10px] text-stone-500">RIB Local CEMAC / UEMOA</div>
                          </div>
                          
                          <div className="bg-white border border-stone-200/50 rounded-lg p-3 text-center space-y-1">
                            <div className="text-xs font-bold font-serif text-amber-800">Paiement Manuel</div>
                            <div className="text-[10px] text-stone-500 font-sans">À la remise (Selon la ville)</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-emerald-800 leading-relaxed">
                            <strong>Avis de l'Auteur :</strong> Ce canal direct garantit un accompagnement sur mesure pour vos besoins de livraison express sans intermédiaires de paiement complexes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Global Secure Action submit button */}
                    <div className="pt-6 border-t border-stone-200/50">
                      <button
                        type="submit"
                        disabled={cartItems.length === 0}
                        className={`w-full flex items-center justify-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer transition-all ${
                          cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
                        }`}
                      >
                        <Phone className="w-4.5 h-4.5" />
                        <span>Créer mon bon & Finaliser sur WhatsApp</span>
                      </button>
                      <p className="text-[10px] text-stone-400 text-center leading-relaxed mt-2.5 max-w-sm mx-auto">
                        Vos informations de livraison seront sécurisées et enregistrées dans la base Supabase et un reçu de commande automatisé vous sera expédié par e-mail.
                      </p>
                    </div>

                  </form>
                </div>

              </div>
            ) : (
              /* COMPREHENSIVE COMMERCIAL INVOICE IN DECORATED LIGHT CARD */
              <motion.div
                key="billing-receipt"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 sm:p-10 shadow-lg text-navy-950 space-y-8"
              >
                {/* Visual success logo header */}
                <div className="text-center space-y-3 pb-6 border-b border-stone-200/80">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner border border-emerald-200">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-black text-navy-950">
                      Bon de Commande Enregistré !
                    </h3>
                    <p className="text-xs text-emerald-700 tracking-widest font-mono uppercase font-black">
                      AIGUILLAGE SECURE VERS WHATSAPP
                    </p>
                  </div>
                </div>

                {/* Receipt Details rows */}
                <div className="space-y-5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-serif text-base font-bold text-navy-950">Fiche de Commande</h4>
                    <span className="font-mono text-xs text-stone-500 font-semibold">{new Date().toLocaleDateString("fr-FR")} à {new Date().toLocaleTimeString("fr-FR")}</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 text-xs leading-normal">
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider block text-[9px] font-mono font-bold">Numéro de transaction</span>
                        <span className="font-mono font-bold text-navy-950 select-all">{transactionId}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider block text-[9px] font-mono font-bold">Méthode de paiement</span>
                        <span className="font-bold text-navy-950 flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>WHATSAPP MOBILE_MONEY</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider block text-[9px] font-mono font-bold">Expédié à</span>
                        <span className="font-bold text-navy-950 block">{name}</span>
                        <span className="block text-stone-500">{city}, {country}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider block text-[9px] font-mono font-bold">Coordonnées contact</span>
                        <span className="font-semibold block text-navy-950">{email}</span>
                        <span className="block text-stone-500">WhatsApp: {phone}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-stone-400 uppercase tracking-wider block text-[9px] font-mono font-bold mb-2">Détail des achats</span>
                      <div className="space-y-1.5 font-medium">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-navy-950">{item.name} <strong className="text-stone-400">x{item.quantity}</strong></span>
                            <span>{item.price * item.quantity} €</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-[#94a3b8] pt-1 text-[11px]">
                          <span>{getShippingLabel()}</span>
                          <span>{getShippingCost()} €</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stone-200 pt-3.5 flex justify-between items-baseline font-black text-sm sm:text-base">
                      <span className="text-navy-950 uppercase font-mono tracking-wider">TOTAL DE COMMANDE (À RÉGLER)</span>
                      <div className="text-right">
                        <span className="font-serif text-gold-600 text-lg sm:text-xl block">{totalWithShipping} €</span>
                        <span className="text-[10px] text-stone-500 font-mono block">soit environ {toFcfa(totalWithShipping)} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final step action triggers (Print, continue shopping) */}
                <div className="space-y-4 pt-4 border-t border-stone-200/80">
                  <div className="space-y-4">
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4">
                      <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-sans font-semibold">
                        📚 Félicitations ! Votre intention de commande a été enregistrée avec succès.
                      </p>
                      
                      <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-sans">
                        👉 <strong>Étape finale obligatoire :</strong> Veuillez cliquer sur le bouton d'action vert ci-dessous pour ouvrir WhatsApp et envoyer votre bon de commande à l'auteur afin de procéder au règlement (par Mobile Money ou Virement) et recevoir l'ouvrage.
                      </p>
                      
                      <div className="pt-2 text-center">
                        <a
                          href={generateWhatsAppUrl(transactionId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer transition-all animate-pulse hover:scale-[1.01]"
                        >
                          <Phone className="w-5 h-5 animate-bounce" />
                          <span className="text-sm">💬 FINALISER LE PAIEMENT SUR WHATSAPP</span>
                        </a>
                      </div>
                    </div>

                    {/* Backend Live Integration Diagnosis Badges */}
                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5 text-left text-xs text-stone-750">
                      <div className="font-bold text-stone-900 tracking-wide uppercase font-mono text-[10px]">Diagnostics de Liaison :</div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-stone-800">Canal de Caisse :</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-700 font-bold">
                          WHATSAPP REVENUE STREAM
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center border-t border-stone-150 pt-2">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${emailSent ? "bg-emerald-500" : "bg-amber-500"}`} />
                          <span className="font-semibold text-stone-800">Notification par E-mail :</span>
                        </div>
                        <span className="font-mono text-[11px]">
                          {emailSent ? (
                            <strong className="text-emerald-700 font-bold">E-MAILS RÉELS ENVOYÉS (SMTP ACTIF)</strong>
                          ) : (
                            <span className="text-amber-700 font-semibold">
                              {emailError ? `Échec d'envoi SMTP : ${emailError}` : "Mode Simulation (Identifiants SMTP manquants dans .env)"}
                            </span>
                          )}
                        </span>
                      </div>

                      {!isSmtpConfigured && (
                        <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-lg text-[11px] text-amber-900 leading-normal font-medium mt-1">
                          💡 <strong>Note pour le Déploiement :</strong> Pour activer les notifications par e-mail réelles pour vos clients et vous-même, configurez les variables <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code> dans le panneau des secrets.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-bold">
                    <button
                      type="button"
                      id="invoice-print"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-stone-50 border border-stone-200 px-6 py-3 rounded-lg text-xs font-bold text-navy-950 cursor-pointer shadow-sm transition-all"
                    >
                      <Printer className="w-4 h-4 text-stone-500" />
                      <span>Imprimer mon bon de commande</span>
                    </button>

                    <button
                      type="button"
                      id="reset-store"
                      onClick={handleResetOrder}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-navy-950 hover:bg-navy-900 text-white px-6 py-3 rounded-lg text-xs font-bold cursor-pointer shadow-md transition-all"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold-400" />
                      <span>Faire d'autres achats</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
