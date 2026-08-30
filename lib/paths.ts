const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (!basePath) return path;
  return `${basePath}${path}`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xianji-zhijian.sites.openai.com';
