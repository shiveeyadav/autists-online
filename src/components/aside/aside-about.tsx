import Link from 'next/link';
import { siteName } from '@lib/site';
import type { MotionProps } from 'framer-motion';

/** Fade-in used by the boxes in the right-hand column. */
export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

const links: Readonly<[string, string][]> = [
  ['/welcome', 'How this site works'],
  ['/guidelines', 'Community guidelines']
];

/** Replaces the old trends box: a short, plain description of the site. */
export function AsideAbout(): JSX.Element {
  return (
    <section
      className='hover-animation flex flex-col gap-3 rounded-2xl bg-main-sidebar-background px-4 py-3'
      aria-labelledby='aside-about-title'
    >
      <h2 id='aside-about-title' className='text-xl font-bold'>
        About {siteName}
      </h2>
      <p>
        {siteName} is a social network for autistic people. You can write
        short posts, reply to other people and follow them.
      </p>
      <p className='text-light-secondary dark:text-dark-secondary'>
        Calm mode is on by default. You can add a content warning or a tone tag
        to a post, and you can list your communication preferences on your
        profile.
      </p>
      <ul className='flex flex-col gap-1'>
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className='custom-underline text-main-accent'>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
