import Link from 'next/link';
import { siteName, pageTitle, contactEmail } from '@lib/site';
import { InfoLayout, PublicLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { InfoSection } from '@components/info/info-section';
import type { ReactElement, ReactNode } from 'react';

const warningSubjects: Readonly<string[]> = [
  'death, illness, injury or medical procedures',
  'self-harm or suicide',
  'violence, abuse or bullying',
  'food, eating or body weight',
  'strong swearing',
  'flashing images or loud sounds in a video',
  'news about politics, war or disasters'
];

export default function Guidelines(): JSX.Element {
  return (
    <MainContainer>
      <SEO
        title={pageTitle('Community guidelines')}
        description={`The rules for posting on ${siteName}, written in plain language.`}
      />
      <MainHeader useMobileSidebar title='Community guidelines' />
      <InfoSection id='rules-who' title='Who this site is for'>
        <p>
          {siteName} is for autistic people. You do not need to show a
          diagnosis to join. Family members, friends and other supporters are
          also welcome if they follow these guidelines.
        </p>
        <p>
          These guidelines apply to posts, replies, profile text, usernames and
          profile pictures.
        </p>
      </InfoSection>
      <InfoSection id='rules-respect' title='1. Treat people with respect'>
        <ul>
          <li>Do not insult, threaten or harass anyone.</li>
          <li>
            Do not attack people for their disability, race, religion, gender,
            sexuality or age.
          </li>
          <li>
            Do not tell other people that they are “not really autistic”, or
            that they need to be cured.
          </li>
          <li>
            You may disagree with what someone says. Write about the idea, not
            about the person.
          </li>
        </ul>
      </InfoSection>
      <InfoSection id='rules-clear' title='2. Say what you mean'>
        <ul>
          <li>
            Many people here read words literally. Write what you mean
            directly.
          </li>
          <li>
            If a post is a joke or is sarcastic, add a tone tag such as /j or
            /s. The <Link href='/welcome'>welcome page</Link> lists all tone
            tags.
          </li>
          <li>
            Do not post hidden messages about another person (sometimes called
            “vague-posting”).
          </li>
        </ul>
      </InfoSection>
      <InfoSection id='rules-prefs' title='3. Follow communication preferences'>
        <p>
          A profile can list how that person prefers to communicate, for
          example “May reply slowly” or “Please ask before giving advice”.
          Follow these preferences when you reply to them.
        </p>
        <p>
          A slow reply, or no reply, is not rude. People reply when they are
          able to.
        </p>
      </InfoSection>
      <InfoSection id='rules-warnings' title='4. Use content warnings'>
        <p>Add a content warning to a post when it is about:</p>
        <ul>
          {warningSubjects.map((subject) => (
            <li key={subject}>{subject}</li>
          ))}
        </ul>
        <p>
          If you are not sure whether a post needs a content warning, add one.
        </p>
      </InfoSection>
      <InfoSection id='rules-privacy' title='5. Protect privacy'>
        <ul>
          <li>
            Do not post another person’s private information, such as their
            address, phone number, workplace or real name, without their
            permission.
          </li>
          <li>
            Do not post screenshots of private conversations without permission
            from everyone in them.
          </li>
          <li>Do not post photos of other people without their permission.</li>
        </ul>
      </InfoSection>
      <InfoSection id='rules-content' title='6. Content that is not allowed'>
        <ul>
          <li>Sexual content or nudity.</li>
          <li>
            Content that encourages self-harm, suicide or eating disorders.
          </li>
          <li>Anything illegal, including copyright infringement.</li>
          <li>Adverts, spam, and the same post repeated many times.</li>
          <li>Pretending to be another person or organisation.</li>
        </ul>
      </InfoSection>
      <InfoSection id='rules-health' title='7. Health information'>
        <p>
          You can share your own experiences of health, therapy and medication.
          Other people’s experiences are not medical advice. Talk to a doctor
          before you change a treatment.
        </p>
        <p>
          If you or someone else is in danger now, contact your local emergency
          number. Do not wait for a reply on this site.
        </p>
      </InfoSection>
      <InfoSection id='rules-enforce' title='8. What happens if a guideline is broken'>
        <p>
          The people who run this site can delete posts that break these
          guidelines. If someone breaks them more than once, or breaks them
          seriously, their account can be removed.
        </p>
        {contactEmail ? (
          <p>
            To report a post or an account, send an email to{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Include the
            link to the post or profile. Use the share menu on a post and choose
            “Copy link to post” to get its link.
          </p>
        ) : (
          <p>
            To report a post or an account, contact the people who run this
            site. Include the link to the post or profile.
          </p>
        )}
      </InfoSection>
    </MainContainer>
  );
}

Guidelines.getLayout = (page: ReactElement): ReactNode => (
  <PublicLayout>
    <MainLayout>
      <InfoLayout>{page}</InfoLayout>
    </MainLayout>
  </PublicLayout>
);
