import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRequireAuth } from '@lib/hooks/useRequireAuth';
import { Aside } from '@components/aside/aside';
import { AsideAbout } from '@components/aside/aside-about';
import { Suggestions } from '@components/aside/suggestions';
import { Placeholder } from '@components/common/placeholder';
import type { ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
};

export function ProtectedLayout({ children }: LayoutProps): JSX.Element {
  const user = useRequireAuth();
  const { replace } = useRouter();

  // New accounts see the welcome page once before anything else.
  const needsWelcome = user?.welcomed === false;

  useEffect(() => {
    if (needsWelcome) void replace('/welcome');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsWelcome]);

  if (!user || needsWelcome) return <Placeholder />;

  return <>{children}</>;
}

/**
 * For pages anyone may view, signed in or not — profiles and individual
 * posts. These are the pages search engines index, so they must never
 * redirect a signed-out visitor away.
 */
export function PublicLayout({ children }: LayoutProps): JSX.Element {
  return <>{children}</>;
}

export function HomeLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideAbout />
        <Suggestions />
      </Aside>
    </>
  );
}

export function UserLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
        <AsideAbout />
      </Aside>
    </>
  );
}

/** For the information pages (/welcome, /guidelines). */
export function InfoLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
      </Aside>
    </>
  );
}

export function PeopleLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideAbout />
      </Aside>
    </>
  );
}
