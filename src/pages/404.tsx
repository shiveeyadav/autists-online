import Link from 'next/link';
import { pageTitle } from '@lib/site';
import { SEO } from '@components/common/seo';
import { Logo } from '@components/brand/logo';

export default function NotFound(): JSX.Element {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center'>
      <SEO
        title={pageTitle('Page not found')}
        description='There is no page at this address.'
      />
      <Logo iconClassName='h-14 w-14' />
      <div className='flex max-w-md flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Page not found</h1>
        <p className='text-light-secondary dark:text-dark-secondary'>
          There is no page at this address. The address may be spelled
          wrongly, or the page may have been deleted.
        </p>
      </div>
      <Link
        href='/'
        className='rounded-full bg-main-accent px-5 py-2 font-bold text-white hover:brightness-90'
      >
        Go to the start page
      </Link>
    </main>
  );
}
