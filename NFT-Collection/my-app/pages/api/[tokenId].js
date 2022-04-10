// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


// Base URI + TokenID
// Base URI = https://example.com/
// Token ID = 1.

// tokenURI(1) => https://example.com/1

export default function handler(req, res) {
    const tokenId = req.query.tokenId;
    const name = 'Crypto Dev #';
    const description = "CryptoDevs is an NFT collection for Web3 Developers."
    const imageURL = 'https://n-nft-collection-ailfad3ah-nslee333.vercel.app/api/'

return res.json({
    name: name + tokenId,
    description: description,
    image: imageURL + tokenId + '.svg',
});
    // the Image needs to be a publically accessable url.

}

// Dynamic APIs NEXT.js -
// In order to start a dynamic API route you name the API in square brackets under ../api/[yourVar].js.
// It runs on the folder structure system, any files inside pages/api/* will create API endpoints like
// /api/*. It works similar to how files and folders under the pages folder map to web page URLs.

// Endpoint is the URL that is exposed by the API that receives requests and sends out responses.
