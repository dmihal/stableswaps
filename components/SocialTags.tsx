import React from 'react';
import Head from 'next/head';

const SocialTags: React.FC = () => {
  return (
    <Head>
      <meta property="og:title" content="MoneyPrinter.info" />
      <meta
        property="og:image"
        content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/social/top.png`}
      />
      <meta
        property="og:description"
        content="How much money are protocols paying to grow?"
      />

      <meta name="twitter:title" content="MoneyPrinter.info" />
      <meta
        name="twitter:description"
        content="How much money are protocols paying to grow?"
      />
      <meta
        name="twitter:image"
        content={`https://${
          process.env.NEXT_PUBLIC_VERCEL_URL
        }/api/social/top.png?${new Date().getDate()}`}
      />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SocialTags;
