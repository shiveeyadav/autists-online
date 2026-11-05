import { siteURL } from '@lib/site';
import type { GetServerSideProps } from 'next';

/**
 * Served as /robots.txt. Generated rather than static so the sitemap line
 * always uses the host from NEXT_PUBLIC_URL.
 */
function renderRobots(): string {
  return [
    '# Public pages (profiles, posts, information pages) are open to crawlers.',
    'User-agent: *',
    'Allow: /$',
    'Allow: /user/',
    'Allow: /tweet/',
    'Allow: /people',
    'Allow: /welcome',
    'Allow: /guidelines',
    '',
    '# Signed-in areas hold nothing useful to a crawler and some are per-user.',
    'Disallow: /home',
    'Disallow: /notifications',
    'Disallow: /bookmarks',
    'Disallow: /api/',
    'Disallow: /user/*/likes',
    'Disallow: /user/*/followers',
    'Disallow: /user/*/following',
    '',
    `Sitemap: ${siteURL}/sitemap.xml`,
    ''
  ].join('\n');
}

export const getServerSideProps: GetServerSideProps = ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  res.write(renderRobots());
  res.end();

  return Promise.resolve({ props: {} });
};

export default function Robots(): null {
  return null;
}
