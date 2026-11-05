import cn from 'clsx';
import { toneTags, MAX_TONE_TAGS, MAX_CONTENT_WARNING } from '@lib/tone-tags';
import type { ChangeEvent } from 'react';
import type { ToneTag } from '@lib/tone-tags';

type InputExtrasProps = {
  formId: string;
  warningOpen: boolean;
  tonesOpen: boolean;
  contentWarning: string;
  selectedTones: ToneTag[];
  handleWarningChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleTone: (tag: ToneTag) => void;
};

/** The content warning field and tone tag picker of the post composer. */
export function InputExtras({
  formId,
  warningOpen,
  tonesOpen,
  contentWarning,
  selectedTones,
  handleWarningChange,
  toggleTone
}: InputExtrasProps): JSX.Element | null {
  if (!warningOpen && !tonesOpen) return null;

  const isFull = selectedTones.length >= MAX_TONE_TAGS;

  return (
    <div className='flex flex-col gap-4'>
      {warningOpen && (
        <div className='flex flex-col gap-1'>
          <label className='font-bold' htmlFor={`${formId}-warning`}>
            Content warning
          </label>
          <p
            className='text-sm text-light-secondary dark:text-dark-secondary'
            id={`${formId}-warning-help`}
          >
            Say in a few words what the post is about, for example “death of a
            pet”. Readers see only this text until they choose “Show post”.
          </p>
          <input
            id={`${formId}-warning`}
            className='rounded-md border border-light-line-reply bg-transparent px-3 py-2 outline-none
                       focus:border-main-accent dark:border-dark-border'
            type='text'
            value={contentWarning}
            maxLength={MAX_CONTENT_WARNING}
            aria-describedby={`${formId}-warning-help`}
            onChange={handleWarningChange}
          />
        </div>
      )}
      {tonesOpen && (
        <fieldset className='flex flex-col gap-2'>
          <legend className='font-bold'>Tone tags</legend>
          <p className='text-sm text-light-secondary dark:text-dark-secondary'>
            Tone tags tell readers how your post is meant. You can choose up to{' '}
            {MAX_TONE_TAGS}.
          </p>
          <div className='flex flex-wrap gap-2'>
            {toneTags.map(({ tag, name, description }) => {
              const checked = selectedTones.includes(tag);

              return (
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm',
                    checked
                      ? 'border-main-accent bg-main-accent/10'
                      : 'border-light-line-reply dark:border-dark-border',
                    !checked && isFull && 'cursor-not-allowed opacity-50'
                  )}
                  title={description}
                  key={tag}
                >
                  <input
                    className='accent-main-accent'
                    type='checkbox'
                    checked={checked}
                    disabled={!checked && isFull}
                    onChange={(): void => toggleTone(tag)}
                  />
                  <span className='font-bold'>{tag}</span>
                  <span>{name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
