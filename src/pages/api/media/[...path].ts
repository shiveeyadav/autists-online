import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import {
  CONTENT_TYPES,
  SAFE_FILENAME,
  SAFE_SEGMENT,
  mediaPath
} from '@lib/media-store';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/media/images/<uid>/<file id>.<ext>
 *
 * Serves files saved by /api/upload. Files never change once written (a new
 * upload gets a new id), so they are cached for a year. Supports Range
 * requests so videos can be seeked.
 */

export const config = { api: { responseLimit: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).end();
    return;
  }

  const parts = ([] as string[]).concat(req.query.path ?? []);
  const [folder, uid, filename] = parts;

  if (
    parts.length !== 3 ||
    folder !== 'images' ||
    !SAFE_SEGMENT.test(uid) ||
    !SAFE_FILENAME.test(filename)
  ) {
    res.status(404).end();
    return;
  }

  const ext = filename.split('.').pop() as string;
  const contentType = CONTENT_TYPES[ext];
  const filePath = mediaPath(folder, uid, filename);

  if (!contentType || !filePath) {
    res.status(404).end();
    return;
  }

  let size: number;

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('not a file');
    size = info.size;
  } catch {
    res.status(404).end();
    return;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Accept-Ranges', 'bytes');

  const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ''));
  let start = 0;
  let end = size - 1;

  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    } else {
      start = Math.max(size - Number(range[2]), 0);
    }

    if (start > end || start >= size) {
      res.setHeader('Content-Range', `bytes */${size}`);
      res.status(416).end();
      return;
    }

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
  } else {
    res.status(200);
  }

  res.setHeader('Content-Length', String(end - start + 1));

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath, { start, end })
    .on('error', () => res.destroy())
    .pipe(res);
}
