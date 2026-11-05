import Head from 'next/head';
import {
  siteName,
  siteURL,
  siteImage,
  brandColor,
  siteDescription
} from '@lib/site';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>{siteName}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content={brandColor} />
      <meta name='description' content={siteDescription} key='description' />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={siteName} key='og:title' />
      <meta
        property='og:description'
        content={siteDescription}
        key='og:description'
      />
      <meta
        property='og:image'
        content={`${siteURL}${siteImage}`}
        key='og:image'
      />
      <meta name='twitter:card' content='summary_large_image' />
      <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      <link rel='icon' href='/favicon.ico' sizes='any' />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
    </Head>
  );
}
