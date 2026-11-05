import cn from 'clsx';

export type StatsEmptyProps = {
  title: string;
  modal?: boolean;
  description: string;
};

/** Text-only empty state: says what is missing and what will appear here. */
export function StatsEmpty({
  title,
  modal,
  description
}: StatsEmptyProps): JSX.Element {
  return (
    <div className={cn('flex justify-center p-8', modal && 'mt-[52px]')}>
      <div className='flex w-full max-w-sm flex-col gap-2 text-center'>
        <p className='text-2xl font-bold'>{title}</p>
        <p className='text-light-secondary dark:text-dark-secondary'>
          {description}
        </p>
      </div>
    </div>
  );
}
