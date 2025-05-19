export interface SeoMeta {
  id?: number;
  page_name:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website"
    | "about"
    | "terms"
    | "privacy"
    | "contact"
    | "blog";

  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;

  canonicalUrl?: string;
  robots?:
    | "index, follow"
    | "noindex, nofollow"
    | "index, nofollow"
    | "noindex, follow";

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schema?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  structuredData?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
