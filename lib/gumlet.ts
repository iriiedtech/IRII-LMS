import crypto from 'crypto';

export function getGumletSignedUrl(videoUrl: string) {
  const GUMLET_TOKEN = process.env.GUMLET_TOKEN;
  if (!GUMLET_TOKEN) return videoUrl;

  const url = new URL(videoUrl);
  const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
  const path = url.pathname;
  
  const strToSign = `${GUMLET_TOKEN}${path}${expires}`;
  const hash = crypto.createHash('md5').update(strToSign).digest('hex');

  url.searchParams.set('expires', expires.toString());
  url.searchParams.set('token', hash);

  return url.toString();
}
