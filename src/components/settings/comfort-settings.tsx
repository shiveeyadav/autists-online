import cn from 'clsx';
import { useSettings } from '@lib/context/settings-context';
import type { FontChoice, TextSize } from '@lib/types/settings';

const fontOptions: Readonly<[FontChoice, string, string][]> = [
  ['standard', 'Standard', 'The normal font of your device.'],
  [
    'dyslexia',
    'Dyslexia-friendly',
    'Letters that are easier to tell apart, with more space between them.'
  ]
];

const sizeOptions: Readonly<[TextSize, string][]> = [
  ['small', 'Small'],
  ['medium', 'Medium'],
  ['large', 'Large'],
  ['larger', 'Larger']
];

function optionClassName(checked: boolean): string {
  return cn(
    'flex cursor-pointer items-start gap-3 rounded-xl border p-3',
    checked
      ? 'border-main-accent bg-main-accent/10'
      : 'border-light-border dark:border-dark-border'
  );
}

type ComfortSettingsFormProps = {
  className?: string;
};

/**
 * Calm mode, font and text size. Changes apply at once and are saved on this
 * device and, when signed in, to your account.
 */
export function ComfortSettingsForm({
  className
}: ComfortSettingsFormProps): JSX.Element {
  const { settings, updateSettings } = useSettings();
  const { calmMode, font, textSize } = settings;

  return (
    <div className={cn('flex w-full flex-col gap-5', className)}>
      <fieldset className='flex flex-col gap-2'>
        <legend className='mb-2 text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          Calm mode
        </legend>
        <label className={optionClassName(calmMode)}>
          <input
            className='mt-1 h-5 w-5 shrink-0 accent-main-accent'
            type='checkbox'
            checked={calmMode}
            onChange={({ target: { checked } }): void =>
              updateSettings({ calmMode: checked })
            }
          />
          <span className='flex flex-col'>
            <span className='font-bold'>Use calm mode</span>
            <span className='text-sm text-light-secondary dark:text-dark-secondary'>
              Turns off animations, uses softer colours, and stops videos from
              playing by themselves. Calm mode is on for everyone until they
              turn it off.
            </span>
          </span>
        </label>
      </fieldset>
      <fieldset className='flex flex-col gap-2'>
        <legend className='mb-2 text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          Font
        </legend>
        {fontOptions.map(([value, label, description]) => (
          <label className={optionClassName(font === value)} key={value}>
            <input
              className='mt-1 h-5 w-5 shrink-0 accent-main-accent'
              type='radio'
              name='comfort-font'
              value={value}
              checked={font === value}
              onChange={(): void => updateSettings({ font: value })}
            />
            <span className='flex flex-col'>
              <span className='font-bold'>{label}</span>
              <span className='text-sm text-light-secondary dark:text-dark-secondary'>
                {description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset className='flex flex-col gap-2'>
        <legend className='mb-2 text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          Text size
        </legend>
        <div className='grid grid-cols-2 gap-2 xs:grid-cols-4'>
          {sizeOptions.map(([value, label]) => (
            <label
              className={cn(
                optionClassName(textSize === value),
                'items-center justify-center'
              )}
              key={value}
            >
              <input
                className='h-5 w-5 shrink-0 accent-main-accent'
                type='radio'
                name='comfort-text-size'
                value={value}
                checked={textSize === value}
                onChange={(): void => updateSettings({ textSize: value })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
