export interface Category {
  name: string;
  slug: string;
}

export interface Image {
  url: string;
  alternativeText: string;
  width?: number;
  height?: number;
}

export interface DynamicZoneComponent {
  __component: string;
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

export interface Seo {
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  metaRobots?: string;
  structuredData?: Record<string, unknown>;
  metaViewport?: string;
  canonicalURL?: string;
  metaImage?: Image;
}

export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  dynamic_zone: DynamicZoneComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
  seo?: Seo;
}

export interface Perk {
  text: string;
}

export interface Plan {
  name: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: Plan[];
  perks: Perk[];
  featured?: boolean;
  images: StrapiImage[];
  categories?: Category[];
}

export interface PortfolioSkill {
  name: string;
}

export interface PortfolioSocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface AskPromptChip {
  id?: number;
  text: string;
}

export interface AskHeroBlock {
  __component: 'dynamic-zone.ask-hero';
  id: number;
  eyebrow?: string;
  heading?: string;
  sub_heading?: string;
  input_placeholder?: string;
  submit_label?: string;
  suggestions?: AskPromptChip[];
  questionnaire_label?: string;
  questionnaire_url?: string;
  projects_link_label?: string;
  projects_link_url?: string;
}

export interface AiGatewayLink {
  id?: number;
  text?: string;
  URL?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface AiGatewayBlock {
  __component: 'dynamic-zone.ai-gateway';
  id: number;
  heading?: string;
  sub_heading?: string;
  primary_cta_label?: string;
  action_links?: AiGatewayLink[];
}

export interface PortfolioParagraph {
  text: string;
}

export interface Portfolio {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  slug: string;
  type: 'project' | 'side-project';
  tag?: string;
  link?: string;
  link_text?: string;
  technologies: PortfolioSkill[];
  card_image?: StrapiImage;
  featured?: boolean;
  locale: string;
  localizations?: any[];
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    small: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    medium: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    large: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
