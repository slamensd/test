const CONTRACT_ADDRESS = '0x232765be70a5f0b49e2d72eee9765813894c1fc4';

const ABI = [
    {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"internalType":"address","name":"diamondCutFacet","type":"address"},{"internalType":"address","name":"diamondLoupeFacet","type":"address"},{"internalType":"address","name":"erc165Facet","type":"address"},{"internalType":"address","name":"erc173Facet","type":"address"}],"internalType":"struct Diamond.CoreFacets","name":"_coreFacets","type":"tuple"},{"components":[{"internalType":"address","name":"facetAddress","type":"address"},{"internalType":"enum IDiamondCut.FacetCutAction","name":"action","type":"uint8"},{"internalType":"bytes4[]","name":"functionSelectors","type":"bytes4[]"}],"internalType":"struct IDiamondCut.FacetCut[]","name":"_facets","type":"tuple[]"},{"components":[{"internalType":"address","name":"initContract","type":"address"},{"internalType":"bytes","name":"initData","type":"bytes"}],"internalType":"struct Diamond.Initialization[]","name":"_initializations","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"facet","type":"address"},{"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"ErrDiamondFacetAlreadyExists","type":"error"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}
];

const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, ethersProvider);

const connectWalletBtn = document.getElementById('connect-wallet-btn');
const nftGrid = document.getElementById('nft-grid');

connectWalletBtn.addEventListener('click', async () => {
    try {
      await window.ethereum.enable();
      const address = ethereum.selectedAddress;
      const balance = await contract.balanceOf(address);
      const nftIds = [];
      for (let i = 0; i < balance; i++) {
        const nftId = await contract.tokenOfOwnerByIndex(address, i);
        nftIds.push(nftId);
      }
      const nfts = await Promise.all(nftIds.map(async (nftId) => {
        const nft = await contract.getNFT(nftId);
        const name = nft.name;
        const image = nft.image;
        const owned = await contract.balanceOf(address, nftId);
        return { name, image, owned };
      }));
      renderNfts(nfts);
    } catch (error) {
      console.error(error);
    }
  });
  

function renderNfts(nfts) {
  nftGrid.innerHTML = '';
  nfts.forEach((nft) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = nft.image;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = nft.name;
    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = `Owned: ${nft.owned}`;
    cardBody.appendChild(title);
    cardBody.appendChild(text);
    card.appendChild(img);
    card.appendChild(cardBody);
    nftGrid.appendChild(card);
  });
}
