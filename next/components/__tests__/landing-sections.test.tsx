import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { demoCta, demoShowcase } from '../landing/demo-data';
import { LandingBenefits } from '../landing/sections/benefits';
import { LandingCta } from '../landing/sections/cta';
import { LandingShowcase } from '../landing/sections/showcase';

describe('landing sections', () => {
  it('renders the three showcase cards from props', () => {
    render(<LandingShowcase {...demoShowcase} />);

    expect(
      screen.getByRole('heading', { level: 2, name: demoShowcase.heading! })
    ).toBeInTheDocument();
    expect(screen.getByText('گفتگوی طراحی')).toBeInTheDocument();
    expect(
      screen.getByText('پیش‌نمایش اتاق با هوش مصنوعی')
    ).toBeInTheDocument();
    expect(screen.getByText('تست سلیقه')).toBeInTheDocument();
    expect(screen.getByText('دنج و پرمحتوا')).toBeInTheDocument();
  });

  it('localises the final CTA link', () => {
    render(<LandingCta {...demoCta} />);

    expect(
      screen.getByRole('heading', { level: 2, name: demoCta.heading! })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'همین حالا شروع کنید' })
    ).toHaveAttribute('href', '/fa/contact');
  });

  it('renders nothing when a section has no data', () => {
    const { container } = render(<LandingBenefits locale="fa" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an empty CTA', () => {
    const { container } = render(<LandingCta locale="fa" />);
    expect(container.firstChild).toBeNull();
  });
});
