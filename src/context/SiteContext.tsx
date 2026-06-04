/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { BookChapter, BookBenefit, Testimonial, FAQItem } from "../types";
import { 
  AUTHOR_INFO as DEFAULT_AUTHOR_INFO, 
  BOOK_DETAILS as DEFAULT_BOOK_DETAILS, 
  BOOK_CHAPTERS as DEFAULT_BOOK_CHAPTERS, 
  BOOK_BENEFITS as DEFAULT_BOOK_BENEFITS, 
  TESTIMONIALS as DEFAULT_TESTIMONIALS, 
  FAQ_ITEMS as DEFAULT_FAQ_ITEMS,
  SITE_IMAGES as DEFAULT_SITE_IMAGES
} from "../data";
import * as db from "../lib/supabaseClient";

interface SiteContextType {
  authorInfo: typeof DEFAULT_AUTHOR_INFO;
  bookDetails: typeof DEFAULT_BOOK_DETAILS;
  bookChapters: BookChapter[];
  bookBenefits: BookBenefit[];
  testimonials: Testimonial[];
  faqItems: FAQItem[];
  siteImages: typeof DEFAULT_SITE_IMAGES;
  isSupabaseReady: boolean;
  hasDbFrontBack: boolean;
  lastError: string | null;
  clearLastError: () => void;
  
  updateAuthorInfo: (info: Partial<typeof DEFAULT_AUTHOR_INFO>) => void;
  updateBookDetails: (details: Partial<typeof DEFAULT_BOOK_DETAILS>) => void;
  updateSiteImages: (images: Partial<typeof DEFAULT_SITE_IMAGES>) => void;
  
  updateChapter: (id: string, updated: Partial<BookChapter>) => void;
  addChapter: (chapter: Omit<BookChapter, "id">) => void;
  deleteChapter: (id: string) => void;
  
