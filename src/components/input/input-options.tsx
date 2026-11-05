import { useRef } from 'react';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './input';
import { ProgressBar } from './progress-bar';
import type { ChangeEvent, ClipboardEvent } from 'react';
import type { IconName } from '@components/ui/hero-icon';

type InputOptionsProps = {
  reply?: boolean;
  modal?: boolean;
  inputLimit: number;
  inputLength: number;
  isValidTweet: boolean;
  warningOpen: boolean;
  tonesOpen: boolean;
  isCharLimitExceeded: boolean;
  toggleWarning: () => void;
  toggleTones: () => void;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
};

type Option = {
  label: string;
  iconName: IconName;
  pressed?: boolean;
  onClick: () => void;
};

export function InputOptions({
  reply,
  modal,
  inputLimit,
  inputLength,
  isValidTweet,
  warningOpen,
  tonesOpen,
  isCharLimitExceeded,
  toggleWarning,
  toggleTones,
  handleImageUpload
}: InputOptionsProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const options: Readonly<Option[]> = [
    {
      label: 'Add photos or videos',
      iconName: 'PhotoIcon',
      onClick: (): void => inputFileRef.current?.click()
    },
    {
      label: warningOpen ? 'Remove content warning' : 'Add a content warning',
      iconName: 'ExclamationTriangleIcon',
      pressed: warningOpen,
      onClick: toggleWarning
    },
    {
      label: tonesOpen ? 'Hide tone tags' : 'Add tone tags',
      iconName: 'TagIcon',
      pressed: tonesOpen,
      onClick: toggleTones
    }
  ];

  return (
    <motion.div className='flex justify-between' {...variants}>
      <div className='flex text-main-accent'>
        <input
          className='hidden'
          type='file'
          accept='image/*,video/*'
          onChange={handleImageUpload}
          ref={inputFileRef}
          multiple
        />
        {options.map(({ label, iconName, pressed, onClick }) => (
          <Button
            className={cn(
              `accent-tab accent-bg-tab group relative rounded-full p-2
               hover:bg-main-accent/10 active:bg-main-accent/20`,
              pressed && 'bg-main-accent/10'
            )}
            onClick={onClick}
            aria-label={label}
            aria-pressed={pressed}
            key={iconName}
          >
            <HeroIcon className='h-5 w-5' iconName={iconName} />
            <ToolTip tip={label} modal={modal} />
          </Button>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <motion.div
          className='flex items-center gap-4'
          animate={inputLength ? { opacity: 1 } : { opacity: 0 }}
        >
          <ProgressBar
            modal={modal}
            inputLimit={inputLimit}
            inputLength={inputLength}
            isCharLimitExceeded={isCharLimitExceeded}
          />
        </motion.div>
        <Button
          type='submit'
          className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75'
          disabled={!isValidTweet}
        >
          {reply ? 'Reply' : 'Post'}
        </Button>
      </div>
    </motion.div>
  );
}
