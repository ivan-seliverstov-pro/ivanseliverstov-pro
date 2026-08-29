import rawContent from "@/public/content.json";

// --- TYPES ---
export interface ClientItem {
  name: string;
  logo: string;
  alt: string;
  height: number;
  mobileHeight?: number;
}

export interface SkillItem {
  title: string;
  description: string;
}

export interface WorkStepItem {
  number: string;
  title: string;
  description: string;
}

export interface ProjectCase {
  id: string;
  title: string;
  image: string;
  alt: string;
  tags: string[];
  description: string[];
  highlight?: string;
}

export interface GridItem {
  title: string;
  image: string;
  alt: string;
  description: string;
  projectId?: string;
}

export interface ProjectCategory {
  id: string;
  title: string;
  items: GridItem[];
}

export interface ContactLink {
  type: "email" | "vk" | "tg" | "phone";
  value: string;
}

export interface Reviewer {
  id: string;
  name: string;
  role: string;
  image: string;
  alt: string;
  review: string;
  contacts: ContactLink[];
}

export interface GratitudeItem {
  src: string;
  thumb?: string;
  alt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  vimeoLink?: {
    text: string;
    url: string;
  };
}

export interface SiteContent {
  siteMetadata: typeof rawContent.siteMetadata;
  heroData: {
    name: string;
    tagline: string;
    bioParagraphs: string[];
    portrait: string;
    alt: string;
    stats: { value: string; label: string }[];
  };
  skillsData: {
    sectionTitle: string;
    subtitle: string;
    skillsList: SkillItem[];
    bookshelfImage: string;
    bookshelfAlt: string;
    workStepsTitle: string;
    workSteps: WorkStepItem[];
    beforeAfter: {
      before: string;
      after: string;
    };
  };
  clientsData: ClientItem[];
  projectsCasesData: ProjectCase[];
  projectsCategoriesData: ProjectCategory[];
  reviewersData: Reviewer[];
  gratitudeImagesData: GratitudeItem[];
  questionsData: FAQItem[];
}

// Export typed data
export const content: SiteContent = rawContent as SiteContent;

export const siteMetadata = content.siteMetadata;
export const heroData = content.heroData;
export const skillsData = content.skillsData;
export const clientsData = content.clientsData;
export const projectsCasesData = content.projectsCasesData;
export const projectsCategoriesData = content.projectsCategoriesData;
export const reviewersData = content.reviewersData;
export const gratitudeImagesData = content.gratitudeImagesData;
export const questionsData = content.questionsData;
