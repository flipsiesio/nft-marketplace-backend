export type ParamBid = {
    block: number,
    timestamp: number,
    contract: string,
    name: string,
    transaction: string,
    orderIndex: number,
    seller: string,
    expirationTime: number,
    buyer: string,
    tokenId: number,
    createdTokenId?: number,
};

export type ParamSale = {
    block: number,
    timestamp: number,
    contract: string,
    name: string,
    transaction: string,
    orderIndex: number,
    seller: string,
    buyer: string,
    price: string,
    expirationTime: number,
    tokenId: number,
    createdTokenId?: number,
};
