/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookBenefit {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon reference string
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  rating: number; // For gold stars out of 5
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BookChapter {
  id: string;
  number: string;
  title: string;
  description: string;
  highlights: string[];
}
