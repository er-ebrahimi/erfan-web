import { Camera, Sparkles } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { toButtonVariant } from '@/components/landing/button-variant';
import { iconFor } from '@/components/landing/icons';
import { resolveMedia } from '@/components/landing/media';

describe('landing helpers', () => {
  it('keeps local media paths untouched', () => {
    expect(resolveMedia('/questioner/1/classic.jpg', 'کلاسیک')).toEqual({
      src: '/questioner/1/classic.jpg',
      alt: 'کلاسیک',
    });
  });

  it('resolves a Strapi media object with its alt text', () => {
    expect(
      resolveMedia(
        {
          url: '/uploads/room.webp',
          width: 1200,
          height: 800,
          alternativeText: 'اتاق نشیمن',
        },
        'fallback'
      )
    ).toEqual({ src: '/uploads/room.webp', alt: 'اتاق نشیمن' });
  });

  it('returns null for empty media', () => {
    expect(resolveMedia(null)).toBeNull();
    expect(resolveMedia({ url: null })).toBeNull();
  });

  it('maps Strapi button variants to shadcn variants', () => {
    expect(toButtonVariant('primary')).toBe('default');
    expect(toButtonVariant('outline')).toBe('outline');
    expect(toButtonVariant('muted')).toBe('secondary');
    expect(toButtonVariant('simple')).toBe('ghost');
    expect(toButtonVariant(null)).toBe('default');
  });

  it('maps icon enums and falls back safely', () => {
    expect(iconFor('camera')).toBe(Camera);
    expect(iconFor('not-an-icon')).toBe(Sparkles);
    expect(iconFor(null)).toBe(Sparkles);
  });
});
