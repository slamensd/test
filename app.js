const contractAddress = "0x232765be70a5f0b49e2d72eee9765813894c1fc4";
const tokenId = 6;
const abi = [ [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"internalType":"address","name":"diamondCutFacet","type":"address"},{"internalType":"address","name":"diamondLoupeFacet","type":"address"},{"internalType":"address","name":"erc165Facet","type":"address"},{"internalType":"address","name":"erc173Facet","type":"address"}],"internalType":"struct Diamond.CoreFacets","name":"_coreFacets","type":"tuple"},{"components":[{"internalType":"address","name":"facetAddress","type":"address"},{"internalType":"enum IDiamondCut.FacetCutAction","name":"action","type":"uint8"},{"internalType":"bytes4[]","name":"functionSelectors","type":"bytes4[]"}],"internalType":"struct IDiamondCut.FacetCut[]","name":"_facets","type":"tuple[]"},{"components":[{"internalType":"address","name":"initContract","type":"address"},{"internalType":"bytes","name":"initData","type":"bytes"}],"internalType":"struct Diamond.Initialization[]","name":"_initializations","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"facet","type":"address"},{"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"ErrDiamondFacetAlreadyExists","type":"error"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}] ];

async function init() {
    const provider = await detectEthereumProvider();

    if (provider) {
        web3 = new Web3(provider);
        initApp();
    } else {
        alert("Please install MetaMask to use this application.");
    }
}

async function initApp() {
    const connectWalletButton = document.getElementById("connectWallet");
    const walletAddressElement = document.getElementById("walletAddress");
    const tokenBalanceElement = document.getElementById("tokenBalance");
    const burnTokenButton = document.getElementById("burnToken");
    
    connectWalletButton.addEventListener("click", async () => {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        walletAddressElement.textContent = `Connected wallet: ${account}`;

        const erc1155 = new web3.eth.Contract(abi, contractAddress);
        const balance = await erc1155.methods.balanceOf(account, tokenId).call();
        tokenBalanceElement.textContent = `You have ${balance} tokens with ID ${tokenId}`;

        if (balance > 0) {
            burnTokenButton.style.display = "block";
            burnTokenButton.addEventListener("click", async () => {
                await erc1155.methods.safeTransferFrom(account, "0x000000000000000000000000000000000000dEaD", tokenId, 1, "0x").send({ from: account });
                const newBalance = await erc1155.methods.balanceOf(account, tokenId).call();
                tokenBalanceElement.textContent = `You have ${newBalance} tokens with ID ${tokenId}`;

                if (newBalance < balance) {
                    document.getElementById("hiddenMessage").style.display = "block";
                }
            });
        }
    });
}

init();
