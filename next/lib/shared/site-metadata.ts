const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;

if (!SITE_NAME || !SITE_DESCRIPTION) {
  throw new Error(
    'NEXT_PUBLIC_SITE_NAME and NEXT_PUBLIC_SITE_DESCRIPTION are required. Set them in the product env file.'
  );
}

export { SITE_NAME, SITE_DESCRIPTION };
