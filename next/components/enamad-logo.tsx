'use client';

// Derive the seal image and its non-standard `code` attribute from the
// configured verification link so the badge and link never show different seals.
const getEnamadBadge = (rawUrl?: string) => {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    return {
      href: rawUrl,
      code: url.searchParams.get('Code') ?? '',
      src: `${url.origin}/logo.aspx${url.search}`,
    };
  } catch {
    console.warn('Invalid NEXT_PUBLIC_ENAMAD_URL:', rawUrl);
    return null;
  }
};

const ENAMAD = getEnamadBadge(process.env.NEXT_PUBLIC_ENAMAD_URL);

export const EnamadLogo = () =>
  ENAMAD ? (
    <a referrerPolicy="origin" target="_blank" href={ENAMAD.href}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        referrerPolicy="origin"
        src={ENAMAD.src}
        alt=""
        width={100}
        height={100}
        style={{ cursor: 'pointer' }}
        {...{ code: ENAMAD.code }}
      />
    </a>
  ) : null;
