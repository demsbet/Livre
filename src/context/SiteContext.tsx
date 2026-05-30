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
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface SiteContextType {
  authorInfo: typeof DEFAULT_AUTHOR_INFO;
  bookDetails: typeof DEFAULT_BOOK_DETAILS;
  bookChapters: BookChapter[];
  bookBenefits: BookBenefit[];
  testimonials: Testimonial[];
  faqItems: FAQItem[];
  siteImages: typeof DEFAULT_SITE_IMAGES;
  
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
        return parsed;
      }
      return DEFAULT_SITE_IMAGES;
    } catch {
      return DEFAULT_SITE_IMAGES;
    }
  });

  // Load live data from Supabase on startup
  useEffect(() => {
    const fetchAllLiveSiteData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        console.log("Supabase is not configured yet. Using offline local/fallback storage.");
        return;
      }
      try {
        // 1. Fetch Author Info
        const { data: authorData, error: authorError } = await supabase
          .from("author_info")
          .select("*")
          .limit(1);
        
        if (!authorError && authorData && authorData.length > 0) {
          const row = authorData[0];
          setAuthorInfoState({
            name: row.name,
            role: row.role,
            bio: row.bio,
            extendedBio: row.extended_bio,
            whatsappNumber: row.whatsapp_number,
            whatsappMessage: row.whatsapp_message,
            email: row.email,
          });
        }

        // 2. Fetch Book Details
        const { data: bookData, error: bookError } = await supabase
          .from("book_details")
          .select("*")
          .limit(1);

        if (!bookError && bookData && bookData.length > 0) {
          const row = bookData[0];
          setBookDetailsState({
            title: row.title,
            subtitle: row.subtitle,
            pricePaper: row.price_paper ? `${Math.round(row.price_paper)} €` : "35 €",
            originalPricePaper: row.original_price_paper ? `${Math.round(row.original_price_paper)} €` : "45 €",
            pages: row.pages,
            language: row.language,
            format: row.format,
            releaseYear: row.release_year,
          });
        }

        // 3. Fetch Book Chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("*")
          .order("number", { ascending: true });

        if (!chaptersError && chaptersData && chaptersData.length > 0) {
          setBookChaptersState(chaptersData.map((row: any) => ({
            id: row.id,
            number: row.number,
            title: row.title,
            description: row.description,
            highlights: row.highlights || []
          })));
        }

        // 4. Fetch Benefits
        const { data: benefitsData, error: benefitsError } = await supabase
          .from("benefits")
          .select("*")
          .order("id", { ascending: true });

        if (!benefitsError && benefitsData && benefitsData.length > 0) {
          setBookBenefitsState(benefitsData.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            icon: row.icon
          })));
        }

        // 5. Fetch Testimonials
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from("testimonials")
          .select("*")
          .order("id", { ascending: true });

        if (!testimonialsError && testimonialsData && testimonialsData.length > 0) {
          setTestimonialsState(testimonialsData.map((row: any) => ({
            id: row.id,
            name: row.name,
            role: row.role,
            company: row.company,
            content: row.content,
            avatarUrl: row.avatar_url,
            rating: row.rating
          })));
        }

        // 6. Fetch FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from("faqs")
          .select("*")
          .order("id", { ascending: true });

        if (!faqsError && faqsData && faqsData.length > 0) {
          setFaqItemsState(faqsData.map((row: any) => ({
            id: row.id,
            question: row.question,
            answer: row.answer
          })));
        }

        // 7. Fetch Site Images
        const { data: imagesData, error: imagesError } = await supabase
          .from("site_images")
          .select("*")
          .limit(1);

        if (!imagesError && imagesData && imagesData.length > 0) {
          const row = imagesData[0];
          setSiteImagesState({
            authorPortrait: row.author_portrait,
            bookCover: row.book_cover,
            financialCharts: row.financial_charts
          });
        }
      } catch (err) {
        console.error("Exception while fetching live Supabase data:", err);
      }
    };

    fetchAllLiveSiteData();
  }, []);

  // Keep localStorage backup ONLY when Supabase is not configured to avoid local edits conflicts
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_author_info", JSON.stringify(authorInfo));
    }
  }, [authorInfo]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_book_details", JSON.stringify(bookDetails));
    }
  }, [bookDetails]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_book_chapters", JSON.stringify(bookChapters));
    }
  }, [bookChapters]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_book_benefits", JSON.stringify(bookBenefits));
    }
  }, [bookBenefits]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_testimonials", JSON.stringify(testimonials));
    }
  }, [testimonials]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_faq_items", JSON.stringify(faqItems));
    }
  }, [faqItems]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem("site_site_images", JSON.stringify(siteImages));
    }
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
          .then(({ data }) => {
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
              supabase.from("author_info").update(payload).eq("id", data[0].id).then();
            } else {
              supabase.from("author_info").insert([payload]).then();
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
          .then(({ data }) => {
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
              supabase.from("book_details").update(payload).eq("id", data[0].id).then();
            } else {
              supabase.from("book_details").insert([payload]).then();
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
          .then(({ data }) => {
            const payload = {
              author_portrait: next.authorPortrait,
              book_cover: next.bookCover,
              financial_charts: next.financialCharts
            };
            
            if (data && data.length > 0) {
              supabase.from("site_images").update(payload).eq("id", data[0].id).then();
            } else {
              supabase.from("site_images").insert([payload]).then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
          .then();
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
        const imagesPayload = {
          author_portrait: DEFAULT_SITE_IMAGES.authorPortrait,
          book_cover: DEFAULT_SITE_IMAGES.bookCover,
          financial_charts: DEFAULT_SITE_IMAGES.financialCharts
        };
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
