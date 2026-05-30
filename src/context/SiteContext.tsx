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

  // Keep localStorage sync when states change
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
    setAuthorInfoState((prev: typeof DEFAULT_AUTHOR_INFO) => ({ ...prev, ...info }));
  };

  const updateBookDetails = (details: Partial<typeof DEFAULT_BOOK_DETAILS>) => {
    setBookDetailsState((prev: typeof DEFAULT_BOOK_DETAILS) => ({ ...prev, ...details }));
  };

  const updateSiteImages = (images: Partial<typeof DEFAULT_SITE_IMAGES>) => {
    setSiteImagesState((prev: typeof DEFAULT_SITE_IMAGES) => ({ ...prev, ...images }));
  };

  const updateChapter = (id: string, updated: Partial<BookChapter>) => {
    setBookChaptersState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const addChapter = (chapter: Omit<BookChapter, "id">) => {
    setBookChaptersState((prev) => [
      ...prev,
      { ...chapter, id: `chap-${Date.now()}` }
    ]);
  };

  const deleteChapter = (id: string) => {
    setBookChaptersState((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBenefit = (id: string, updated: Partial<BookBenefit>) => {
    setBookBenefitsState((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
  };

  const addBenefit = (benefit: Omit<BookBenefit, "id">) => {
    setBookBenefitsState((prev) => [
      ...prev,
      { ...benefit, id: `benefit-${Date.now()}` }
    ]);
  };

  const deleteBenefit = (id: string) => {
    setBookBenefitsState((prev) => prev.filter((b) => b.id !== id));
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonialsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    setTestimonialsState((prev) => [
      ...prev,
      { ...testimonial, id: `test-${Date.now()}` }
    ]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonialsState((prev) => prev.filter((t) => t.id !== id));
  };

  const updateFaqItem = (id: string, updated: Partial<FAQItem>) => {
    setFaqItemsState((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  };

  const addFaqItem = (item: Omit<FAQItem, "id">) => {
    setFaqItemsState((prev) => [
      ...prev,
      { ...item, id: `faq-${Date.now()}` }
    ]);
  };

  const deleteFaqItem = (id: string) => {
    setFaqItemsState((prev) => prev.filter((f) => f.id !== id));
  };

  const resetToDefaults = () => {
    setAuthorInfoState(DEFAULT_AUTHOR_INFO);
    setBookDetailsState(DEFAULT_BOOK_DETAILS);
    setBookChaptersState(DEFAULT_BOOK_CHAPTERS);
    setBookBenefitsState(DEFAULT_BOOK_BENEFITS);
    setTestimonialsState(DEFAULT_TESTIMONIALS);
    setFaqItemsState(DEFAULT_FAQ_ITEMS);
    setSiteImagesState(DEFAULT_SITE_IMAGES);
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
