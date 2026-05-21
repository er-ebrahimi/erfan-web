import type { Schema, Struct } from '@strapi/strapi';

export interface CardsGlobeCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_globe_cards';
  info: {
    description: '';
    displayName: 'Globe_Card';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
  };
}

export interface CardsGraphCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_graph_cards';
  info: {
    description: '';
    displayName: 'Graph_Card';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.String;
    highlighted_text: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
    top_items: Schema.Attribute.Component<'items.graph-card-top-items', true>;
  };
}

export interface CardsMember extends Struct.ComponentSchema {
  collectionName: 'components_cards_members';
  info: {
    description: '';
    displayName: 'Member';
    icon: 'user';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Positions: Schema.Attribute.Component<'items.text', true>;
    Profile: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface CardsRayCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_ray_cards';
  info: {
    description: '';
    displayName: 'Ray_Card';
    icon: 'dashboard';
  };
  attributes: {
    after_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    before_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    description: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    title: Schema.Attribute.String;
  };
}

export interface CardsSocialMediaCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_social_media_cards';
  info: {
    description: '';
    displayName: 'Social_Media_Card';
    icon: 'dashboard';
  };
  attributes: {
    Description: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneBrands extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_brands';
  info: {
    description: '';
    displayName: 'Brands';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneCons extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_cons';
  info: {
    description: '';
    displayName: 'Cons';
    icon: 'fileError';
  };
  attributes: {
    Cons: Schema.Attribute.Component<'shared.cons', true>;
    Description: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneContact extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_contacts';
  info: {
    displayName: 'Contact';
    icon: 'command';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneCta extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_ctas';
  info: {
    description: '';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    CTAs: Schema.Attribute.Component<'shared.button', true>;
  };
}

export interface DynamicZoneFaq extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFeatures extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_features';
  info: {
    description: '';
    displayName: 'Features';
    icon: 'bulletList';
  };
  attributes: {
    globe_card: Schema.Attribute.Component<'cards.globe-card', false>;
    graph_card: Schema.Attribute.Component<'cards.graph-card', false>;
    heading: Schema.Attribute.String;
    ray_card: Schema.Attribute.Component<'cards.ray-card', false>;
    social_media_card: Schema.Attribute.Component<
      'cards.social-media-card',
      false
    >;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFormNextToSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_form_next_to_sections';
  info: {
    description: '';
    displayName: 'Form_Next_To_Section';
    icon: 'book';
  };
  attributes: {
    form: Schema.Attribute.Component<'shared.form', false>;
    heading: Schema.Attribute.String;
    section: Schema.Attribute.Component<'shared.section', false>;
    social_media_icon_links: Schema.Attribute.Component<
      'shared.social-media-icon-links',
      true
    >;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneGuide extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_guides';
  info: {
    displayName: 'Guide';
    icon: 'heart';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Profile: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneHero extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    Background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    CTAs: Schema.Attribute.Component<'shared.button', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneHeroPicture extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_hero_pictures';
  info: {
    displayName: 'Hero Picture';
    icon: 'picture';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    CTAs: Schema.Attribute.Component<'shared.button', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_how_it_works';
  info: {
    description: '';
    displayName: 'How_It_Works';
    icon: 'question';
  };
  attributes: {
    heading: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'shared.steps', true>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneLaunches extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_launches';
  info: {
    description: '';
    displayName: 'Launches';
    icon: 'rocket';
  };
  attributes: {
    heading: Schema.Attribute.String;
    launches: Schema.Attribute.Component<'shared.launches', true>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneMedia extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_media';
  info: {
    displayName: 'Media';
    icon: 'television';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface DynamicZonePlans extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_plans';
  info: {
    description: '';
    displayName: 'Plans';
    icon: 'oneToOne';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Plan: Schema.Attribute.Component<'shared.plan', true>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZonePricing extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_pricings';
  info: {
    description: '';
    displayName: 'Pricing';
    icon: 'shoppingCart';
  };
  attributes: {
    heading: Schema.Attribute.String;
    plans: Schema.Attribute.Relation<'oneToMany', 'api::plan.plan'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneProjectPictures extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_project_pictures';
  info: {
    description: '';
    displayName: 'Project Pictures';
    icon: 'eye';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Pics: Schema.Attribute.Component<'shared.porject-picture', true>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZonePromisedLand extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_promised_lands';
  info: {
    description: '';
    displayName: 'Promised Land';
    icon: 'crown';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Promise: Schema.Attribute.Component<'shared.promise', true>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_articles';
  info: {
    description: '';
    displayName: 'related_articles';
    icon: 'bulletList';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneRelatedProducts extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_products';
  info: {
    displayName: 'Related_Products';
    icon: 'stack';
  };
  attributes: {
    heading: Schema.Attribute.String;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneTeamMembers extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_team_members';
  info: {
    description: '';
    displayName: 'Team Members';
    icon: 'gate';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Member: Schema.Attribute.Component<'cards.member', true>;
    Title: Schema.Attribute.String;
  };
}

export interface DynamicZoneTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_testimonials';
  info: {
    description: '';
    displayName: 'Testimonials';
    icon: 'emotionHappy';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
  };
}

export interface GlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_global_footers';
  info: {
    description: '';
    displayName: 'Footer';
    icon: 'apps';
  };
  attributes: {
    built_with: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    designed_developed_by: Schema.Attribute.String;
    internal_links: Schema.Attribute.Component<'shared.link', true>;
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    policy_links: Schema.Attribute.Component<'shared.link', true>;
    social_media_links: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface GlobalLocal extends Struct.ComponentSchema {
  collectionName: 'components_global_locals';
  info: {
    displayName: 'Local';
    icon: 'bold';
  };
  attributes: {
    code: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface GlobalNavbar extends Struct.ComponentSchema {
  collectionName: 'components_global_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'bold';
  };
  attributes: {
    language: Schema.Attribute.Boolean;
    left_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    right_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    theme: Schema.Attribute.Boolean;
  };
}

export interface ItemsGraphCardTopItems extends Struct.ComponentSchema {
  collectionName: 'components_items_graph_card_top_items';
  info: {
    displayName: 'Graph_Card_Top_Items';
    icon: 'bulletList';
  };
  attributes: {
    number: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface ItemsInput extends Struct.ComponentSchema {
  collectionName: 'components_items_inputs';
  info: {
    description: '';
    displayName: 'Input';
    icon: 'apps';
  };
  attributes: {
    name: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'email',
        'password',
        'submit',
        'textarea',
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'radio',
        'range',
        'reset',
        'search',
        'tel',
        'time',
        'url',
        'week',
      ]
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface ItemsLeftNavbarItems extends Struct.ComponentSchema {
  collectionName: 'components_items_left_navbar_items';
  info: {
    displayName: 'Left_Navbar_Items';
    icon: 'bulletList';
  };
  attributes: {
    name: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface ItemsRayItems extends Struct.ComponentSchema {
  collectionName: 'components_items_ray_items';
  info: {
    description: '';
    displayName: 'Ray_Card_Items';
    icon: 'bulletList';
  };
  attributes: {
    item_1: Schema.Attribute.String;
    item_2: Schema.Attribute.String;
    item_3: Schema.Attribute.String;
  };
}

export interface ItemsText extends Struct.ComponentSchema {
  collectionName: 'components_items_texts';
  info: {
    displayName: 'Text';
    icon: 'file';
  };
  attributes: {
    Position: Schema.Attribute.String;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['simple', 'outline', 'primary', 'muted']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedCons extends Struct.ComponentSchema {
  collectionName: 'components_shared_cons';
  info: {
    displayName: 'Cons';
    icon: 'fileError';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SharedContent extends Struct.ComponentSchema {
  collectionName: 'components_shared_contents';
  info: {
    displayName: 'content';
    icon: 'apps';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
  };
}

export interface SharedForm extends Struct.ComponentSchema {
  collectionName: 'components_shared_forms';
  info: {
    description: '';
    displayName: 'Form';
    icon: 'paperPlane';
  };
  attributes: {
    inputs: Schema.Attribute.Component<'items.input', true>;
  };
}

export interface SharedLaunches extends Struct.ComponentSchema {
  collectionName: 'components_shared_launches';
  info: {
    description: '';
    displayName: 'Launches';
    icon: 'rocket';
  };
  attributes: {
    Buttons: Schema.Attribute.Component<'shared.button', true>;
    description: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    mission_number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.button', true>;
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedPerks extends Struct.ComponentSchema {
  collectionName: 'components_shared_perks';
  info: {
    description: '';
    displayName: 'Perks';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedPlan extends Struct.ComponentSchema {
  collectionName: 'components_shared_plans';
  info: {
    description: '';
    displayName: 'Plan';
    icon: 'connector';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Pictures: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface SharedPorjectPicture extends Struct.ComponentSchema {
  collectionName: 'components_shared_porject_pictures';
  info: {
    description: '';
    displayName: 'Porject Picture';
    icon: 'expand';
  };
  attributes: {
    ClassName: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Name: Schema.Attribute.String;
    Right: Schema.Attribute.String;
    Rotate: Schema.Attribute.String;
    Top: Schema.Attribute.String;
  };
}

export interface SharedProjectPictures extends Struct.ComponentSchema {
  collectionName: 'components_shared_project_pictures';
  info: {
    displayName: 'Porject Picture';
    icon: 'chartCircle';
  };
  attributes: {
    ClassName: Schema.Attribute.String;
    Image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Name: Schema.Attribute.String;
    Right: Schema.Attribute.String;
    Rotate: Schema.Attribute.String;
    Top: Schema.Attribute.String;
  };
}

export interface SharedPromise extends Struct.ComponentSchema {
  collectionName: 'components_shared_promises';
  info: {
    description: '';
    displayName: 'Promise';
    icon: 'cup';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Link: Schema.Attribute.String;
    Pic: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    SubSubtile: Schema.Attribute.String;
    Subtitle: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
    icon: 'cursor';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    users: Schema.Attribute.Component<'shared.user', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSocialMediaIconLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_media_icon_links';
  info: {
    description: '';
    displayName: 'Social_Media_Icon_Links';
    icon: 'expand';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedSteps extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    description: '';
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedUser extends Struct.ComponentSchema {
  collectionName: 'components_shared_users';
  info: {
    description: '';
    displayName: 'User';
    icon: 'user';
  };
  attributes: {
    firstname: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    job: Schema.Attribute.String;
    lastname: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cards.globe-card': CardsGlobeCard;
      'cards.graph-card': CardsGraphCard;
      'cards.member': CardsMember;
      'cards.ray-card': CardsRayCard;
      'cards.social-media-card': CardsSocialMediaCard;
      'dynamic-zone.brands': DynamicZoneBrands;
      'dynamic-zone.cons': DynamicZoneCons;
      'dynamic-zone.contact': DynamicZoneContact;
      'dynamic-zone.cta': DynamicZoneCta;
      'dynamic-zone.faq': DynamicZoneFaq;
      'dynamic-zone.features': DynamicZoneFeatures;
      'dynamic-zone.form-next-to-section': DynamicZoneFormNextToSection;
      'dynamic-zone.guide': DynamicZoneGuide;
      'dynamic-zone.hero': DynamicZoneHero;
      'dynamic-zone.hero-picture': DynamicZoneHeroPicture;
      'dynamic-zone.how-it-works': DynamicZoneHowItWorks;
      'dynamic-zone.launches': DynamicZoneLaunches;
      'dynamic-zone.media': DynamicZoneMedia;
      'dynamic-zone.plans': DynamicZonePlans;
      'dynamic-zone.pricing': DynamicZonePricing;
      'dynamic-zone.project-pictures': DynamicZoneProjectPictures;
      'dynamic-zone.promised-land': DynamicZonePromisedLand;
      'dynamic-zone.related-articles': DynamicZoneRelatedArticles;
      'dynamic-zone.related-products': DynamicZoneRelatedProducts;
      'dynamic-zone.team-members': DynamicZoneTeamMembers;
      'dynamic-zone.testimonials': DynamicZoneTestimonials;
      'global.footer': GlobalFooter;
      'global.local': GlobalLocal;
      'global.navbar': GlobalNavbar;
      'items.graph-card-top-items': ItemsGraphCardTopItems;
      'items.input': ItemsInput;
      'items.left-navbar-items': ItemsLeftNavbarItems;
      'items.ray-items': ItemsRayItems;
      'items.text': ItemsText;
      'shared.button': SharedButton;
      'shared.cons': SharedCons;
      'shared.content': SharedContent;
      'shared.form': SharedForm;
      'shared.launches': SharedLaunches;
      'shared.link': SharedLink;
      'shared.perks': SharedPerks;
      'shared.plan': SharedPlan;
      'shared.porject-picture': SharedPorjectPicture;
      'shared.project-pictures': SharedProjectPictures;
      'shared.promise': SharedPromise;
      'shared.section': SharedSection;
      'shared.seo': SharedSeo;
      'shared.social-media-icon-links': SharedSocialMediaIconLinks;
      'shared.steps': SharedSteps;
      'shared.user': SharedUser;
    }
  }
}
