const CONTRACT_ADDRESS = '0x232765be70a5f0b49e2d72eee9765813894c1fc4';

const ABI = [
  // Paste the ABI here
];

const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, ethersProvider);

const connectWalletBtn = document.getElementById('connect-wallet-btn');
const nftGrid = document.getElementById('nft-grid');

connectWalletBtn.addEventListener('click', async () => {
  try {
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
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
