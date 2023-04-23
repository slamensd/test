// Initialize Moralis
Moralis.initialize("YOUR_MORALIS_APPLICATION_ID");
Moralis.serverURL = "YOUR_MORALIS_SERVER_URL";

const connectWalletBtn = document.getElementById("connectWallet");
const nftGrid = document.getElementById("nft-grid");

const tokenId = 5;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = window.ethereum.selectedAddress;
      fetchNFTs(address);
    } catch (err) {
      console.error("User rejected connection request");
    }
  } else {
    console.error("Ethereum provider not found");
  }
}

async function fetchNFTs(address) {
  console.log("Fetching NFTs for address:", address);

  const apiKey = "Qdpq4yyBC53Vxx6ApjeOlC0OxtK7wRbhQSMTGVB0WiwEErpGOo1pNqC17kTnBQD6";
  const chain = "0x1"; // Ethereum Mainnet
  const tokenId = 5;
  const url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&token_id=${tokenId}&format=decimal`;

  const options = {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.total === 0) {
      const message = document.createElement("p");
      message.textContent = "You do not have any tokens.";
      document.getElementById("nft-grid").appendChild(message);
    } else {
      const nft = data.result[0];
      const tokenData = {
        image: nft.image_url,
        name: nft.name,
      };
      const quantity = nft.amount;

      displayNFT(tokenData, tokenId, quantity);
    }

    console.log("Fetch NFTs function completed.");
  } catch (error) {
    console.error("Error fetching NFT data:", error);
  }
}


function displayNFT(tokenData, tokenId, quantity) {
  const nftItem = document.createElement("div");
  nftItem.classList.add("nft-item");

  const nftImage = document.createElement("img");
  nftImage.src = tokenData.image;
  nftImage.classList.add("nft-image");

  const nftName = document.createElement("div");
  nftName.innerText = tokenData.name;
  nftName.classList.add("nft-name");

  const nftQuantity = document.createElement("div");
  nftQuantity.innerText = `Owned: ${quantity}`;
  nftQuantity.classList.add("nft-quantity");

  nftItem.appendChild(nftImage);
  nftItem.appendChild(nftName);
  nftItem.appendChild(nftQuantity);
  nftGrid.appendChild(nftItem);
}

connectWalletBtn.addEventListener("click", connectWallet);
