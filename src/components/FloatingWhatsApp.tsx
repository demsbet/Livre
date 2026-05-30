/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { authorInfo } = useSite();

  useEffect(() => {
    // Show premium tooltip teaser after 5 seconds to entice purchase
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4500);

    // Hide it again after 10 seconds to maintain visual cleanliness
    const timerHide = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 pointer-events-none">
      {/* Tooltip teaser */}
      {showTooltip && (
        <div className="bg-navy-950 text-white border border-gold-400/30 text-xs py-2 px-4.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-fade-in-right max-w-[220px] pointer-events-auto shrink-0 select-none">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="font-medium font-sans">Commandez directement via WhatsApp !</span>
        </div>
      )}

      {/* Primary Floating Button */}
      <a
        id="floating-whatsapp-action"
        href={`https://wa.me/${authorInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(authorInfo.whatsappMessage)}`}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl pointer-events-auto transition-all transform hover:scale-110 active:scale-95 duration-300 relative group cursor-pointer"
        aria-label="Order via WhatsApp"
      >
        {/* Glowing ring effects */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-500 opacity-20 animate-ping" />
        <span className="absolute inset-0 rounded-full bg-emerald-600 group-hover:bg-emerald-500 transition-colors" />

        <MessageSquare className="w-6.5 h-6.5 text-white stroke-[2.2] relative z-10 fill-emerald-50/10" />

        {/* Hover label for desktop cursor */}
        <span className="absolute right-full mr-4 bg-navy-950 text-white text-[11px] font-mono tracking-wider uppercase font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gold-500/20 shadow-xl hidden md:block">
          WhatsApp Direct
        </span>
      </a>
    </div>
  );
}
