import 'server-only';

/**
 * Server-only environment values. Never import this module from Client Components.
 */
export const serverEnv = {
  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  CONTACT_EMAIL_ACCESS_KEY: process.env.CONTACT_EMAIL_ACCESS_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  WEBSITE_URL: process.env.WEBSITE_URL,
  PORT: process.env.PORT,
  BACKEND_URL: process.env.BACKEND_URL,
  DOMAIN: process.env.DOMAIN,
  BACK_PORT: process.env.BACK_PORT,
  IMAGE_HOSTNAME: process.env.IMAGE_HOSTNAME,
};
