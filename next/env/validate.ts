import { z } from 'zod';

const TRUTHY_SKIP = new Set(['1', 'true', 'yes']);

export function shouldSkipEnvValidation(): boolean {
  const flag = process.env.SKIP_ENV_VALIDATION;
  return flag !== undefined && TRUTHY_SKIP.has(flag.toLowerCase());
}

const optionalNonEmpty = z
  .string()
  .optional()
  .transform((value) => (value === '' ? undefined : value));

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string({
      required_error: 'NEXT_PUBLIC_API_URL is required',
      invalid_type_error: 'NEXT_PUBLIC_API_URL is required',
    })
    .min(1, 'NEXT_PUBLIC_API_URL is required')
    .url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_SITE_URL: optionalNonEmpty,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalNonEmpty,
  DOMAIN: optionalNonEmpty,
  BACK_PORT: optionalNonEmpty,
  IMAGE_HOSTNAME: optionalNonEmpty,
  BACKEND_URL: optionalNonEmpty,
  WEBSITE_URL: optionalNonEmpty,
  PORT: z.coerce.number().int().positive().optional(),
  PREVIEW_SECRET: optionalNonEmpty,
  TURNSTILE_SECRET_KEY: optionalNonEmpty,
  CONTACT_EMAIL_ACCESS_KEY: optionalNonEmpty,
  CONTACT_EMAIL: optionalNonEmpty,
});

export type ValidatedEnv = z.infer<typeof envSchema>;

function formatValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const variable = issue.path[0];
      if (typeof variable === 'string') {
        return `- ${variable}: ${issue.message}`;
      }
      return `- ${issue.message}`;
    })
    .join('\n');
}

const skipDefaults: ValidatedEnv = {
  NEXT_PUBLIC_API_URL: 'http://localhost:1337',
  NEXT_PUBLIC_SITE_URL: undefined,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined,
  DOMAIN: 'localhost',
  BACK_PORT: '1337',
  IMAGE_HOSTNAME: 'localhost:1337',
  BACKEND_URL: 'http://localhost:1337',
  WEBSITE_URL: undefined,
  PORT: undefined,
  PREVIEW_SECRET: undefined,
  TURNSTILE_SECRET_KEY: undefined,
  CONTACT_EMAIL_ACCESS_KEY: undefined,
  CONTACT_EMAIL: undefined,
};

export function validateEnv(): ValidatedEnv {
  if (shouldSkipEnvValidation()) {
    return {
      ...skipDefaults,
      NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_URL ?? skipDefaults.NEXT_PUBLIC_API_URL,
      DOMAIN: process.env.DOMAIN ?? skipDefaults.DOMAIN,
      BACK_PORT: process.env.BACK_PORT ?? skipDefaults.BACK_PORT,
      IMAGE_HOSTNAME: process.env.IMAGE_HOSTNAME ?? skipDefaults.IMAGE_HOSTNAME,
      BACKEND_URL: process.env.BACKEND_URL ?? skipDefaults.BACKEND_URL,
    };
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${formatValidationError(result.error)}`
    );
  }

  return result.data;
}
