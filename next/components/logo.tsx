import { Link } from 'next-view-transitions';

import { BlurImage } from './blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Logo = ({ image, locale }: { image?: Image; locale?: string }) => {
  if (image) {
    return (
      <Link
        href={`/${locale || 'fa'}`}
        className="font-normal flex space-x-2 items-center text-sm mr-4  text-black   relative z-20"
      >
        <BlurImage
          src={strapiImage(image?.url)}
          alt={image.alternativeText}
          width={image.width || 200}
          height={image.height || 200}
          className="h-10 w-auto rounded-xl mr-2 object-contain"
        />

        <span className="text-white font-bold">Painfools</span>
      </Link>
    );
  }

  return;
};
