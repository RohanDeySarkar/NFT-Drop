import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-red-500 text-4xt font-bold">
        NFT Website!!
      </h1>
    </div>
  )
}

export default Home
