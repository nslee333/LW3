export const nftInstance = async (providerOrSigner) => {
    const nftContract = new Contract(
        RANDOM_GAME_NFT_CONTRACT_ADDRESS,
        abi,
        providerOrSigner
    );
    return nftContract;
};