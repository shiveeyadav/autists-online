/**
 * Communication preferences people can show on their profile. The ids are
 * stored in users/{uid}.commPrefs and are also listed in firestore.rules —
 * keep both lists the same.
 */
export const communicationPreferences = [
  {
    id: 'text-over-calls',
    label: 'Prefers text over calls'
  },
  {
    id: 'slow-replies',
    label: 'May reply slowly'
  },
  {
    id: 'direct-welcome',
    label: 'Direct communication is welcome'
  },
  {
    id: 'literal',
    label: 'Reads words literally, so please say exactly what you mean'
  },
  {
    id: 'tone-tags-help',
    label: 'Tone tags help me understand posts'
  },
  {
    id: 'no-small-talk',
    label: 'Prefers to skip small talk'
  },
  {
    id: 'interests-welcome',
    label: 'Happy to hear about your special interests'
  },
  {
    id: 'ask-before-advice',
    label: 'Please ask before giving advice'
  }
] as const;

export type CommunicationPreference =
  typeof communicationPreferences[number]['id'];

const labels = new Map<string, string>(
  communicationPreferences.map(({ id, label }) => [id, label])
);

/** Unknown ids (for example from an older version) are skipped. */
export function getCommunicationLabel(id: string): string | null {
  return labels.get(id) ?? null;
}
