import { siteName, siteDescription, siteImage } from '@lib/site';
import { Logo } from '@components/brand/logo';
import { SEO } from './seo';

/** Shown for a moment while the sign-in state is being checked. */
export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO title={siteName} description={siteDescription} image={siteImage} />
      <Logo iconClassName='h-20 w-20' />
      <p className='sr-only' role='status'>
        Loading
      </p>
    </main>
  );
}
