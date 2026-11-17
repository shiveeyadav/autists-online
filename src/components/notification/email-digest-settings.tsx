import { useEffect, useState } from 'react';
import cn from 'clsx';
import { toast } from 'react-hot-toast';
import { updateEmailDigest, getContactEmail, saveContactEmail } from '@lib/firebase/utils';
import { auth } from '@lib/firebase/app';
import { HeroIcon } from '@components/ui/hero-icon';
import type { EmailDigestFrequency } from '@lib/types/user';

type EmailDigestSettingsProps = {
  userId: string;
  current: EmailDigestFrequency;
};

const options: { value: EmailDigestFrequency; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shown only when the signed-in account has no email address on record, so
 * the round-up and activity emails have somewhere to go.
 */
function MissingEmail({ userId }: { userId: string }): JSX.Element | null {
  const [needed, setNeeded] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const current = auth.currentUser;
    if (!current || current.uid !== userId) return;
    if (current.email || current.providerData.some((p) => p.email)) return;

    let cancelled = false;
    getContactEmail(userId)
      .then((saved) => {
        if (!cancelled && !saved) setNeeded(true);
      })
      .catch(() => undefined);
    return (): void => {
      cancelled = true;
    };
  }, [userId]);

  if (!needed) return null;

  const submit = async (): Promise<void> => {
    const email = value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    setSaving(true);
    try {
      await saveContactEmail(userId, email);
      toast.success('Email saved. Your emails will go there.');
      setNeeded(false);
    } catch {
      toast.error('Could not save your email');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className='flex flex-wrap items-center justify-between gap-3 border-b border-light-border px-4 py-3 dark:border-dark-border'
      onSubmit={(e): void => {
        e.preventDefault();
        void submit();
      }}
    >
      <div>
        <p className='font-bold'>Where should we send these?</p>
        <p className='text-sm text-light-secondary dark:text-dark-secondary'>
          Your account has no email address, so we can’t send you emails yet. Only you can see it.
        </p>
      </div>
      <div className='flex gap-2'>
        <input
          type='email'
          required
          value={value}
          onChange={(e): void => setValue(e.target.value)}
          placeholder='you@example.com'
          aria-label='Email address for notifications'
          className='rounded-full border border-light-border bg-transparent px-4 py-1.5 text-sm dark:border-dark-border'
        />
        <button
          type='submit'
          disabled={saving}
          className='rounded-full bg-main-accent px-4 py-1.5 text-sm font-medium text-white disabled:cursor-wait'
        >
          Save
        </button>
      </div>
    </form>
  );
}

export function EmailDigestSettings({
  userId,
  current
}: EmailDigestSettingsProps): JSX.Element {
  const [frequency, setFrequency] = useState<EmailDigestFrequency>(current);
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: EmailDigestFrequency): Promise<void> => {
    if (next === frequency || saving) return;

    const previous = frequency;

    setFrequency(next);
    setSaving(true);

    try {
      await updateEmailDigest(userId, next);
      toast.success(
        next === 'off'
          ? 'Email round-ups turned off'
          : `You’ll get a ${next} round-up of new posts`
      );
    } catch {
      setFrequency(previous);
      toast.error('Could not save your preference');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <MissingEmail userId={userId} />
    <div
      className='flex flex-wrap items-center justify-between gap-3 border-b
                 border-light-border px-4 py-3 dark:border-dark-border'
    >
      <div className='flex items-center gap-3'>
        <i className='text-main-accent'>
          <HeroIcon className='h-5 w-5' iconName='EnvelopeIcon' />
        </i>
        <div>
          <p className='font-bold'>Email round-up</p>
          <p className='text-sm text-light-secondary dark:text-dark-secondary'>
            A summary of new posts, sent to your account email.
          </p>
        </div>
      </div>
      <div
        className='flex overflow-hidden rounded-full border border-light-border
                   dark:border-dark-border'
        role='group'
        aria-label='Email round-up frequency'
      >
        {options.map(({ value, label }) => (
          <button
            type='button'
            key={value}
            disabled={saving}
            aria-pressed={frequency === value}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition disabled:cursor-wait',
              frequency === value
                ? 'bg-main-accent text-white'
                : 'hover:bg-light-primary/10 dark:hover:bg-dark-primary/10'
            )}
            onClick={(): void => void handleChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
    </>
  );
}
