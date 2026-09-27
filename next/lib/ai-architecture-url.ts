const DEFAULT_AI_ARCHITECTURE_URL = 'http://localhost:3001';

export function getAiArchitectureBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_AI_ARCHITECTURE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEFAULT_AI_ARCHITECTURE_URL;
}

export function buildAiArchitectureUrl(options?: {
  prompt?: string;
  path?: string;
}): string {
  const base = getAiArchitectureBaseUrl();
  const pathSegment = options?.path?.replace(/^\//, '');
  let url = pathSegment ? `${base}/${pathSegment}` : base;

  if (options?.prompt?.trim()) {
    const joiner = url.includes('?') ? '&' : '?';
    url = `${url}${joiner}prompt=${encodeURIComponent(options.prompt.trim())}`;
  }

  return url;
}

/** Resolves CMS link values: absolute URLs as-is, otherwise under the AI product base. */
export function resolveAiProductHref(url?: string | null): string {
  if (!url?.trim()) {
    return getAiArchitectureBaseUrl();
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return buildAiArchitectureUrl({ path: trimmed });
}
