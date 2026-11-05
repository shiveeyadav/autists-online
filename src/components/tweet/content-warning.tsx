import { useState } from 'react';
import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import type { ReactNode } from 'react';

type ContentWarningProps = {
  /** Missing, null or blank means the post has no warning. */
  warning?: string | null;
  children: ReactNode;
  className?: string;
};

/**
 * Hides a post's text and media behind a "Show post" button when the writer
 * added a content warning. Posts without one render their content as normal.
 */
export function ContentWarning({
  warning,
  children,
  className
}: ContentWarningProps): JSX.Element {
  const [shown, setShown] = useState(false);

  const text = warning?.trim();

  if (!text) return <>{children}</>;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className='flex flex-wrap items-center gap-3 rounded-xl border border-light-border
                   bg-main-sidebar-background px-3 py-2 dark:border-dark-border'
      >
        <HeroIcon
          className='h-5 w-5 shrink-0 text-light-secondary dark:text-dark-secondary'
          iconName='ExclamationTriangleIcon'
        />
        <p className='min-w-0 flex-1 break-words'>
          <span className='font-bold'>Content warning:</span> {text}
        </p>
        <Button
          className='border border-light-line-reply px-3 py-1 text-sm font-bold hover:bg-light-primary/10
                     dark:border-light-secondary dark:hover:bg-dark-primary/10'
          aria-expanded={shown}
          onClick={preventBubbling((): void => setShown(!shown))}
        >
          {shown ? 'Hide post' : 'Show post'}
        </Button>
      </div>
      {shown && children}
    </div>
  );
}
