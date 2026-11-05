import type { ReactNode } from 'react';

type InfoSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** A titled block of text on the /welcome and /guidelines pages. */
export function InfoSection({
  id,
  title,
  children
}: InfoSectionProps): JSX.Element {
  return (
    <section
      className='flex flex-col gap-3 border-b border-light-border px-4 py-5 dark:border-dark-border
                 [&_a]:text-main-accent [&_a]:underline [&_li]:ml-5 [&_ol]:flex [&_ol]:list-decimal
                 [&_ol]:flex-col [&_ol]:gap-2 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2'
      aria-labelledby={id}
    >
      <h2 id={id} className='text-xl font-bold'>
        {title}
      </h2>
      {children}
    </section>
  );
}
