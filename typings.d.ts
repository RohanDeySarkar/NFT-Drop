interface Image {
    asset: {
        url: string 
    }
}

export interface Creator {
    _id: string
    name: string
    address: string
    slug: {
        current
    }
    image: Image
    bio: string
}

export interface Collection {
    _id: string
    title: string
    description: string
    nftCollectionName: string
    address: string
    slug: {
        current
    }
    creator: Creator
    mainImage: Image
    previewImage: Image
}