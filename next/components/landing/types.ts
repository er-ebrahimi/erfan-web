export type LandingMedia =
  | string
  | {
      url?: string | null;
      alternativeText?: string | null;
      width?: number;
      height?: number;
      formats?: Record<string, unknown>;
    }
  | null
  | undefined;

export type LandingCTA = {
  id?: string | number;
  text?: string | null;
  URL?: string | null;
  variant?: string | null;
};

export type LandingWord = {
  id?: string | number;
  text?: string | null;
};

export type LandingBenefit = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  url?: string | null;
};

export type LandingStep = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export type LandingGalleryItem = {
  id?: string | number;
  title?: string | null;
  alt?: string | null;
  image?: LandingMedia;
};

export type LandingStat = {
  id?: string | number;
  value?: number | null;
  suffix?: string | null;
  label?: string | null;
};

export type LandingChatCard = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  user_message?: string | null;
  ai_message?: string | null;
};

export type LandingImageCard = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  prompt?: string | null;
  status?: string | null;
  image?: LandingMedia;
};

export type LandingQuizCard = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  question?: string | null;
  option_a?: string | null;
  option_b?: string | null;
};

export type LandingHeroProps = {
  heading_line_1?: string | null;
  heading_highlight?: string | null;
  rotating_words?: LandingWord[] | null;
  sub_heading?: string | null;
  CTAs?: LandingCTA[] | null;
  image?: LandingMedia;
  chat_label?: string | null;
  chat_message?: string | null;
  locale: string;
};

export type LandingBenefitsProps = {
  heading?: string | null;
  sub_heading?: string | null;
  items?: LandingBenefit[] | null;
  locale: string;
};

export type LandingHowItWorksProps = {
  heading?: string | null;
  sub_heading?: string | null;
  steps?: LandingStep[] | null;
  locale: string;
};

export type LandingGalleryProps = {
  heading?: string | null;
  sub_heading?: string | null;
  items?: LandingGalleryItem[] | null;
  locale: string;
};

export type LandingShowcaseProps = {
  heading?: string | null;
  sub_heading?: string | null;
  chat_card?: LandingChatCard | null;
  image_card?: LandingImageCard | null;
  quiz_card?: LandingQuizCard | null;
  locale: string;
};

export type LandingStatsProps = {
  items?: LandingStat[] | null;
  locale: string;
};

export type LandingCtaProps = {
  heading?: string | null;
  sub_heading?: string | null;
  CTAs?: LandingCTA[] | null;
  locale: string;
};
