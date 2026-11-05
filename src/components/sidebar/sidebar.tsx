import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { Logo } from '@components/brand/logo';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { SidebarLink } from './sidebar-link';
import { MoreSettings } from './more-settings';
import { SidebarProfile } from './sidebar-profile';
import type { IconName } from '@components/ui/hero-icon';

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
  disabled?: boolean;
  canBeHidden?: boolean;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: '/home',
    linkName: 'Home',
    iconName: 'HomeIcon'
  },
  {
    href: '/notifications',
    linkName: 'Notifications',
    iconName: 'BellIcon'
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true
  },
  {
    href: '/people',
    linkName: 'People',
    iconName: 'UserGroupIcon',
    canBeHidden: true
  },
  {
    href: '/guidelines',
    linkName: 'Guidelines',
    iconName: 'BookOpenIcon',
    canBeHidden: true
  }
];

/**
 * Shown to signed-out visitors, who typically arrive on a profile or post
 * from a search engine. Only the publicly readable pages appear; everything
 * else needs an account.
 */
const publicNavLinks: Readonly<NavLink[]> = [
  {
    href: '/welcome',
    linkName: 'Welcome',
    iconName: 'InformationCircleIcon',
    canBeHidden: true
  },
  {
    href: '/people',
    linkName: 'People',
    iconName: 'UserGroupIcon',
    canBeHidden: true
  },
  {
    href: '/guidelines',
    linkName: 'Guidelines',
    iconName: 'BookOpenIcon',
    canBeHidden: true
  }
];

export function Sidebar(): JSX.Element {
  const { user } = useAuth();
  const { isMobile } = useWindow();

  const { open, openModal, closeModal } = useModal();

  const username = user?.username as string;

  return (
    <header
      id='sidebar'
      className='flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24
                 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end'
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>
      <div
        className='fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border 
                   bg-main-background py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0 
                   xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72'
      >
        <section className='flex flex-col justify-center gap-2 xs:items-center xl:items-stretch'>
          <h1 className='hidden xs:flex'>
            <Link
              href={user ? '/home' : '/'}
              className='custom-button main-tab transition hover:bg-light-primary/10
                         focus-visible:bg-main-accent/10 focus-visible:!ring-main-accent/80
                         dark:hover:bg-dark-primary/10'
            >
              <Logo iconClassName='h-8 w-8' />
            </Link>
          </h1>
          <nav className='flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
            {/* Signed-out visitors land here from search, so they get the
                browsable pages only — the rest needs an account. */}
            {(user ? navLinks : publicNavLinks).map(({ ...linkData }) => (
              <SidebarLink {...linkData} key={linkData.href} />
            ))}
            {user && (
              <SidebarLink
                href={`/user/${username}`}
                username={username}
                linkName='Profile'
                iconName='UserIcon'
              />
            )}
            {user && !isMobile && <MoreSettings />}
          </nav>
          {!user && (
            <Link href='/'>
              <a
                className='accent-tab absolute right-4 -translate-y-[72px] rounded-full bg-main-accent px-4 py-2
                           text-center text-lg font-bold text-white outline-none transition hover:brightness-90
                           active:brightness-75 xs:static xs:translate-y-0 xl:w-11/12'
              >
                <span className='hidden xl:block'>Sign in</span>
                {/* narrow screens get a sign-in icon — showing the site logo
                    here read as decoration rather than a way to log in */}
                <span className='block xl:hidden'>
                  <span className='sr-only'>Sign in</span>
                  <HeroIcon
                    className='h-6 w-6'
                    iconName='ArrowRightOnRectangleIcon'
                  />
                </span>
              </a>
            </Link>
          )}
          {user && (
          <Button
            className='accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white
                       outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0
                       xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12'
            onClick={openModal}
          >
            <HeroIcon
              className='block h-6 w-6 xl:hidden'
              iconName='PencilSquareIcon'
            />
            <span className='sr-only xl:not-sr-only'>Write a post</span>
          </Button>
          )}
        </section>
        {user && !isMobile && <SidebarProfile />}
      </div>
    </header>
  );
}
