import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { markWelcomed } from '@lib/firebase/utils';
import { siteName, siteDescription, pageTitle } from '@lib/site';
import { toneTags, MAX_TONE_TAGS } from '@lib/tone-tags';
import { communicationPreferences } from '@lib/communication';
import { InfoLayout, PublicLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { InfoSection } from '@components/info/info-section';
import { ComfortSettingsForm } from '@components/settings/comfort-settings';
import type { ReactElement, ReactNode } from 'react';

export default function Welcome(): JSX.Element {
  const { user } = useAuth();

  const userId = user?.id ?? null;
  const isNewAccount = user?.welcomed === false;

  // New accounts are sent here once. Seeing the page is enough to count.
  useEffect(() => {
    if (userId && isNewAccount) void markWelcomed(userId).catch(() => undefined);
  }, [userId, isNewAccount]);

  return (
    <MainContainer>
      <SEO
        title={pageTitle('Welcome')}
        description={`How ${siteName} works: calm mode, content warnings, tone tags and communication preferences.`}
      />
      <MainHeader useMobileSidebar title={`Welcome to ${siteName}`} />
      <InfoSection id='welcome-what' title={`What ${siteName} is`}>
        <p>{siteDescription}</p>
        <p>
          You can write short posts, add photos or videos, reply to posts, like
          posts and follow people. The home page lists the newest posts from
          everyone, newest first. There are no adverts and no list of
          “trending” topics.
        </p>
        <p>
          Please read the <Link href='/guidelines'>community guidelines</Link>.
          They explain what is allowed on this site.
        </p>
      </InfoSection>
      <InfoSection id='welcome-comfort' title='Calm mode, font and text size'>
        <p>
          Calm mode is on when you arrive. It turns off animations, uses softer
          colours and stops videos from playing by themselves. You can change
          these settings here at any time. They are also under “Display and
          comfort” in the menu.
        </p>
        <ComfortSettingsForm />
      </InfoSection>
      <InfoSection id='welcome-warnings' title='Content warnings'>
        <p>
          When you write a post, you can add a content warning. Choose the
          triangle button below the text box and write a few words about the
          subject, for example “hospital visit” or “loud video”.
        </p>
        <p>
          Readers first see only the content warning. The text and media of
          the post are shown only after they choose “Show post”.
        </p>
      </InfoSection>
      <InfoSection id='welcome-tones' title='Tone tags'>
        <p>
          A tone tag says how a post is meant, so readers do not have to guess.
          Choose the tag button below the text box to add up to {MAX_TONE_TAGS}{' '}
          tone tags to a post. On a post, move the pointer over a tone tag, or
          select it with the keyboard or a tap, to see its explanation.
        </p>
        <dl className='grid grid-cols-[auto,1fr] gap-x-4 gap-y-2'>
          {toneTags.map(({ tag, name, description }) => (
            <div className='contents' key={tag}>
              <dt className='font-bold'>
                {tag} <span className='font-normal'>({name})</span>
              </dt>
              <dd className='text-light-secondary dark:text-dark-secondary'>
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </InfoSection>
      <InfoSection id='welcome-comm' title='Communication preferences'>
        <p>
          Your profile can show how you prefer to communicate. Other people see
          this list on your profile page. To choose, open your profile and
          select “Edit profile”. The choices are:
        </p>
        <ul>
          {communicationPreferences.map(({ id, label }) => (
            <li key={id}>{label}</li>
          ))}
        </ul>
      </InfoSection>
      <div className='flex flex-wrap gap-3 px-4 py-5'>
        {user ? (
          <>
            <Link
              href='/home'
              className='rounded-full bg-main-accent px-5 py-2 font-bold text-white hover:brightness-90'
            >
              Go to the home page
            </Link>
            <Link
              href={`/user/${user.username}`}
              className='rounded-full border border-light-line-reply px-5 py-2 font-bold
                         hover:bg-light-primary/10 dark:border-light-secondary dark:hover:bg-dark-primary/10'
            >
              Go to my profile
            </Link>
          </>
        ) : (
          <Link
            href='/'
            className='rounded-full bg-main-accent px-5 py-2 font-bold text-white hover:brightness-90'
          >
            Create an account or sign in
          </Link>
        )}
      </div>
    </MainContainer>
  );
}

Welcome.getLayout = (page: ReactElement): ReactNode => (
  <PublicLayout>
    <MainLayout>
      <InfoLayout>{page}</InfoLayout>
    </MainLayout>
  </PublicLayout>
);
