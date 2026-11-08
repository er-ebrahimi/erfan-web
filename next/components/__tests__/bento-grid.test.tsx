import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { BentoGrid } from '../dynamic-zone/bento-grid';

const makeFormat = (
  name: string,
  suffix: string,
  width: number,
  height: number
) => ({
  name: `${name}-image-${suffix}`,
  hash: `${name}_image_${suffix}`,
  ext: '.webp',
  mime: 'image/webp',
  path: null,
  width,
  height,
  size: 100,
  sizeInBytes: 100,
  url: `/uploads/${name}_image_${suffix}.webp`,
});

const makeImage = (suffix: string, alternativeText: string | null) => ({
  id: Number(suffix),
  documentId: `doc-${suffix}`,
  name: `image-${suffix}`,
  alternativeText,
  caption: null,
  width: 1600,
  height: 1200,
  formats: {
    thumbnail: makeFormat('thumbnail', suffix, 245, 156),
    small: makeFormat('small', suffix, 500, 500),
    medium: makeFormat('medium', suffix, 750, 750),
    large: makeFormat('large', suffix, 1000, 750),
  },
  hash: `image_${suffix}`,
  ext: '.webp',
  mime: 'image/webp',
  size: 200,
  url: `/uploads/image_${suffix}.webp`,
  previewUrl: null,
  provider: 'local',
  provider_metadata: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-01T00:00:00.000Z',
});

const tiles = [
  { id: 1, Image: makeImage('1', 'آشپزخانه سفید'), Size: 'lead' as const },
  { id: 2, Image: makeImage('2', 'دیوار چوبی'), Size: 'wide' as const },
  { id: 3, Image: makeImage('3', null), Size: 'tall' as const },
  { id: 4, Image: makeImage('4', 'نشیمن'), Size: 'square' as const },
];

const baseProps = {
  heading: 'پروژه‌های منتخب',
  sub_heading: 'گزیده‌ای از کارهای استودیو آرمان',
  CTAs: [{ id: 'cta-1', text: 'رزرو تماس', URL: '/contact' }],
  tiles,
  locale: 'fa',
};

/** Each tile holds exactly one image, so the tile is the image's parent. */
const tileCells = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('img')).map(
    (img) => img.parentElement as HTMLElement
  );

describe('BentoGrid', () => {
  it('renders the heading as a level-2 heading and the subheading', () => {
    render(<BentoGrid {...baseProps} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'پروژه‌های منتخب' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('گزیده‌ای از کارهای استودیو آرمان')
    ).toBeInTheDocument();
  });

  it('localises CTA hrefs for the current locale', () => {
    render(<BentoGrid {...baseProps} />);

    expect(screen.getByRole('link', { name: 'رزرو تماس' })).toHaveAttribute(
      'href',
      '/fa/contact'
    );
  });

  it('maps each size preset onto the right grid span', () => {
    const { container } = render(<BentoGrid {...baseProps} />);
    const cells = tileCells(container);

    expect(cells).toHaveLength(4);

    // lead doubles on both axes from lg, flattened to one row below it
    expect(cells[0].className).toContain('col-span-2');
    expect(cells[0].className).toContain('lg:row-span-2');
    expect(cells[0].className).toContain('row-span-1');

    // wide doubles in columns only
    expect(cells[1].className).toContain('col-span-2');
    expect(cells[1].className).not.toContain('row-span-2');

    // tall doubles in rows only
    expect(cells[2].className).toContain('row-span-2');
    expect(cells[2].className).not.toContain('col-span-2');

    // square stays 1x1
    expect(cells[3].className).toContain('col-span-1');
    expect(cells[3].className).toContain('row-span-1');
  });

  it('uses the media library alt text and falls back to decorative', () => {
    const { container } = render(<BentoGrid {...baseProps} />);
    const images = Array.from(container.querySelectorAll('img'));

    expect(images[0]).toHaveAttribute('alt', 'آشپزخانه سفید');
    expect(images[2]).toHaveAttribute('alt', '');
  });

  it('serves the large format rather than the original', () => {
    const { container } = render(<BentoGrid {...baseProps} />);

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringContaining('large_image_1.webp')
    );
  });

  it('drops tiles with no image and keeps the rest', () => {
    const { container } = render(
      <BentoGrid
        {...baseProps}
        tiles={[{ id: 9, Image: null, Size: 'lead' }]}
      />
    );

    expect(container.querySelectorAll('img')).toHaveLength(0);
    // copy alone is reason enough to render the section
    expect(
      screen.getByRole('heading', { level: 2, name: 'پروژه‌های منتخب' })
    ).toBeInTheDocument();
  });

  it('defaults an unknown size preset to square', () => {
    const { container } = render(
      <BentoGrid
        {...baseProps}
        tiles={[{ id: 5, Image: makeImage('5', 'x'), Size: undefined }]}
      />
    );

    const cell = tileCells(container)[0];
    expect(cell.className).toContain('col-span-1');
    expect(cell.className).toContain('row-span-1');
  });

  it('renders nothing at all when both copy and tiles are empty', () => {
    const { container } = render(<BentoGrid locale="fa" />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the section without copy when only tiles are given', () => {
    const { container } = render(<BentoGrid locale="fa" tiles={[tiles[0]]} />);

    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });
});
