/**
 * Every piece of site branding lives here, so renaming or moving the site
 * means changing this file (and NEXT_PUBLIC_URL) and nothing else.
 *
 * This module has no browser-only code, so pages, API routes and
 * getServerSideProps can all import it.
 */

export const siteName = 'Autists Online';

export const siteTagline = 'A calm social network for autistic people.';

export const siteDescription =
  'Autists Online is a calm, text-first social network made for autistic people. ' +
  'Calm mode is on by default, posts can carry content warnings and tone tags, ' +
  'and profiles can say how each person prefers to communicate.';

const DEFAULT_URL = 'https://autists.online';

/** Public origin of the site, without a trailing slash. */
export const siteURL = (process.env.NEXT_PUBLIC_URL || DEFAULT_URL).replace(
  /\/+$/,
  ''
);

function getHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return new URL(DEFAULT_URL).host;
  }
}

/** Host name only, for example "autists.online". */
export const siteHost = getHost(siteURL);

/** Default social preview image, served from /public. */
export const siteImage = '/og-image.png';

/** Main brand colour, also used in emails (which cannot read CSS variables). */
export const brandColor = '#3f7a80';

/** Shown when a person has not uploaded a profile photo. */
export const defaultAvatar = '/assets/default-avatar.svg';

/** Builds a page title such as "Home / Autists Online". */
export function pageTitle(title?: string): string {
  return title ? `${title} / ${siteName}` : siteName;
}

/**
 * Address people can write to about reports and moderation. Optional: pages
 * that mention it leave it out when NEXT_PUBLIC_CONTACT_EMAIL is not set.
 */
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;
