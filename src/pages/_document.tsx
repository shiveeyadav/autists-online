import { Html, Head, Main, NextScript } from 'next/document';
import { defaultSettings } from '@lib/types/settings';
import { earlySettingsScript } from '@lib/settings-script';

export default function Document(): JSX.Element {
  return (
    <Html
      lang='en'
      data-calm={String(defaultSettings.calmMode)}
      data-font={defaultSettings.font}
      data-text-size={defaultSettings.textSize}
    >
      <Head>
        <script dangerouslySetInnerHTML={{ __html: earlySettingsScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
