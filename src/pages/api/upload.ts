import { createWriteStream } from 'fs';
import { mkdir, rename, unlink } from 'fs/promises';
import { dirname } from 'path';
import {
  ALLOWED_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  SAFE_SEGMENT,
  mediaPath,
  verifyUser
} from '@lib/media-store';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/upload
 *
 * Body: the raw file bytes.
 * Headers:
 *   Authorization: Bearer <Firebase ID token>
 *   Content-Type:  the file's MIME type
 *   X-File-Id:     the client-generated file id
 *
 * Saves the file to our server and returns { src } — the URL to store in
 * Firestore, exactly where a Firebase Storage download URL used to go.
 */

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = req.headers.authorization ?? '';
  const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!idToken) {
    res.status(401).json({ error: 'Sign in to upload' });
    return;
  }

  let uid: string;

  try {
    uid = await verifyUser(idToken);
  } catch {
    res.status(401).json({ error: 'Your session has expired, sign in again' });
    return;
  }

  const fileId = String(req.headers['x-file-id'] ?? '');
  const type = String(req.headers['content-type'] ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  const ext = ALLOWED_TYPES[type];

  if (!SAFE_SEGMENT.test(fileId) || !SAFE_SEGMENT.test(uid)) {
    res.status(400).json({ error: 'Invalid file id' });
    return;
  }

  if (!ext) {
    res.status(415).json({ error: 'This file type is not supported' });
    return;
  }

  const maxBytes = type.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const declared = Number(req.headers['content-length'] ?? 0);

  if (declared > maxBytes) {
    res.status(413).json({ error: 'File is too large' });
    return;
  }

  const finalPath = mediaPath('images', uid, `${fileId}.${ext}`);

  if (!finalPath) {
    res.status(400).json({ error: 'Invalid file path' });
    return;
  }

  const tmpPath = `${finalPath}.${process.pid}.${Date.now()}.part`;

  try {
    await mkdir(dirname(finalPath), { recursive: true });

    await new Promise<void>((resolveWrite, rejectWrite) => {
      let received = 0;
      const out = createWriteStream(tmpPath, { flags: 'wx' });

      req.on('data', (chunk: Buffer) => {
        received += chunk.length;
        if (received > maxBytes) {
          req.unpipe(out);
          out.destroy();
          req.destroy();
          rejectWrite(Object.assign(new Error('too large'), { code: 413 }));
        }
      });
      req.on('error', rejectWrite);
      out.on('error', rejectWrite);
      out.on('finish', () =>
        received > 0
          ? resolveWrite()
          : rejectWrite(Object.assign(new Error('empty'), { code: 400 }))
      );

      req.pipe(out);
    });

    await rename(tmpPath, finalPath);
  } catch (err) {
    await unlink(tmpPath).catch(() => undefined);

    const code = (err as { code?: number }).code;

    if (code === 413) res.status(413).json({ error: 'File is too large' });
    else if (code === 400) res.status(400).json({ error: 'The file is empty' });
    else res.status(500).json({ error: 'Upload failed, try again' });

    return;
  }

  res.status(200).json({ src: `/api/media/images/${uid}/${fileId}.${ext}` });
}
