import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import {sanityClient, urlFor} from "../sanity"
import {Collection} from "../typings"

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  const router = useRouter()

  return (
    <div className='flex flex-col w-full items-center py-20 px-10'>
      <Head>
        <title>NFT App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='text-4xl font-extralight mb-10 cursor-pointer'>
        <span className='font-extrabold underline decoration-pink-600/50'>
            NFT 
        </span>{' '}
        Market Place
      </h1>

      <main className='bg-slate-100 p-10 shadow-xl shadow-rose-400/20'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-4'>
          {collections.map(collection => (
            <div 
              className='flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105'
              onClick={() => router.push(`/nft/${collection.slug.current}`)}
            >
              <img
                className='h-96 w-60 rounded-2xl object-cover' 
                src={urlFor(collection.mainImage).url()} 
                alt="" 
              />

              <div className='p-5'>
                <h2 className='text-3xl'>
                  {collection.title}
                </h2>

                <p className='mt-2 text-sm text-gray-400'>
                  {collection.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      }
    }
  }`

  const collections = await sanityClient.fetch(query)
  // console.log(collections);

  return {
    props: {
      collections
    }
  }
}
