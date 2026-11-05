import { useState, useEffect, useContext, createContext } from 'react';
import { MotionConfig } from 'framer-motion';
import { onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { userSettingsDoc } from '@lib/firebase/collections';
import {
  defaultSettings,
  parseSettings,
  SETTINGS_STORAGE_KEY
} from '@lib/types/settings';
import { useAuth } from './auth-context';
import type { ReactNode } from 'react';
import type { ComfortSettings } from '@lib/types/settings';

type SettingsContext = {
  settings: ComfortSettings;
  calmMode: boolean;
  updateSettings: (changes: Partial<ComfortSettings>) => void;
};

export const SettingsContext = createContext<SettingsContext | null>(null);

type SettingsContextProviderProps = {
  children: ReactNode;
};

function readLocalSettings(): ComfortSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return parseSettings(raw ? (JSON.parse(raw) as unknown) : null);
  } catch {
    return { ...defaultSettings };
  }
}

function writeLocalSettings(settings: ComfortSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage can be full or blocked; the settings still apply for this visit
  }
}

/** Mirrors the settings onto <html>, where the CSS reads them. */
function applySettings({ calmMode, font, textSize }: ComfortSettings): void {
  const root = document.documentElement;

  root.setAttribute('data-calm', String(calmMode));
  root.setAttribute('data-font', font);
  root.setAttribute('data-text-size', textSize);
}

export function SettingsContextProvider({
  children
}: SettingsContextProviderProps): JSX.Element {
  // The server render uses the defaults; the real values are read after
  // mounting. The early script in _document has already applied them to
  // <html>, so nothing visible changes in between.
  const [settings, setSettings] = useState<ComfortSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  const { user } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    setSettings(readLocalSettings());
    setLoaded(true);
  }, []);

  // Skipped until the saved values are read, so the defaults never
  // overwrite what the early script applied.
  useEffect(() => {
    if (loaded) applySettings(settings);
  }, [loaded, settings]);

  // Signed-in people get the copy saved in their private settings document.
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      userSettingsDoc(userId),
      (snapshot) => {
        if (!snapshot.exists()) return;

        const saved = parseSettings(snapshot.data());

        writeLocalSettings(saved);
        setSettings(saved);
      },
      () => undefined
    );

    return unsubscribe;
  }, [userId]);

  const updateSettings = (changes: Partial<ComfortSettings>): void => {
    const next = { ...settings, ...changes };

    setSettings(next);
    writeLocalSettings(next);

    if (userId)
      void setDoc(
        userSettingsDoc(userId),
        { ...next, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch(() => undefined);
  };

  const value: SettingsContext = {
    settings,
    calmMode: settings.calmMode,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {/* 'always' turns off movement (position, scale, layout) everywhere;
          'user' follows the operating system's reduce-motion setting. */}
      <MotionConfig reducedMotion={settings.calmMode ? 'always' : 'user'}>
        {children}
      </MotionConfig>
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContext {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error('useSettings must be used within a SettingsContextProvider');

  return context;
}
