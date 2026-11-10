import {
  demoBenefits,
  demoCta,
  demoGallery,
  demoHero,
  demoHowItWorks,
  demoShowcase,
  demoStats,
} from './demo-data';
import { LandingBenefits } from './sections/benefits';
import { LandingCta } from './sections/cta';
import { LandingGallery } from './sections/gallery';
import { LandingHero } from './sections/hero';
import { LandingHowItWorks } from './sections/how-it-works';
import { LandingShowcase } from './sections/showcase';
import { LandingStats } from './sections/stats';

/**
 * Hardcoded Kodom Tech landing preview. Swapped for `PageContent` as soon as
 * a Strapi page with slug `landing-preview` exists.
 */
export function LandingPreview() {
  return (
    <div className="relative overflow-x-clip">
      <LandingHero {...demoHero} />
      <LandingBenefits {...demoBenefits} />
      <LandingHowItWorks {...demoHowItWorks} />
      <LandingGallery {...demoGallery} />
      <LandingShowcase {...demoShowcase} />
      <LandingStats {...demoStats} />
      <LandingCta {...demoCta} />
    </div>
  );
}
