import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { siteName, siteTagline } from '@lib/site';
import { Logo } from '@components/brand/logo';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { EmailAuthModal } from '@components/modal/email-auth-modal';

type ModalMode = 'signup' | 'signin';

const points: Readonly<string[]> = [
  'Calm mode is on from the start: no moving parts, softer colours and no videos that play by themselves.',
  'Posts can have a content warning, so you choose when to read them.',
  'Tone tags such as /j (joking) and /srs (serious) say how a post is meant.',
  'Profiles can show how a person likes to communicate, for example “prefers text over calls”.'
];

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('signup');

  const openModal = (mode: ModalMode): void => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <>
      <EmailAuthModal
        key={modalMode}
        open={modalOpen}
        initialMode={modalMode}
        closeModal={(): void => setModalOpen(false)}
      />
      <main className='grid lg:grid-cols-[1fr,45vw]'>
        <div className='hidden items-center justify-center bg-brand/90 p-12 lg:flex'>
          <CustomIcon className='h-64 w-64 text-white' iconName='LogoIcon' />
        </div>
        <div className='flex flex-col items-center justify-center gap-8 p-8 lg:items-start'>
          <Logo iconClassName='h-12 w-12' />
          <div className='flex max-w-md flex-col gap-4'>
            <h1 className='text-4xl font-bold lg:text-5xl'>{siteName}</h1>
            <p className='text-xl'>{siteTagline}</p>
            <ul className='flex list-disc flex-col gap-2 pl-5 text-light-secondary dark:text-dark-secondary'>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className='text-light-secondary dark:text-dark-secondary'>
              Read the{' '}
              <Link href='/guidelines' className='custom-underline text-main-accent'>
                community guidelines
              </Link>{' '}
              or the{' '}
              <Link href='/welcome' className='custom-underline text-main-accent'>
                welcome page
              </Link>{' '}
              before you join.
            </p>
          </div>
          <div className='flex w-full max-w-xs flex-col gap-6 [&_button]:py-2'>
            <div className='grid gap-3 font-bold'>
              <Button
                className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                           hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                           dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                onClick={signInWithGoogle}
              >
                <CustomIcon iconName='GoogleIcon' /> Create an account with
                Google
              </Button>
              <Button
                className='bg-main-accent text-white transition hover:brightness-90
                           focus-visible:!ring-main-accent/80 focus-visible:brightness-90 active:brightness-75'
                onClick={(): void => openModal('signup')}
              >
                Create an account with email
              </Button>
            </div>
            <div className='flex flex-col gap-3'>
              <p className='font-bold'>Do you already have an account?</p>
              <Button
                className='border border-light-line-reply font-bold text-main-accent hover:bg-main-accent/10
                           focus-visible:bg-main-accent/10 focus-visible:!ring-main-accent/80 active:bg-main-accent/20
                           dark:border-light-secondary'
                onClick={(): void => openModal('signin')}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
