import type { Theme, Accent } from './theme';
import type { CommunicationPreference } from '@lib/communication';
import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type User = {
  id: string;
  bio: string | null;
  name: string;
  theme: Theme | null;
  accent: Accent | null;
  website: string | null;
  location: string | null;
  username: string;
  photoURL: string;
  verified: boolean;
  following: string[];
  followers: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  totalTweets: number;
  totalPhotos: number;
  pinnedTweet: string | null;
  coverPhotoURL: string | null;
  /** how often to email a round-up of new posts; undefined means never set */
  emailDigest?: EmailDigestFrequency;
  /** Communication preferences shown on the profile. Missing on old profiles. */
  commPrefs?: CommunicationPreference[];
  /**
   * false for new accounts until they have seen /welcome. Missing (undefined)
   * on accounts created before the welcome page existed, which are not sent
   * there.
   */
  welcomed?: boolean;
};

export type EmailDigestFrequency = 'off' | 'daily' | 'weekly';

export type EditableData = Extract<
  keyof User,
  'bio' | 'name' | 'website' | 'photoURL' | 'location' | 'coverPhotoURL'
>;

export type EditableUserData = Pick<User, EditableData>;

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user) {
    return { ...user };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return { ...data } as User;
  }
};
