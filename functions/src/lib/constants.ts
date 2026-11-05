/**
 * Public site URL used in emails and push notification links. Set SITE_URL
 * in the functions environment (functions/.env) to override it.
 */
export const SITE_URL = (
  process.env.SITE_URL ?? 'https://autists.online'
).replace(/\/+$/, '');

/** Region the functions in this project are deployed to (see lib/utils.ts). */
export const FUNCTIONS_REGION = 'asia-southeast2';
