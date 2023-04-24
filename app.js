const contractAddress = "0x9674739124d69d555712a30e0a44de648f494219";
const abiUrl = "https://api.etherscan.io/api?module=contract&action=getabi&address=0x9674739124d69d555712a30e0a44de648f494219";

let web3;
let contract;

async function getOwnerTokenIds(ownerAddress) {
    const tokenIds = [];

    try {
        const totalTokens = await contract.methods.totalSupply().call();
        for (let i = 0; i < totalTokens; i++) {
            const tokenId = await contract.methods.tokenByIndex(i).call();
            const tokenOwner = await contract.methods.ownerOf(tokenId).call();
            if (tokenOwner.toLowerCase() === ownerAddress.toLowerCase()) {
                tokenIds.push(tokenId);
            }
        }
    } catch (error) {
        console.error("Error fetching token IDs:", error);
    }

    return tokenIds;
}
  


async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];
            document.getElementById('wallet-address').textContent = walletAddress;
            document.getElementById('wallet-connect').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            await getContractABI();
            await displayERC721Balance(walletAddress);
            const tokenIds = await getOwnerTokenIds(walletAddress);
            await displayNFTs(tokenIds);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    } else {
        alert("Please install MetaMask or another compatible wallet provider!");
    }
}

async function getContractABI() {
    try {
        const response = await fetch(abiUrl);
        const data = await response.json();
        const abi = JSON.parse(data.result);
        contract = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
        console.error("Error fetching ABI:", error);
    }
}

async function displayERC721Balance(address) {
    try {
        const balance = await contract.methods.balanceOf(address).call();
        document.getElementById('nippy-balance').textContent = balance;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

async function displayNFTs(tokenIds) {
    const nftGrid = document.getElementById('nft-grid');
    const loader = document.getElementById('loader');
    const ipfsGateway = 'https://ipfs.io/ipfs/';
    nftGrid.innerHTML = '';
    loader.style.display = 'block'; // Show loader

    for (const tokenId of tokenIds) {
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const ipfsUrl = tokenURI.replace('ipfs://', ipfsGateway);
        const response = await fetch(ipfsUrl);
        const metadata = await response.json();

        const nft = document.createElement('div');
        nft.className = 'nft';

        const img = document.createElement('img');
        img.src = metadata.image;
        nft.appendChild(img);

        const name = document.createElement('h3');
        name.textContent = metadata.name;
        nft.appendChild(name);

        const traits = ['Character', 'Books', 'Videos', 'Games', 'Toys', 'Music'];

        for (const trait of traits) {
            const attribute = metadata.attributes.find(attr => attr.trait_type === trait);
            if (attribute) {
                const traitElement = document.createElement('p');
                traitElement.textContent = `${trait}: ${attribute.value}`;
                nft.appendChild(traitElement);
            }
        }

        nftGrid.appendChild(nft);
    }
    loader.style.display = 'none'; // Hide loader
}

