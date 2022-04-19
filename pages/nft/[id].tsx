import React, { useEffect, useState } from 'react';
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import {sanityClient, urlFor} from "../../sanity"
import {Collection} from "../../typings"
import {BigNumber} from 'ethers'
import toast, {Toaster} from 'react-hot-toast';

interface Props {
  collection: Collection
}

function NFTDropPage({collection}: Props) {
    const [claimedSupply, setClaimedSuppy] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const [priceInEth, setPriceInEth] = useState<String>();

    const [loading, setLoading] = useState<boolean>(true);

    const nftDrop = useNFTDrop(collection.address);

    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

    // console.log(address);

    useEffect(() => {
        if (!nftDrop) return;

        const fetchNFTDropData = async () => {
            setLoading(true);

            const claimed = await nftDrop.getAllClaimed();
            const total = await nftDrop.totalSupply();
            const claimConditions = await nftDrop.claimConditions.getAll();

            setClaimedSuppy(claimed.length);
            setTotalSupply(total);
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)

            setLoading(false);
        };

        fetchNFTDropData();
    }, [nftDrop])

    const mintNft = () => {
        if (!nftDrop || !address) return;

        const quantity = 1;

        setLoading(true);

        const notification = toast.loading("Minting....", {
            style: {
                background: 'white',
                color: 'green',
                fontWeight: 'bolder',
                fontSize: '17px',
                padding: '20px'
            }
        })

        nftDrop
        .claimTo(address, quantity) 
        .then(async (tx) => {
            toast("NFT CLAIMED !!", {
                duration: 8000,
                style: {
                    background: 'green',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px'
                }
            })
        })
        .catch((err) => {
            console.log(err)
            toast("Whoops....Something Went Wrong!", {
                style: {
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px'
                }
            })
        })
        .finally(() => {
            setLoading(false);
            toast.dismiss(notification)
        })  
    };

    return (
        <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
            <Toaster
                position='bottom-center'
            />
            <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
                <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                    <div className='bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl'>
                        <img
                            className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                            src={urlFor(collection.previewImage).url()} 
                            alt=""
                        />
                    </div>

                    <div className='text-center p-5 space-y-2'>
                        <h1 className='text-4xl font-bold text-white'>
                            {collection.nftCollectionName}
                        </h1>

                        <h2 className='text-xl text-gray-300'>
                            {collection.description}
                        </h2>
                    </div>
                </div>
            </div>

            <div className='flex flex-1 flex-col p-10 lg:col-span-6'>
                <header className='flex items-center justify-between'>
                    <Link href={"/"} >
                        <h1 
                            className='w-52 cursor-pointer text-xl font-extralight sm:w-80'
                        >
                            <span className='font-extrabold underline decoration-pink-600/50'>
                                NFT 
                            </span>{' '}
                            Market Place
                        </h1>
                    </Link>
                    

                    {
                        address ? (
                            <button 
                                className='rounded-full bg-slate-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'
                                onClick={() => disconnect()}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button 
                                className='rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'
                                onClick={() => connectWithMetamask()}
                            >
                                Sign In
                            </button>
                        )
                    }
 
                </header>

                <hr className='my-2 border' />

                {address && (
                    <p className='text-center text-sm text-rose-400'>
                        You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}
                    </p>
                )}

                <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
                    <img
                        className='w-80 object-cover pb-10 lg:h-40' 
                        src={urlFor(collection.mainImage).url()} 
                        alt=""
                    />

                    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>
                        {collection.title}
                    </h1>

                    {loading ? (
                        <>
                        <p className='animate-pulse pt-2 text-xl text-purple-500'>
                            Loading Supply Count......
                        </p>

                        <img
                            className='h-60 w-60 object-contain'
                            src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
                            // src="https://cdn.dribbble.com/users/563824/screenshots/3633228/media/b620ccb3ae8c14ea5447d159ebb1da58.gif"
                        />
                        </>
                    ) : (
                        <p className='pt-2 text-xl text-green-500'>
                            {claimedSupply} / {totalSupply?.toString()} NFT's claimed
                        </p>
                    )}

                    
                </div>

                <button
                    onClick={mintNft}
                    disabled = {loading || claimedSupply === totalSupply?.toNumber() || !address} 
                    className='h-16 bg-red-600 w-full text-white rounded-full font-bold disabled:bg-gray-500'
                >
                    {loading ? (
                        <>Loading</>
                    ) : (
                        claimedSupply === totalSupply?.toNumber() ? (
                            <>SOLD OUT</>
                        ) : (
                            !address ? (
                                <>Sign In to Mint</>
                            ) : (
                                <span className='font-bold'>
                                    Mint NFT ({priceInEth} ETH)
                                </span>
                            )
                        )
                    )}
                </button>
            </div>
        </div>
    )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const query = `*[_type == "collection" && slug.current == $id][0]{
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
    
    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if (!collection) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            collection
        }
    }
}
