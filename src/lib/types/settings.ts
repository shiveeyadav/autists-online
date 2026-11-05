import type { Timestamp } from 'firebase/firestore';

export type FontChoice = 'standard' | 'dyslexia';

export type TextSize = 'small' | 'medium' | 'large' | 'larger';

/**
 * Comfort settings. They are stored in localStorage (so they apply before the
 * first paint) and, for signed-in people, in users/{uid}/private/settings so
 * they follow the person to other devices. Only the owner can read that doc.
 */
export type ComfortSettings = {
  /** Reduced motion, a muted palette and no autoplaying media. */
  calmMode: boolean;
  font: FontChoice;
  textSize: TextSize;
};

export type StoredComfortSettings = ComfortSettings & {
  updatedAt: Timestamp | null;
};

export const fontChoices: Readonly<FontChoice[]> = ['standard', 'dyslexia'];

export const textSizes: Readonly<TextSize[]> = [
  'small',
  'medium',
  'large',
  'larger'
];

export const defaultSettings: Readonly<ComfortSettings> = {
  calmMode: true,
  font: 'standard',
  textSize: 'medium'
};

export const SETTINGS_STORAGE_KEY = 'ao-settings';

function isFontChoice(value: unknown): value is FontChoice {
  return fontChoices.includes(value as FontChoice);
}

function isTextSize(value: unknown): value is TextSize {
  return textSizes.includes(value as TextSize);
}

/** Turns untrusted stored data into complete, valid settings. */
export function parseSettings(value: unknown): ComfortSettings {
  if (!value || typeof value !== 'object') return { ...defaultSettings };

  const { calmMode, font, textSize } = value as Record<string, unknown>;

  return {
    calmMode:
      typeof calmMode === 'boolean' ? calmMode : defaultSettings.calmMode,
    font: isFontChoice(font) ? font : defaultSettings.font,
    textSize: isTextSize(textSize) ? textSize : defaultSettings.textSize
  };
}
