import { useRouter } from 'next/router';
import Head from 'next/head';
import { siteURL } from '@lib/site';

type SEOProps = {
  title: string;
  image?: string;
  description?: string;
};

function absoluteURL(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteURL}${path}`;
}

export function SEO({ title, image, description }: SEOProps): JSX.Element {
  const { asPath } = useRouter();

  const path = asPath.split(/[?#]/)[0];

  return (
    <Head>
      <title>{title}</title>
      <meta property='og:title' content={title} key='og:title' />
      {description && (
        <meta name='description' content={description} key='description' />
      )}
      {description && (
        <meta
          property='og:description'
          content={description}
          key='og:description'
        />
      )}
      {image && (
        <meta property='og:image' content={absoluteURL(image)} key='og:image' />
      )}
      <meta
        property='og:url'
        content={`${siteURL}${path === '/' ? '' : path}`}
        key='og:url'
      />
    </Head>
  );
}
