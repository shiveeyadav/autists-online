import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import type { ImagesPreview } from './file';
import type { User } from './user';
import type { ToneTag } from '@lib/tone-tags';

export type Tweet = {
  id: string;
  text: string | null;
  images: ImagesPreview | null;
  parent: { id: string; username: string } | null;
  userLikes: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  userReplies: number;
  userRetweets: string[];
  /**
   * Optional. When set, the post is hidden behind a "Show post" button with
   * this text. Posts written before this field existed simply lack it.
   */
  contentWarning?: string | null;
  /** Optional tone tags such as '/j'. Missing on older posts. */
  toneTags?: ToneTag[];
};

export type TweetWithUser = Tweet & { user: User };

export const tweetConverter: FirestoreDataConverter<Tweet> = {
  toFirestore(tweet) {
    return { ...tweet };
  },
  fromFirestore(snapshot, options) {
    const { id } = snapshot;
    const data = snapshot.data(options);

    return { id, ...data } as Tweet;
  }
};