  updateBenefit: (id: string, updated: Partial<BookBenefit>) => void;
  addBenefit: (benefit: Omit<BookBenefit, "id">) => void;
  deleteBenefit: (id: string) => void;
  
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: string) => void;
  
  updateFaqItem: (id: string, updated: Partial<FAQItem>) => void;
  addFaqItem: (item: Omit<FAQItem, "id">) => void;
  deleteFaqItem: (id: string) => void;
  
  resetToDefaults: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  // Read live, dynamically updated Supabase config properties from db module
  const isSupabaseConfigured = db.isSupabaseConfigured;
  const supabase = db.supabase;

  // Use state with lazy initializers from localStorage
  const [authorInfo, setAuthorInfoState] = useState(() => {
    try {
      const saved = localStorage.getItem("site_author_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === "+237699000000") {
          parsed.whatsappNumber = "+33 6 25 25 31 43";
        }
        if (parsed.email === "contact@siewe-finance.com") {
          parsed.email = "kalambaksteeves@yahoo.fr";
        }
        if (parsed.name === "Siewe de Kalambak Steeves") {
          parsed.name = "Steeves SIEWE DE KALAMBAK";
          parsed.bio = parsed.bio?.replace(/Siewe de Kalambak Steeves/g, "Steeves SIEWE DE KALAMBAK");
          parsed.extendedBio = parsed.extendedBio?.replace(/Siewe/g, "Steeves");
          parsed.whatsappMessage = parsed.whatsappMessage?.replace(/Siewe de Kalambak Steeves/g, "Steeves SIEWE DE KALAMBAK");
        }
        return parsed;
      }
      return DEFAULT_AUTHOR_INFO;
    } catch {
      return DEFAULT_AUTHOR_INFO;
    }
  });

  const [bookDetails, setBookDetailsState] = useState(() => {
    try {
      const saved = localStorage.getItem("site_book_details");
      return saved ? JSON.parse(saved) : DEFAULT_BOOK_DETAILS;
    } catch {
      return DEFAULT_BOOK_DETAILS;
    }
  });

  const [bookChapters, setBookChaptersState] = useState<BookChapter[]>(() => {
    try {
      const saved = localStorage.getItem("site_book_chapters");
      return saved ? JSON.parse(saved) : DEFAULT_BOOK_CHAPTERS;
    } catch {
      return DEFAULT_BOOK_CHAPTERS;
    }
  });

  const [bookBenefits, setBookBenefitsState] = useState<BookBenefit[]>(() => {
    try {
      const saved = localStorage.getItem("site_book_benefits");
      return saved ? JSON.parse(saved) : DEFAULT_BOOK_BENEFITS;
    } catch {
      return DEFAULT_BOOK_BENEFITS;
    }
  });

  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem("site_testimonials");
      if (saved) {
        const parsed = JSON.parse(saved) as Testimonial[];
        return parsed.map(p => {
          const match = DEFAULT_TESTIMONIALS.find(d => d.id === p.id);
          if (match && !p.avatarUrl) {
            return { ...p, avatarUrl: match.avatarUrl };
          }
          return p;
        });
      }
      return DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  });

  const [faqItems, setFaqItemsState] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem("site_faq_items");
      return saved ? JSON.parse(saved) : DEFAULT_FAQ_ITEMS;
    } catch {
      return DEFAULT_FAQ_ITEMS;
    }
  });

  const [siteImages, setSiteImagesState] = useState(() => {
    try {
      const saved = localStorage.getItem("site_site_images");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Force update default stale paths that are not buildable on Vercel
        if (parsed.bookCover?.startsWith("/src/assets/")) {
          parsed.bookCover = DEFAULT_SITE_IMAGES.bookCover;
        }
        if (parsed.authorPortrait?.startsWith("/src/assets/")) {
          parsed.authorPortrait = DEFAULT_SITE_IMAGES.authorPortrait;
        }
        if (parsed.financialCharts?.startsWith("/src/assets/")) {
          parsed.financialCharts = DEFAULT_SITE_IMAGES.financialCharts;
        }
        // Fallbacks for front & back covers in localStorage if not defined
        if (!parsed.bookCoverFront) {
          parsed.bookCoverFront = DEFAULT_SITE_IMAGES.bookCoverFront;
        }
        if (!parsed.bookCoverBack) {
          parsed.bookCoverBack = DEFAULT_SITE_IMAGES.bookCoverBack;
        }
        return parsed;
      }
      return DEFAULT_SITE_IMAGES;
    } catch {
      return DEFAULT_SITE_IMAGES;
    }
  });

  const [isSupabaseReady, setIsSupabaseReady] = useState(db.isSupabaseConfigured);
  const [lastError, setLastError] = useState<string | null>(null);
  const [hasDbFrontBack, setHasDbFrontBack] = useState(false);
  const clearLastError = () => setLastError(null);

  // Load live data from Supabase on startup
  useEffect(() => {
    const fetchAllLiveSiteData = async () => {
      // 0. Fetch credentials dynamically from Express environment if they are configured on the backend
      try {
        const configRes = await fetch("/api/supabase-config");
        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData.supabaseUrl && configData.supabaseAnonKey) {
            db.updateSupabaseConfig(configData.supabaseUrl, configData.supabaseAnonKey);
          }
        }
      } catch (err) {
        console.log("[SiteContext] Backend not reachable at /api/supabase-config or offline. Falling back to build-time vars.", err);
      }

      setIsSupabaseReady(db.isSupabaseConfigured);

      if (!db.isSupabaseConfigured || !db.supabase) {
        console.log("Supabase is not configured yet. Using offline local/fallback storage.");
        return;
      }
      const supabase = db.supabase;
      try {
        // 1. Fetch Author Info
        const { data: authorData, error: authorError } = await supabase
          .from("author_info")
          .select("*")
          .limit(1);
        
        if (!authorError && authorData && authorData.length > 0) {
          const row = authorData[0];
          let name = row.name;
          let bio = row.bio;
          let extendedBio = row.extended_bio;
          let whatsappMessage = row.whatsapp_message;
          
          if (name === "Siewe de Kalambak Steeves") {
            name = "Steeves SIEWE DE KALAMBAK";
            bio = bio?.replace(/Siewe de Kalambak Steeves/g, "Steeves SIEWE DE KALAMBAK");
            extendedBio = extendedBio?.replace(/Siewe/g, "Steeves");
            whatsappMessage = whatsappMessage?.replace(/Siewe de Kalambak Steeves/g, "Steeves SIEWE DE KALAMBAK");
            
            // Automatically update the record in Supabase so the DB is corrected!
            supabase.from("author_info")
              .update({
                name,
                bio,
                extended_bio: extendedBio,
                whatsapp_message: whatsappMessage
              })
              .eq("id", row.id)
              .then(() => console.log("Author name auto-migrated in Supabase"));
          }

          const authorInfoPayload = {
            name,
            role: row.role,
            bio,
            extendedBio,
            whatsappNumber: row.whatsapp_number,
            whatsappMessage,
            email: row.email,
          };
          setAuthorInfoState(authorInfoPayload);
          localStorage.setItem("site_author_info", JSON.stringify(authorInfoPayload));
        }

        // 2. Fetch Book Details
        const { data: bookData, error: bookError } = await supabase
          .from("book_details")
          .select("*")
          .limit(1);

        if (!bookError && bookData && bookData.length > 0) {
          const row = bookData[0];
          const bookDetailsPayload = {
            title: row.title,
            subtitle: row.subtitle,
            pricePaper: row.price_paper ? `${Math.round(row.price_paper)} €` : "35 €",
            originalPricePaper: row.original_price_paper ? `${Math.round(row.original_price_paper)} €` : "45 €",
            pages: row.pages,
            language: row.language,
            format: row.format,
            releaseYear: row.release_year,
          };
          setBookDetailsState(bookDetailsPayload);
          localStorage.setItem("site_book_details", JSON.stringify(bookDetailsPayload));
        }

        // 3. Fetch Book Chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("*")
          .order("number", { ascending: true });

        if (!chaptersError && chaptersData && chaptersData.length > 0) {
          const chaptersPayload = chaptersData.map((row: any) => ({
            id: row.id,
            number: row.number,
            title: row.title,
            description: row.description,
            highlights: row.highlights || []
          }));
          setBookChaptersState(chaptersPayload);
          localStorage.setItem("site_book_chapters", JSON.stringify(chaptersPayload));
        }

        // 4. Fetch Benefits
        const { data: benefitsData, error: benefitsError } = await supabase
          .from("benefits")
          .select("*")
          .order("id", { ascending: true });

        if (!benefitsError && benefitsData && benefitsData.length > 0) {
          const benefitsPayload = benefitsData.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            icon: row.icon
          }));
          setBookBenefitsState(benefitsPayload);
          localStorage.setItem("site_book_benefits", JSON.stringify(benefitsPayload));
        }

        // 5. Fetch Testimonials
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from("testimonials")
          .select("*")
          .order("id", { ascending: true });

        if (!testimonialsError && testimonialsData && testimonialsData.length > 0) {
          const testimonialsPayload = testimonialsData.map((row: any) => ({
            id: row.id,
            name: row.name,
            role: row.role,
            company: row.company,
            content: row.content,
            avatar_url: row.avatar_url,
            rating: row.rating
          }));
          setTestimonialsState(testimonialsPayload);
          localStorage.setItem("site_testimonials", JSON.stringify(testimonialsPayload));
        }

        // 6. Fetch FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from("faqs")
          .select("*")
          .order("id", { ascending: true });

        if (!faqsError && faqsData && faqsData.length > 0) {
          const faqPayload = faqsData.map((row: any) => ({
            id: row.id,
            question: row.question,
            answer: row.answer
          }));
          setFaqItemsState(faqPayload);
          localStorage.setItem("site_faq_items", JSON.stringify(faqPayload));
        }

        // 7. Fetch Site Images
        const { data: imagesData, error: imagesError } = await supabase
          .from("site_images")
          .select("*")
          .limit(1);

        if (!imagesError && imagesData && imagesData.length > 0) {
          const row = imagesData[0];
          const hasColumns = "book_cover_front" in row && "book_cover_back" in row;
          setHasDbFrontBack(hasColumns);
          const imagesPayload = {
            authorPortrait: row.author_portrait,
            bookCover: row.book_cover,
            financialCharts: row.financial_charts,
            bookCoverFront: row.book_cover_front || row.book_cover || DEFAULT_SITE_IMAGES.bookCoverFront,
            bookCoverBack: row.book_cover_back || DEFAULT_SITE_IMAGES.bookCoverBack,
          };
          setSiteImagesState(imagesPayload);
          localStorage.setItem("site_site_images", JSON.stringify(imagesPayload));
        }
      } catch (err) {
        console.error("Exception while fetching live Supabase data:", err);
      }
    };

    fetchAllLiveSiteData();
  }, []);

  // Sync state to localStorage immediately on any update to enable quick cached rendering
  useEffect(() => {
    localStorage.setItem("site_author_info", JSON.stringify(authorInfo));
  }, [authorInfo]);

  useEffect(() => {
    localStorage.setItem("site_book_details", JSON.stringify(bookDetails));
  }, [bookDetails]);

  useEffect(() => {
    localStorage.setItem("site_book_chapters", JSON.stringify(bookChapters));
  }, [bookChapters]);

  useEffect(() => {
    localStorage.setItem("site_book_benefits", JSON.stringify(bookBenefits));
  }, [bookBenefits]);

  useEffect(() => {
    localStorage.setItem("site_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem("site_faq_items", JSON.stringify(faqItems));
  }, [faqItems]);

  useEffect(() => {
    localStorage.setItem("site_site_images", JSON.stringify(siteImages));
  }, [siteImages]);

  // Actions
  const updateAuthorInfo = (info: Partial<typeof DEFAULT_AUTHOR_INFO>) => {
    setAuthorInfoState((prev: typeof DEFAULT_AUTHOR_INFO) => {
      const next = { ...prev, ...info };
      
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("author_info")
          .select("id")
          .limit(1)
          .then(({ data, error: selectError }) => {
            if (selectError) {
              console.error("[Supabase] Erreur lecture author_info ID:", selectError);
              return;
            }
            const payload = {
              name: next.name,
              role: next.role,
              bio: next.bio,
              extended_bio: next.extendedBio,
              whatsapp_number: next.whatsappNumber,
              whatsapp_message: next.whatsappMessage,
              email: next.email
            };
            if (data && data.length > 0) {
              supabase.from("author_info")
                .update(payload)
                .eq("id", data[0].id)
                .then(({ error: updateError }: any) => {
                  if (updateError) {
                    console.error("[Supabase] ÉCHEC mise à jour author_info (Vérifiez RLS) :", updateError);
                    setLastError(updateError.message || "RLS Blocked Update");
                  } else {
                    console.log("[Supabase] Info auteur mise à jour avec succès !");
                    setLastError(null);
                  }
                });
            } else {
              supabase.from("author_info")
                .insert([payload])
                .then(({ error: insertError }: any) => {
                  if (insertError) {
                    console.error("[Supabase] ÉCHEC insertion author_info (Vérifiez RLS) :", insertError);
                    setLastError(insertError.message || "RLS Blocked Insert");
                  } else {
                    console.log("[Supabase] Nouvelle info auteur insérée !");
                    setLastError(null);
                  }
                });
            }
          });
      }
      return next;
    });
  };

  const updateBookDetails = (details: Partial<typeof DEFAULT_BOOK_DETAILS>) => {
    setBookDetailsState((prev: typeof DEFAULT_BOOK_DETAILS) => {
      const next = { ...prev, ...details };

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("book_details")
          .select("id")
          .limit(1)
          .then(({ data, error: selectError }) => {
            if (selectError) {
              console.error("[Supabase] Erreur lecture book_details ID:", selectError);
              return;
            }
            const pricePaperVal = parseFloat(next.pricePaper?.replace(/[^\d.]/g, '') || "35");
            const originalPricePaperVal = parseFloat(next.originalPricePaper?.replace(/[^\d.]/g, '') || "45");
            
            const payload = {
              title: next.title,
              subtitle: next.subtitle,
              price_paper: pricePaperVal,
              original_price_paper: originalPricePaperVal,
              pages: next.pages,
              language: next.language,
              format: next.format,
              release_year: next.releaseYear
            };
            
            if (data && data.length > 0) {
              supabase.from("book_details")
                .update(payload)
                .eq("id", data[0].id)
                .then(({ error: updateError }: any) => {
                  if (updateError) {
                    console.error("[Supabase] ÉCHEC mise à jour book_details (Vérifiez RLS) :", updateError);
                    setLastError(updateError.message || "RLS Blocked Update");
                  } else {
                    console.log("[Supabase] Détails livre mis à jour avec succès !");
                    setLastError(null);
                  }
                });
            } else {
              supabase.from("book_details")
                .insert([payload])
                .then(({ error: insertError }: any) => {
                  if (insertError) {
                    console.error("[Supabase] ÉCHEC insertion book_details (Vérifiez RLS) :", insertError);
                    setLastError(insertError.message || "RLS Blocked Insert");
                  } else {
                    console.log("[Supabase] Nouveaux détails livre insérés !");
                    setLastError(null);
                  }
                });
            }
          });
      }
      return next;
    });
  };

  const updateSiteImages = (images: Partial<typeof DEFAULT_SITE_IMAGES>) => {
    setSiteImagesState((prev: typeof DEFAULT_SITE_IMAGES) => {
      const next = { ...prev, ...images };

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("site_images")
          .select("id")
          .limit(1)
          .then(({ data, error: selectError }) => {
            if (selectError) {
              console.error("[Supabase] Erreur lecture site_images ID:", selectError);
              return;
            }
            const payload: any = {
              author_portrait: next.authorPortrait,
              book_cover: next.bookCover,
              financial_charts: next.financialCharts
            };
            if (hasDbFrontBack) {
              payload.book_cover_front = next.bookCoverFront;
              payload.book_cover_back = next.bookCoverBack;
            }
            
            if (data && data.length > 0) {
              supabase.from("site_images")
                .update(payload)
                .eq("id", data[0].id)
                .then(({ error: updateError }: any) => {
                  if (updateError) {
                    console.error("[Supabase] ÉCHEC de la sauvegarde de l'image (Vérifiez RLS !) :", updateError);
                    setLastError(updateError.message || "RLS Blocked Image Update");
                  } else {
                    console.log("[Supabase] Image sauvegardée en base de données avec succès !");
                    setLastError(null);
                  }
                });
            } else {
              supabase.from("site_images")
                .insert([payload])
                .then(({ error: insertError }: any) => {
                  if (insertError) {
                    console.error("[Supabase] ÉCHEC de la création de l'image (Vérifiez RLS !) :", insertError);
                    setLastError(insertError.message || "RLS Blocked Image Insert");
                  } else {
                    console.log("[Supabase] Nouvelle image insérée avec succès dans Supabase !");
                    setLastError(null);
                  }
                });
            }
          });
      }
      return next;
    });
  };

  const updateChapter = (id: string, updated: Partial<BookChapter>) => {
    setBookChaptersState((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      const target = next.find((c) => c.id === id);
      if (target && isSupabaseConfigured && supabase) {
        supabase
          .from("chapters")
          .upsert({
            id: target.id,
            number: target.number,
            title: target.title,
            description: target.description,
            highlights: target.highlights
          })
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la mise à jour du chapitre:", error);
              setLastError(error.message || "RLS Blocked Chapter Update");
            } else {
              setLastError(null);
            }
          });
      }
      return next;
    });
  };

  const addChapter = (chapter: Omit<BookChapter, "id">) => {
    const newId = `chap-${Date.now()}`;
    const newChapter = { ...chapter, id: newId };
    setBookChaptersState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("chapters")
          .insert([{
            id: newChapter.id,
            number: newChapter.number,
            title: newChapter.title,
            description: newChapter.description,
            highlights: newChapter.highlights
          }])
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la création du chapitre:", error);
              setLastError(error.message || "RLS Blocked Chapter Insert");
            } else {
              setLastError(null);
            }
          });
      }
      return [...prev, newChapter];
    });
  };

  const deleteChapter = (id: string) => {
    setBookChaptersState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("chapters")
          .delete()
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la suppression du chapitre:", error);
              setLastError(error.message || "RLS Blocked Chapter Delete");
            } else {
              setLastError(null);
            }
          });
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const updateBenefit = (id: string, updated: Partial<BookBenefit>) => {
    setBookBenefitsState((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updated } : b));
      const target = next.find((b) => b.id === id);
      if (target && isSupabaseConfigured && supabase) {
        supabase
          .from("benefits")
          .upsert({
            id: target.id,
            title: target.title,
            description: target.description,
            icon: target.icon
          })
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la mise à jour de l'avantage:", error);
              setLastError(error.message || "RLS Blocked Benefit Update");
            } else {
              setLastError(null);
            }
          });
      }
      return next;
    });
  };

  const addBenefit = (benefit: Omit<BookBenefit, "id">) => {
    const newId = `benefit-${Date.now()}`;
    const newBenefit = { ...benefit, id: newId };
    setBookBenefitsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("benefits")
          .insert([{
            id: newBenefit.id,
            title: newBenefit.title,
            description: newBenefit.description,
            icon: newBenefit.icon
          }])
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la création de l'avantage:", error);
              setLastError(error.message || "RLS Blocked Benefit Insert");
            } else {
              setLastError(null);
            }
          });
      }
      return [...prev, newBenefit];
    });
  };

  const deleteBenefit = (id: string) => {
    setBookBenefitsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("benefits")
          .delete()
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la suppression de l'avantage:", error);
              setLastError(error.message || "RLS Blocked Benefit Delete");
            } else {
              setLastError(null);
            }
          });
      }
      return prev.filter((b) => b.id !== id);
    });
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonialsState((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      const target = next.find((t) => t.id === id);
      if (target && isSupabaseConfigured && supabase) {
        supabase
          .from("testimonials")
          .upsert({
            id: target.id,
            name: target.name,
            role: target.role,
            company: target.company,
            content: target.content,
            avatar_url: target.avatarUrl,
            rating: target.rating
          })
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la mise à jour du témoignage:", error);
              setLastError(error.message || "RLS Blocked Testimonial Update");
            } else {
              setLastError(null);
            }
          });
      }
      return next;
    });
  };

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newId = `test-${Date.now()}`;
    const newTestimonial = { ...testimonial, id: newId };
    setTestimonialsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("testimonials")
          .insert([{
            id: newTestimonial.id,
            name: newTestimonial.name,
            role: newTestimonial.role,
            company: newTestimonial.company,
            content: newTestimonial.content,
            avatar_url: newTestimonial.avatarUrl,
            rating: newTestimonial.rating
          }])
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de l'ajout du témoignage:", error);
              setLastError(error.message || "RLS Blocked Testimonial Insert");
            } else {
              setLastError(null);
            }
          });
      }
      return [...prev, newTestimonial];
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonialsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("testimonials")
          .delete()
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la suppression du témoignage:", error);
              setLastError(error.message || "RLS Blocked Testimonial Delete");
            } else {
              setLastError(null);
            }
          });
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  const updateFaqItem = (id: string, updated: Partial<FAQItem>) => {
    setFaqItemsState((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updated } : f));
      const target = next.find((f) => f.id === id);
      if (target && isSupabaseConfigured && supabase) {
        supabase
          .from("faqs")
          .upsert({
            id: target.id,
            question: target.question,
            answer: target.answer
          })
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la mise à jour de la FAQ:", error);
              setLastError(error.message || "RLS Blocked FAQ Update");
            } else {
              setLastError(null);
            }
          });
      }
      return next;
    });
  };

  const addFaqItem = (item: Omit<FAQItem, "id">) => {
    const newId = `faq-${Date.now()}`;
    const newFaqItem = { ...item, id: newId };
    setFaqItemsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("faqs")
          .insert([{
            id: newFaqItem.id,
            question: newFaqItem.question,
            answer: newFaqItem.answer
          }])
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la création de la FAQ:", error);
              setLastError(error.message || "RLS Blocked FAQ Insert");
            } else {
              setLastError(null);
            }
          });
      }
      return [...prev, newFaqItem];
    });
  };

  const deleteFaqItem = (id: string) => {
    setFaqItemsState((prev) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from("faqs")
          .delete()
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) {
              console.error("[Supabase] Échec de la suppression de la FAQ:", error);
              setLastError(error.message || "RLS Blocked FAQ Delete");
            } else {
              setLastError(null);
            }
          });
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const resetToDefaults = async () => {
    setAuthorInfoState(DEFAULT_AUTHOR_INFO);
    setBookDetailsState(DEFAULT_BOOK_DETAILS);
    setBookChaptersState(DEFAULT_BOOK_CHAPTERS);
    setBookBenefitsState(DEFAULT_BOOK_BENEFITS);
    setTestimonialsState(DEFAULT_TESTIMONIALS);
    setFaqItemsState(DEFAULT_FAQ_ITEMS);
    setSiteImagesState(DEFAULT_SITE_IMAGES);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("chapters").delete().neq("id", "none");
        await supabase.from("chapters").insert(DEFAULT_BOOK_CHAPTERS.map(c => ({
          id: c.id,
          number: c.number,
          title: c.title,
          description: c.description,
          highlights: c.highlights
        })));

        await supabase.from("benefits").delete().neq("id", "none");
        await supabase.from("benefits").insert(DEFAULT_BOOK_BENEFITS.map(b => ({
          id: b.id,
          title: b.title,
          description: b.description,
          icon: b.icon
        })));

        await supabase.from("testimonials").delete().neq("id", "none");
        await supabase.from("testimonials").insert(DEFAULT_TESTIMONIALS.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          content: t.content,
          avatar_url: t.avatarUrl,
          rating: t.rating
        })));

        await supabase.from("faqs").delete().neq("id", "none");
        await supabase.from("faqs").insert(DEFAULT_FAQ_ITEMS.map(f => ({
          id: f.id,
          question: f.question,
          answer: f.answer
        })));

        const { data: authorData } = await supabase.from("author_info").select("id").limit(1);
        const authorPayload = {
          name: DEFAULT_AUTHOR_INFO.name,
          role: DEFAULT_AUTHOR_INFO.role,
          bio: DEFAULT_AUTHOR_INFO.bio,
          extended_bio: DEFAULT_AUTHOR_INFO.extendedBio,
          whatsapp_number: DEFAULT_AUTHOR_INFO.whatsappNumber,
          whatsapp_message: DEFAULT_AUTHOR_INFO.whatsappMessage,
          email: DEFAULT_AUTHOR_INFO.email
        };
        if (authorData && authorData.length > 0) {
          await supabase.from("author_info").update(authorPayload).eq("id", authorData[0].id);
        }

        const { data: bookData } = await supabase.from("book_details").select("id").limit(1);
        const bookPayload = {
          title: DEFAULT_BOOK_DETAILS.title,
          subtitle: DEFAULT_BOOK_DETAILS.subtitle,
          price_paper: 35,
          original_price_paper: 45,
          pages: DEFAULT_BOOK_DETAILS.pages,
          language: DEFAULT_BOOK_DETAILS.language,
          format: DEFAULT_BOOK_DETAILS.format,
          release_year: DEFAULT_BOOK_DETAILS.releaseYear
        };
        if (bookData && bookData.length > 0) {
          await supabase.from("book_details").update(bookPayload).eq("id", bookData[0].id);
        }

        const { data: imagesData } = await supabase.from("site_images").select("id").limit(1);
        const imagesPayload: any = {
          author_portrait: DEFAULT_SITE_IMAGES.authorPortrait,
          book_cover: DEFAULT_SITE_IMAGES.bookCover,
          financial_charts: DEFAULT_SITE_IMAGES.financialCharts
        };
        if (hasDbFrontBack) {
          imagesPayload.book_cover_front = DEFAULT_SITE_IMAGES.bookCoverFront;
          imagesPayload.book_cover_back = DEFAULT_SITE_IMAGES.bookCoverBack;
        }
        if (imagesData && imagesData.length > 0) {
          await supabase.from("site_images").update(imagesPayload).eq("id", imagesData[0].id);
        }
      } catch (err) {
        console.error("Error resetting Supabase to defaults:", err);
      }
    }
  };

  return (
    <SiteContext.Provider
      value={{
        authorInfo,
        bookDetails,
        bookChapters,
        bookBenefits,
        testimonials,
        faqItems,
        siteImages,
        isSupabaseReady,
        hasDbFrontBack,
        lastError,
        clearLastError,
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
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
