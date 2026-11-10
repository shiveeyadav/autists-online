import { join, resolve, sep } from 'path';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * Server-only helpers for storing uploaded images and videos on our own
 * server (Contabo) instead of Firebase Storage, which would need the paid
 * Blaze plan.
 *
 * Files live under MEDIA_DIR (a Docker volume in production) as
 *   images/<firebase uid>/<file id>.<ext>
 * and are served back by /api/media/[...path].
 */

export const MEDIA_DIR = resolve(
  process.env.MEDIA_DIR || join(process.cwd(), 'data', 'media')
);

/** Same limits the client already enforces in lib/validation.ts. */
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

/**
 * Allowed upload types → stored file extension. SVG is deliberately left out:
 * served from our own origin it could carry script.
 */
export const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/apng': 'apng',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/x-matroska': 'mkv'
};

export const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(ALLOWED_TYPES).map(([type, ext]) => [ext, type])
);

/** File ids come from lib/random.ts (20 letters/digits); Firebase uids are similar. */
export const SAFE_SEGMENT = /^[A-Za-z0-9_-]{1,128}$/;
export const SAFE_FILENAME = /^[A-Za-z0-9_-]{1,128}\.[a-z0-9]{2,5}$/;

/** Resolve a path inside MEDIA_DIR, refusing anything that escapes it. */
export function mediaPath(...parts: string[]): string | null {
  const full = resolve(MEDIA_DIR, ...parts);
  return full.startsWith(MEDIA_DIR + sep) ? full : null;
}

/**
 * Verifies a Firebase ID token and returns the user's uid.
 *
 * Verifying ID tokens only needs the project id (Google's public signing
 * keys are fetched automatically), so this works without a service account.
 */
export async function verifyUser(idToken: string): Promise<string> {
  const name = 'media-verify';
  const app =
    getApps().find((a) => a.name === name) ??
    initializeApp(
      {
        projectId:
          process.env.FIREBASE_PROJECT_ID ||
          process.env.NEXT_PUBLIC_PROJECT_ID
      },
      name
    );

  const decoded = await getAuth(app).verifyIdToken(idToken);
  return decoded.uid;
}
