/**
 * Tone tags say how a post is meant. The ids are stored in tweets/{id}.toneTags
 * and are also listed in firestore.rules — keep both lists the same.
 */
export const toneTags = [
  {
    tag: '/j',
    name: 'joking',
    description: 'This post is a joke. It is not meant seriously.'
  },
  {
    tag: '/hj',
    name: 'half-joking',
    description: 'This post is partly a joke and partly meant seriously.'
  },
  {
    tag: '/srs',
    name: 'serious',
    description: 'This post is meant seriously. It is not a joke.'
  },
  {
    tag: '/gen',
    name: 'genuine question',
    description:
      'This is a real question. The writer wants an answer and is not being sarcastic.'
  },
  {
    tag: '/pos',
    name: 'positive',
    description: 'The writer means this in a positive, friendly way.'
  },
  {
    tag: '/neg',
    name: 'negative',
    description: 'The writer means this in a negative way.'
  },
  {
    tag: '/nm',
    name: 'not mad',
    description: 'The writer is not angry or upset, even if the words are short.'
  },
  {
    tag: '/lh',
    name: 'light-hearted',
    description: 'This post is meant to be relaxed and friendly.'
  },
  {
    tag: '/s',
    name: 'sarcastic',
    description:
      'This post is sarcastic: the writer means the opposite of what the words say.'
  },
  {
    tag: '/info',
    name: 'information',
    description: 'This post shares information. It is not an opinion.'
  },
  {
    tag: '/nbr',
    name: 'not directed at anyone reading',
    description:
      'This post is not about anyone who is reading it. It is not a hidden message.'
  }
] as const;

export type ToneTag = typeof toneTags[number]['tag'];

export type ToneTagInfo = typeof toneTags[number];

/** A post can have at most this many tone tags. */
export const MAX_TONE_TAGS = 3;

/** Longest allowed content warning, in characters. */
export const MAX_CONTENT_WARNING = 100;

const byTag = new Map<string, ToneTagInfo>(
  toneTags.map((info) => [info.tag, info])
);

/** Unknown tags (for example from an older version) are skipped. */
export function getToneTag(tag: string): ToneTagInfo | null {
  return byTag.get(tag) ?? null;
}
