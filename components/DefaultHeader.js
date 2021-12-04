import React from 'react';
import Head from 'next/head';

const DefaultHeader = props => {
  return (
    <div>
      <Head>
        <title>Monote</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  )
}

export default DefaultHeader;