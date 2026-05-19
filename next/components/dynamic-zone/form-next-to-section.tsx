'use client';

import ContactUs from './contact-us';
import ShootingStars from '@/components/decorations/shooting-star';
import StarBackground from '@/components/decorations/star-background';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  social_media_icon_links,
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_media_icon_links: any;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <div className="relative z-20 w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <ContactUs Title={heading} Description={sub_heading} />
      </div>
      <div className="relative w-full z-20 hidden md:flex border-l border-border overflow-hidden bg-muted items-center justify-center">
        <StarBackground />
        <ShootingStars />
        <div className="max-w-sm mx-auto">
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={section.users} />
          </div>
          <p
            className={
              'font-semibold text-xl text-center text-muted-foreground text-balance'
            }
          >
            {section.heading}
          </p>
          <p
            className={
              'font-normal text-base text-center text-muted-foreground mt-8 text-balance'
            }
          >
            {section.sub_heading}
          </p>
        </div>
      </div>
    </div>
  );
}
