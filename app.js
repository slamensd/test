const connectWalletBtn = document.getElementById("connectWallet");
const nftGrid = document.getElementById("nftGrid");

const contractAddress = "0x232765Be70a5F0B49E2d72eEE9765813894c1fc4";

const abi = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"internalType":"address","name":"diamondCutFacet","type":"address"},{"internalType":"address","name":"diamondLoupeFacet","type":"address"},{"internalType":"address","name":"erc165Facet","type":"address"},{"internalType":"address","name":"erc173Facet","type":"address"}],"internalType":"struct Diamond.CoreFacets","name":"_coreFacets","type":"tuple"},{"components":[{"internalType":"address","name":"facetAddress","type":"address"},{"internalType":"enum IDiamondCut.FacetCutAction","name":"action","type":"uint8"},{"internalType":"bytes4[]","name":"functionSelectors","type":"bytes4[]"}],"internalType":"struct IDiamondCut.FacetCut[]","name":"_facets","type":"tuple[]"},{"components":[{"internalType":"address","name":"initContract","type":"address"},{"internalType":"bytes","name":"initData","type":"bytes"}],"internalType":"struct Diamond.Initialization[]","name":"_initializations","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"facet","type":"address"},{"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"ErrDiamondFacetAlreadyExists","type":"error"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Don't forget to add the ABI of the contract

let provider, signer;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = await signer.getAddress();
      fetchNFTs(address);
    } catch (err) {
      console.error("User rejected connection request");
    }
  } else {
    console.error("Ethereum provider not found");
  }
}

async function fetchNFTs(address) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const balance = await contract.balanceOf(address);
  for (let i = 0; i < balance.toNumber(); i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(address, i);
    const tokenURI = await contract.tokenURI(tokenId);
    const tokenData = await fetch(tokenURI).then((response) => response.json());
    displayNFT(tokenData, tokenId);
  }
}

function displayNFT(tokenData, tokenId) {
  const nftItem = document.createElement("div");
  nftItem.classList.add("nft-item");

  const nftImage = document.createElement("img");
  nftImage.src = tokenData.image;
  nftImage.classList.add("nft-image");

  const nftName = document.createElement("div");
  nftName.innerText = tokenData.name;
  nftName.classList.add("nft-name");

  const nftQuantity = document.createElement("div");
  nftQuantity.innerText = `Owned: ${tokenId.toNumber()}`;
  nftQuantity.classList.add("nft-quantity");

  nftItem.appendChild(nftImage);
  nftItem.appendChild(nftName);
  nftItem.appendChild(nftQuantity);
  nftGrid.appendChild(nftItem);
}

connectWalletBtn.addEventListener("click", connectWallet);
