import { useRef } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { doc, query, where, orderBy } from 'firebase/firestore';
import { tweetsCollection } from '@lib/firebase/collections';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { isPlural } from '@lib/utils';
import { siteName, pageTitle } from '@lib/site';
import { HomeLayout, PublicLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { Tweet } from '@components/tweet/tweet';
import { ViewTweet } from '@components/view/view-tweet';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { ViewParentTweet } from '@components/view/view-parent-tweet';
import type { ReactElement, ReactNode } from 'react';
import type { GetServerSideProps } from 'next';

type TweetPreview = {
  text: string | null;
  authorName: string;
  authorUsername: string;
  image: string | null;
  contentWarning: string | null;
};

/**
 * Fetched on the server so the page ships real <title> and og: tags in its
 * first response. Social crawlers (WhatsApp, Facebook, LinkedIn, Slack) never
 * run JavaScript, so without this a shared link previews as an empty shell.
 */
export const getServerSideProps: GetServerSideProps<{
  preview: TweetPreview | null;
}> = async ({ params, res }) => {
  // let search engines and link previews cache briefly, cheap for repeat hits
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );

  const id = typeof params?.id === 'string' ? params.id : null;

  if (!id) return { props: { preview: null } };

  try {
    // imported lazily so the client bundle never pulls in firebase-admin
    const { adminDb, isAdminConfigured } = await import('@lib/firebase/admin');

    if (!isAdminConfigured()) return { props: { preview: null } };

    const snapshot = await adminDb().doc(`tweets/${id}`).get();

    if (!snapshot.exists) return { props: { preview: null } };

    const data = snapshot.data() as {
      text?: string | null;
      createdBy?: string;
      images?: { src: string }[] | null;
      contentWarning?: string | null;
    };

    const author = (
      await adminDb().doc(`users/${data.createdBy ?? ''}`).get()
    ).data() as { name?: string; username?: string } | undefined;

    return {
      props: {
        preview: {
          text: data.text ?? null,
          authorName: author?.name ?? 'Someone',
          authorUsername: author?.username ?? 'unknown',
          image: data.images?.[0]?.src ?? null,
          contentWarning: data.contentWarning ?? null
        }
      }
    };
  } catch {
    // never let a metadata lookup take the page down
    return { props: { preview: null } };
  }
};

export default function TweetId({
  preview
}: {
  preview: TweetPreview | null;
}): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  const { data: tweetData, loading: tweetLoading } = useDocument(
    doc(tweetsCollection, id as string),
    { includeUser: true, allowNull: true }
  );

  const viewTweetRef = useRef<HTMLElement>(null);

  const { data: repliesData, loading: repliesLoading } = useCollection(
    query(
      tweetsCollection,
      where('parent.id', '==', id),
      orderBy('createdAt', 'desc')
    ),
    { includeUser: true, allowNull: true }
  );

  const { text, images } = tweetData ?? {};

  const imagesLength = images?.length ?? 0;
  const parentId = tweetData?.parent?.id;

  const tweetPageTitle = tweetData
    ? `${tweetData.user.name} on ${siteName}: "${
        tweetData.contentWarning
          ? `Content warning: ${tweetData.contentWarning}`
          : text ?? ''
      }${
        images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
      }" / ${siteName}`
    : null;

  return (
    <MainContainer className='!pb-[1280px]'>
      {/* Rendered on the server from `preview`, so crawlers get real metadata
          immediately rather than waiting on a client-side Firestore read. */}
      {preview && (
        <SEO
          title={`${preview.authorName} on ${siteName}: "${
            preview.contentWarning
              ? `Content warning: ${preview.contentWarning}`
              : preview.text ?? ''
          }" / ${siteName}`}
          description={
            preview.contentWarning
              ? `A post by @${preview.authorUsername} with a content warning: ${preview.contentWarning}`
              : preview.text ?? `A post by @${preview.authorUsername}`
          }
          image={preview.contentWarning ? undefined : preview.image ?? undefined}
        />
      )}
      <MainHeader
        useActionButton
        title={parentId ? 'Thread' : 'Post'}
        action={back}
      />
      <section>
        {tweetLoading ? (
          <Loading className='mt-5' />
        ) : !tweetData ? (
          <>
            {!preview && <SEO title={pageTitle('Post not found')} />}
            <Error message='This post does not exist. It may have been deleted.' />
          </>
        ) : (
          <>
            {!preview && tweetPageTitle && <SEO title={tweetPageTitle} />}
            {parentId && (
              <ViewParentTweet
                parentId={parentId}
                viewTweetRef={viewTweetRef}
              />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} {...tweetData} />
            {tweetData &&
              (repliesLoading ? (
                <Loading className='mt-5' />
              ) : (
                <AnimatePresence mode='popLayout'>
                  {repliesData?.map((tweet) => (
                    <Tweet {...tweet} key={tweet.id} />
                  ))}
                </AnimatePresence>
              ))}
          </>
        )}
      </section>
    </MainContainer>
  );
}

TweetId.getLayout = (page: ReactElement): ReactNode => (
  <PublicLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </PublicLayout>
);
