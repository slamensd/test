document.addEventListener("DOMContentLoaded", () => {
  const Moralis = window.Moralis.default;
  const EvmChain = window.MoralisWeb3CommonEvmUtils.EvmChain;

  const apiKey = "Qdpq4yyBC53Vxx6ApjeOlC0OxtK7wRbhQSMTGVB0WiwEErpGOo1pNqC17kTnBQD6";
  const contractAddress = "0x232765be70a5f0b49e2d72eee9765813894c1fc4";
  const tokenId = 5;

  const connectWalletButton = document.getElementById("connectWallet");
  const nftDisplay = document.getElementById("nftDisplay");
  const nftList = document.getElementById("nftList");
  const noTokens = document.getElementById("noTokens");

  const runApp = async () => {
    await Moralis.start({ apiKey });
  };

  const getUserNFTs = async (address) => {
    const options = {
      chain: EvmChain.ETHEREUM,
      address,
      token_id: tokenId,
      asset_contract_address: contractAddress,
    };
    return await Moralis.Web3Data.getNFTsForContract(options);
  };

  const displayNFTs = (nfts) => {
    if (nfts.length === 0) {
      noTokens.classList.remove("hidden");
      nftDisplay.classList.add("hidden");
      return;
    }
    nftList.innerHTML = "";
    for (const nft of nfts) {
      const listItem = document.createElement("li");
      listItem.textContent = `Token ID: ${nft.token_id} - ${nft.name || nft.description || "No name/description available"}`;
      nftList.appendChild(listItem);
    }
    noTokens.classList.add("hidden");
    nftDisplay.classList.remove("hidden");
  };

  connectWalletButton.addEventListener("click", async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = accounts[0];
      const userNFTs = await getUserNFTs(userAddress);
      displayNFTs(userNFTs);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  });

  runApp();
});
