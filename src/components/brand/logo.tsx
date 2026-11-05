import cn from 'clsx';
import { siteName } from '@lib/site';
import { CustomIcon } from '@components/ui/custom-icon';

type LogoProps = {
  className?: string;
  iconClassName?: string;
  /** Shows the name next to the mark. */
  wordmark?: boolean;
  wordmarkClassName?: string;
};

/** The mark on a rounded square, optionally followed by the site name. */
export function Logo({
  className,
  iconClassName,
  wordmark,
  wordmarkClassName
}: LogoProps): JSX.Element {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-[25%] bg-brand text-white',
          iconClassName ?? 'h-9 w-9'
        )}
      >
        <CustomIcon className='h-3/4 w-3/4' iconName='LogoIcon' />
      </span>
      {wordmark ? (
        <span className={cn('font-bold', wordmarkClassName)}>{siteName}</span>
      ) : (
        <span className='sr-only'>{siteName}</span>
      )}
    </span>
  );
}
