import { useId } from 'react';
import cn from 'clsx';
import { getToneTag } from '@lib/tone-tags';
import { preventBubbling } from '@lib/utils';
import type { ToneTagInfo } from '@lib/tone-tags';

type ToneTagListProps = {
  /** Missing on posts written before tone tags existed. */
  tags?: readonly string[] | null;
  className?: string;
};

/**
 * Shows a post's tone tags, each with its plain-language name. The longer
 * explanation appears on hover and on keyboard focus (or a tap on touch
 * screens, which focuses the button).
 */
export function ToneTagList({
  tags,
  className
}: ToneTagListProps): JSX.Element | null {
  const baseId = useId();

  const known = (tags ?? [])
    .map((tag) => getToneTag(tag))
    .filter((info): info is ToneTagInfo => !!info);

  if (!known.length) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label='Tone tags'>
      {known.map(({ tag, name, description }, index) => {
        const tooltipId = `${baseId}-tone-${index}`;

        return (
          <li key={tag}>
            <button
              type='button'
              className='main-tab group relative inline-flex items-center gap-1 rounded-full border
                         border-light-line-reply px-2 py-0.5 text-sm dark:border-dark-border'
              aria-describedby={tooltipId}
              onClick={preventBubbling()}
            >
              <span className='font-bold'>{tag}</span>
              <span className='text-light-secondary dark:text-dark-secondary'>
                {name}
              </span>
              <span
                id={tooltipId}
                role='tooltip'
                className='menu-container invisible absolute left-0 top-full z-20 mt-1 w-64 whitespace-normal
                           p-2 text-left text-sm font-normal text-light-primary opacity-0
                           group-hover:visible group-hover:opacity-100 group-focus:visible
                           group-focus:opacity-100 dark:text-dark-primary'
              >
                {description}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
