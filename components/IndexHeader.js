import React from 'react';
import Head from 'next/head';

const IndexHeader = props => {
  return (
    <div>
      <Head>
        <title>{props.username}&apos;s notes</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  )
}

export default IndexHeader;